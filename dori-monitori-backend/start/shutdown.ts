import app from '@adonisjs/core/services/app'
import { shutdown } from '#config/queues'

app.terminating(async () => {
    await shutdown()
})
