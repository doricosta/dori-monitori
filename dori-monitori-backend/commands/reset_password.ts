import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class ResetPassword extends BaseCommand {
    static commandName = 'reset:password'
    static description = 'Reseta a senha do usuário admin'

    static options: CommandOptions = {
        startApp: true
    }

    async run() {
        const email = 'admin@example.com'
        const password = '123456'

        this.logger.info(`Buscando usuário ${email}...`)
        const user = await User.findBy('email', email)

        if (!user) {
            this.logger.error('Usuário não encontrado!')
            return
        }

        this.logger.info('Usuário encontrado. Salvando senha em plain text (testando auto-hash)...')
        user.password = password
        await user.save()

        this.logger.success('Senha atualizada com sucesso!')
        this.logger.info(`Nova senha: ${password}`)
        this.logger.info(`Hash no objeto user após save: ${user.password}`)

        const isValid = await hash.verify(user.password, password)
        this.logger.info(`Verificação DEPOIS do save: ${isValid ? 'SUCESSO' : 'FALHA'}`)
    }
}
