import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'
import UserProject from '#models/user_project'

export default class UserProjectsController {
  async index({ request, response }: HttpContext) {
    const userId = request.input('user_id')
    const projectId = request.input('project_id')
    const query = UserProject.query()
    if (userId) query.where('user_id', userId)
    if (projectId) query.where('project_id', projectId)
    const rows = await query
    return response.ok(rows)
  }

  async store({ request, response }: HttpContext) {
    const { user_id, project_id } = request.only(['user_id', 'project_id'])
    const user = await User.find(user_id)
    if (!user) {
      return response.badRequest({ message: 'User not found' })
    }
    const project = await Project.find(project_id)
    if (!project) {
      return response.badRequest({ message: 'Project not found' })
    }
    await user.related('projects').attach([project.id])
    return response.created({ message: 'Attached' })
  }

  async destroy({ request, response }: HttpContext) {
    const { user_id, project_id } = request.only(['user_id', 'project_id'])
    const user = await User.find(user_id)
    const project = await Project.find(project_id)
    if (!user || !project) {
      return response.badRequest({ message: 'User or Project not found' })
    }
    await user.related('projects').detach([project.id])
    return response.noContent()
  }
}

