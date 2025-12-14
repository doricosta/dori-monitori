import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import env from '#start/env'
import { clickhouse } from '#config/clickHouseClient'

const connection = new IORedis.default({
  host: env.get('REDIS_HOST'),
  port: env.get('REDIS_PORT'),
  password: env.get('REDIS_PASSWORD'),
  maxRetriesPerRequest: null,
})

const worker = new Worker('storeTrace', async job => {
  try {
    await clickhouse.insert({
      table: 'traces',
      values: [job.data],
      format: 'JSONEachRow',
    })
    console.log('Trace inserido com sucesso:', job.data)
  } catch (error) {
    console.error('Erro ao inserir trace:', error)
    throw error
  }
}, { connection })

console.log('Worker storeTrace iniciado', {
  redis: `${env.get('REDIS_HOST')}:${env.get('REDIS_PORT')}`,
})

worker.on('active', (job) => {
  console.log('Processando trace', { id: job.id })
})

worker.on('completed', (job) => {
  console.log('Trace processado com sucesso', { id: job.id })
})

worker.on('failed', (job, err) => {
  console.error('Falha ao processar trace', { id: job?.id, erro: err.message })
})

worker.on('error', (err) => {
  console.error('Erro no worker storeTrace', err)
})
