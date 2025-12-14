import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import env from '#start/env'

export default class SetupInitialUser extends BaseCommand {
    static commandName = 'setup:initial_user'
    static description = 'Cria o usuário admin inicial baseado em variáveis de ambiente'

    static options: CommandOptions = {
        startApp: true
    }

    async run() {
        const email = env.get('ADMIN_EMAIL')
        const password = env.get('ADMIN_PASSWORD')

        if (!email || !password) {
            this.logger.info('Variáveis ADMIN_EMAIL ou ADMIN_PASSWORD não definidas. Pulando setup automático.')
            return
        }

        const userCount = await User.query().count('* as total').first()
        const total = userCount?.$extras.total || 0

        if (Number(total) > 0) {
            this.logger.info('Usuários já existem no sistema. Pulando setup automático.')
            return
        }

        this.logger.info(`Criando usuário admin inicial: ${email}`)

        try {
            await User.create({
                email,
                password,
                isAdmin: true,
            })

            this.logger.success('Usuário admin criado com sucesso via variáveis de ambiente!')
        } catch (error) {
            this.logger.error(`Erro ao criar usuário admin: ${error.message}`)
            process.exitCode = 1
        }
    }
}
