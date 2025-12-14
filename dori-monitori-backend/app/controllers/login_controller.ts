import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
    async store({ request, response, auth }: HttpContext) {
        try {
            console.log('Login attempt:', request.body())
            const { email, password } = request.only(['email', 'password'])

            const user = await User.verifyCredentials(email, password)
            const token = await auth.use('api').createToken(user, ['api'], {
                expiresIn: '7d',
                name: 'api_token',
            })

            return response.ok({
                status: 'login com sucesso',
                dados: {
                    token: token,
                }
            })

        } catch (error) {
            return response.badRequest({
                status: 'erro ao fazer login',
                mensagem: 'Email ou senha inválida',
                trace: error?.message
            })
        }

    }
}