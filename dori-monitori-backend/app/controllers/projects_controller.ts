import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { randomUUID } from 'crypto'

export default class ProjectsController {
  async index({ response, auth }: HttpContext) {
    const projects = await Project.query().where('created_by', (auth.user?.id as number))
    return response.ok(projects)
  }

  async store({ auth, request, response }: HttpContext) {
    const { name } = request.only(['name', 'api_key', 'created_by'])
    const ownerId = auth.user?.id 
    if (!ownerId) {
      return response.badRequest({ message: 'Criador não encontrado' })
    }
    const project = await Project.create({
      name,
      apiKey: `dori-${randomUUID()}`,
      createdBy: ownerId,
    })
    return response.created(project)
  }

  

  async destroy({ params, response, auth }: HttpContext) {
    const project = await Project.query().where('id', params.id).where('created_by', (auth.user?.id as number)).first()
    if (!project) {
      return response.notFound({ message: 'Projeto não encontrado' })
    }
    await project.delete()
    return response.noContent()
  }
}

