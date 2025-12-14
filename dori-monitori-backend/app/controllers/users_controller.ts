import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class UsersController {
  async index({ response, auth }: HttpContext) {
    if (auth.user?.isAdmin !== true) {
      return response.unauthorized({ message: 'Apenas usuários administradores podem visualizar todos os usuários' })
    }
    const users = await User.all()
    return response.ok({
      status: 'sucesso',
      data: users,
    })
  }
  show({response, auth}: HttpContext) {
    return response.ok({
      status: 'sucesso',
      data: {
        email: auth.user?.email,
      },
    })
  }
  async store({ request, response, auth, }: HttpContext) {
    try {
      
    if (auth.user?.isAdmin !== true) {
      return response.unauthorized({ status: 'erro', message: 'Apenas usuários administradores podem criar novos usuários' })
    }

    const { email } = request.only(['email', 'password'])
    const generatedPassword = Math.random().toString(36).slice(-8)
    const hashed = await hash.make(generatedPassword)

    await User.create({
      email,
      password: hashed
    })
    return response.created({email, password: generatedPassword})
    } catch (error) {
      return response.badRequest({
        status: 'erro ao criar usuário',
        mensagem: error.message,
      })
    }
  }

  async update({}: HttpContext) {}

  async destroy({ params, response, auth }: HttpContext) {
    if (auth.user?.isAdmin !== true) {
      return response.unauthorized({ status: 'erro', message: 'Apenas usuários administradores podem excluir usuários' })
    }
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ status: 'erro', message: 'User not found' })
    }
    await user.delete()
    return response.noContent()
  }
}

