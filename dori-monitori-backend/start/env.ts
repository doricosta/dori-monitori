import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  CLICKHOUSE_HOST: Env.schema.string.optional({ format: 'url', tld: false }),
  CLICKHOUSE_USER: Env.schema.string.optional(),
  CLICKHOUSE_PASSWORD: Env.schema.string.optional(),
  CLICKHOUSE_DB: Env.schema.string.optional(),
  CLICKHOUSE_REQUEST_TIMEOUT: Env.schema.number.optional(),
  CLICKHOUSE_COMPRESSION_REQUEST: Env.schema.boolean.optional(),
  CLICKHOUSE_COMPRESSION_RESPONSE: Env.schema.boolean.optional(),

  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  ADMIN_EMAIL: Env.schema.string({ format: 'email' }),
  ADMIN_PASSWORD: Env.schema.string(),
})
