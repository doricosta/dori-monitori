import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import env from '#start/env'

const connection = new IORedis.default({
  host: env.get('REDIS_HOST'),
  port: env.get('REDIS_PORT'),
  maxRetriesPerRequest: null,
})
export const traceQueue = new Queue('storeTrace', { connection })

export async function shutdown() {
  await traceQueue.close()
  await connection.quit()
}

