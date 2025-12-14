import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { clickhouse } from '#config/clickHouseClient'

export default class ClickhouseSetup extends BaseCommand {
  static commandName = 'clickhouse:setup'
  static description = 'Cria as tabelas no Clickhouse'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Criando tabela "traces" no Clickhouse')
    
    
    await clickhouse.query({ query: `
      CREATE TABLE IF NOT EXISTS traces
      (
        trace_id UUID,
        project_api_key String,

        timestamp DateTime DEFAULT now(),

        metodo LowCardinality(String),
        path String,
        status_code UInt16,

        duracao_ms UInt32,
        tamanho UInt32,

        ip String,
        user_agent String,

        metadata JSON,
        corpo JSON,
        query JSON,

        created_at DateTime DEFAULT now()
      )
      ENGINE = MergeTree
      ORDER BY (timestamp)
      TTL timestamp + INTERVAL 30 DAY
    `})
    this.logger.info('Tabela "traces" criada com sucesso')
  }
}
