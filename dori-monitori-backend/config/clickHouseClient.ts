import { createClient } from '@clickhouse/client'
import env from '#start/env'

const clickhouse = createClient({
      url: env.get('CLICKHOUSE_HOST') ,
      username: env.get('CLICKHOUSE_USER') ,
      password: env.get('CLICKHOUSE_PASSWORD'),
      database: env.get('CLICKHOUSE_DB') ,
      request_timeout: Number(env.get('CLICKHOUSE_REQUEST_TIMEOUT')),
      compression: {
        request: Boolean(env.get('CLICKHOUSE_COMPRESSION_REQUEST')),
        response: Boolean(env.get('CLICKHOUSE_COMPRESSION_RESPONSE')),
      },
    })

export { clickhouse }