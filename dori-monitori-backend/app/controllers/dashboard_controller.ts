import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'
import clickhouse from 'adonis-clickhouse/services/main'

export default class DashboardController {
  async index({ response, auth }: HttpContext) {
    const projects = await Project.query().where('created_by', auth.user!.id)

    if (projects.length === 0) {
      return response.ok({
        status: 'dashboard',
        dados: {
          message: 'Bem-vindo ao dashboard! Crie seu primeiro projeto para começar.',
          projectsCount: 0,
          tracesCount: 0,
          successRate: 0,
          errorRate: 0,
          avgDurationMs: 0,
          projects: []
        }
      })
    }

    const projectKeys = projects.map(p => `'${p.apiKey}'`).join(',')

    const statsQuery = `
      SELECT 
        COUNT(*) as total_traces,
        countIf(status_code >= 200 AND status_code < 400) as success_count,
        countIf(status_code >= 400) as error_count,
        AVG(duracao_ms) as avg_duration,
        MIN(timestamp) as first_trace,
        MAX(timestamp) as last_trace
      FROM traces 
      WHERE project_api_key IN (${projectKeys})
    `

    const statsRows = await (await clickhouse.query({ query: statsQuery, format: 'JSONEachRow' })).json<{
      total_traces: number
      success_count: number
      error_count: number
      avg_duration: number
      first_trace: string | null
      last_trace: string | null
    }[]>()
    const stats = statsRows[0] || {
      total_traces: 0,
      success_count: 0,
      error_count: 0,
      avg_duration: 0,
      first_trace: null,
      last_trace: null
    }

    const totalTraces = Number(stats.total_traces) || 0
    const successCount = Number(stats.success_count) || 0
    const errorCount = Number(stats.error_count) || 0

    const successRate = totalTraces > 0
      ? ((successCount / totalTraces) * 100).toFixed(2)
      : '0.00'

    const errorRate = totalTraces > 0
      ? ((errorCount / totalTraces) * 100).toFixed(2)
      : '0.00'

    const tracesPerProjectQuery = `
      SELECT 
        project_api_key,
        COUNT(*) as count,
        AVG(duracao_ms) as avg_duration
      FROM traces
      WHERE project_api_key IN (${projectKeys})
      AND timestamp >= NOW() - INTERVAL 24 HOUR
      GROUP BY project_api_key
      ORDER BY count DESC
    `

    const tracesPerProjectRows = await (await clickhouse.query({
      query: tracesPerProjectQuery,
      format: 'JSONEachRow',
    })).json<{
      project_api_key: string
      count: number
      avg_duration: number
    }[]>()

    const projectsData = projects.map(project => {
      const projectStats = tracesPerProjectRows.find(
        t => t.project_api_key === project.apiKey
      )

      return {
        id: project.id,
        name: project.name,
        traces_24h: projectStats ? Number(projectStats.count) : 0,
        avg_duration_24h: projectStats
          ? Number(projectStats.avg_duration).toFixed(2)
          : '0.00'
      }
    })

    const topEndpointsQuery = `
      SELECT 
        path,
        COUNT(*) as count,
        AVG(duracao_ms) as avg_duration,
        quantile(0.95)(duracao_ms) as p95_duration
      FROM traces
      WHERE project_api_key IN (${projectKeys})
      AND timestamp >= NOW() - INTERVAL 24 HOUR
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `

    const topEndpointsRows = await (await clickhouse.query({ query: topEndpointsQuery, format: 'JSONEachRow' })).json<{
      path: string
      count: number
      avg_duration: number
      p95_duration: number
    }[]>()

    const tracesPerHourQuery = `
      SELECT 
        toStartOfHour(timestamp) as hour,
        COUNT(*) as count,
        AVG(duracao_ms) as avg_duration,
        countIf(status_code >= 400) as errors
      FROM traces
      WHERE project_api_key IN (${projectKeys})
      AND timestamp >= NOW() - INTERVAL 24 HOUR
      GROUP BY hour
      ORDER BY hour ASC
    `

    const tracesPerHourRows = await (await clickhouse.query({ query: tracesPerHourQuery, format: 'JSONEachRow' })).json<{
      hour: string
      count: number
      avg_duration: number
      errors: number
    }[]>()

    return response.ok({
      status: 'dashboard',
      dados: {
        message: 'Bem-vindo ao dashboard!',

        resumo: {
          projectsCount: projects.length,
          tracesCount: totalTraces,
          successRate: `${successRate}%`,
          errorRate: `${errorRate}%`,
          avgDurationMs: Number(stats.avg_duration || 0).toFixed(2),
          firstTrace: stats.first_trace,
          lastTrace: stats.last_trace
        },

        projects: projectsData,

        topEndpoints: topEndpointsRows.map(endpoint => ({
          path: endpoint.path,
          requests: Number(endpoint.count),
          avgDuration: Number(endpoint.avg_duration).toFixed(2),
          p95Duration: Number(endpoint.p95_duration).toFixed(2)
        })),

        timeline: tracesPerHourRows.map(hour => ({
          hour: hour.hour,
          requests: Number(hour.count),
          avgDuration: Number(hour.avg_duration).toFixed(2),
          errors: Number(hour.errors)
        }))
      }
    })
  }
}
