import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SetupController {
    async store({ request, response }: HttpContext) {
        const userCount = await User.query().count('* as total').first()
        const total = userCount?.$extras.total || 0

        if (Number(total) > 0) {
            return response.forbidden({
                status: 'erro',
                mensagem: 'O setup já foi realizado. Usuários já existem no sistema.',
            })
        }

        const { email, password } = request.only(['email', 'password'])

        if (!email || !password) {
            return response.badRequest({
                status: 'erro',
                mensagem: 'Email e senha são obrigatórios.',
            })
        }

        try {
            const user = await User.create({
                email,
                password,
                isAdmin: true,
            })

            return response.created({
                status: 'sucesso',
                mensagem: 'Usuário admin criado com sucesso.',
                dados: {
                    id: user.id,
                    email: user.email,
                }
            })
        } catch (error) {
            return response.badRequest({
                status: 'erro',
                mensagem: 'Erro ao criar usuário: ' + error.message,
            })
        }
    }
}
