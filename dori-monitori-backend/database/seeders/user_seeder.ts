import User from '#models/user'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const hashed = await hash.make(env.get('ADMIN_PASSWORD'))
    await User.updateOrCreate({
      email: env.get('ADMIN_EMAIL'),
    }, {
      password: hashed,
      isAdmin: true,
    })
  }
}
