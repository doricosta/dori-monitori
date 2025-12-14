import env from '#start/env'
import { defineConfig } from 'adonis-clickhouse'
import { InferConnections } from 'adonis-clickhouse/types'

const clickhouseConfig = defineConfig({
  connection: 'main',

  connections: {
    main: {
      host: env.get('CLICKHOUSE_HOST', 'http://localhost:8123'),
      request_timeout: env.get('CLICKHOUSE_REQUEST_TIMEOUT', 30000),
      compression: {
        request: env.get('CLICKHOUSE_COMPRESSION_REQUEST', false),
        response: env.get('CLICKHOUSE_COMPRESSION_RESPONSE', true),
      },
      username: env.get('CLICKHOUSE_USER', 'default'),
      password: env.get('CLICKHOUSE_PASSWORD', ''),
      application: 'clickhouse-js',
      database: env.get('CLICKHOUSE_DB', 'default'),
      clickhouse_settings: {},
    },
  },
})

export default clickhouseConfig

declare module 'adonis-clickhouse/types' {
  export interface Connections extends InferConnections<typeof clickhouseConfig> {}
}