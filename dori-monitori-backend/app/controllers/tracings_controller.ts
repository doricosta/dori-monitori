import { traceQueue } from '#config/queues'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'
import clickhouse from 'adonis-clickhouse/services/main'
import redis from '@adonisjs/redis/services/main'

export default class TracingsController {
 async index({ response, request, auth }: HttpContext) {
  const user = auth.user
  const projectTarget = request.qs().projectID

  const cacheKey = `project:${user?.id}:${projectTarget}`
  let projectKey = await redis.get(cacheKey)

  if (!projectKey) {
    const project = await Project.query()
      .select('apiKey') 
      .where('created_by', user?.id as number)
      .where('id', projectTarget)
      .first()

    if (!project) {
      return response.badRequest({
        status: 'erro ao buscar projeto',
        mensagem: 'projeto não encontrado',
      })
    }

    projectKey = project.apiKey
    await redis.set(cacheKey, projectKey, 'EX', 300) // 5 min
  }

  const page = Number(request.qs().page) || 1
  const limit = Math.min(Number(request.qs().limit) || 50, 50)
  const offset = (page - 1) * limit

  const result = await clickhouse.query({
    query: 'SELECT * FROM traces WHERE project_api_key = {key:String} ORDER BY timestamp DESC LIMIT {limit:UInt32} OFFSET {offset:UInt32}',
    query_params: {
      key: projectKey,
      limit,
      offset,
    },
    format: 'JSONEachRow',
  })

  const data = await result.json()

  return response.ok({
    status: 'success',
    page,
    limit,
    data,
  })
}

  async store({ request, response }: HttpContext) {
    try {
    const apiKey = request.header('x-api-key')
    if (!apiKey) {
      return response.badRequest({
        status: 'erro ao fazer requisição',
        mensagem: 'api key não informada',
      })
    }

    let projectName = await redis.get(`apikey:${apiKey}`) 
    if (!projectName) {
      const project = await Project.query()
        .where('apiKey', apiKey)
        .first()
      if (!project) {
        return response.badRequest({
          status: 'erro ao fazer requisição',
          mensagem: 'api key inválida',
        })
      }
      projectName = project.name
      await redis.set(`apikey:${apiKey}`, projectName, 'EX', 60 * 60) // 1 hora
    }

    const {
      metodo,
      path,
      status_code,
      duracao_ms,
      tamanho,
      ip,
      user_agent,
      metadata,
      corpo,
      query,
    } = request.only([
      'metodo',
      'path',
      'status_code',
      'duracao_ms',
      'tamanho',
      'ip',
      'user_agent',
      'metadata',
      'corpo',
      'query',
    ]) 
    await traceQueue.add('storeTraceJob', {
      trace_id: crypto.randomUUID(),
      project_api_key: apiKey,
      metodo,
      path,
      status_code,
      duracao_ms,
      tamanho,
      ip,
      user_agent,
      metadata,
      corpo,
      query,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    })
    return response.accepted({
      status: 'success',
    })
    } catch (error) {
      return response.badRequest({
        status: 'erro ao fazer requisição',
        mensagem: error.message,
      })
    }
  }
}