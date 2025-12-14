# Dori Monitori SDK

SDK simples e plugável para tracing e logging de requisições. Funciona hoje com Node.js/Express e foi pensado para ser portável a React e Vue em próximas versões.

Esse SDK captura metadados da requisição, body/query quando presentes, tempos de início/fim, status code e, opcionalmente, o payload da resposta. Envia logs e traces para seu backend de telemetria.

## Funcionalidades
- Wrapper de rota para Express que intercepta métodos de resposta (`send`, `json`, `end`, `sendFile`)
- Logs estruturados com dados da requisição e resposta opcional
- Traces leves com timestamps de início/fim, duração, status code e metadata
- Endpoints configuráveis para logs e traces
- Suporte a `x-api-key` via variável de ambiente ou setter programático

## Instalação
```bash
npm install dori-monitori-sdk
```

## Início Rápido (Express)
```js
import express from 'express'
import { dm_middleware, routeWrapper } from 'dori-monitori-sdk/client/nodejs-express'

dm_middleware.setLogUrl('https://logs.service.example')
dm_middleware.setTraceUrl('https://traces.service.example')
dm_middleware.setApiKey(process.env.DORI_MONITORI_API_KEY)

const app = express()
app.use(express.json())

app.get(
  '/',
  routeWrapper(async (req, res) => {
    const valor = 1
    const resultado = await Promise.resolve(2)
    res.send('olá ' + valor)
    return { valor, resultado }
  })
)

app.listen(3000)
```

## Variáveis de Ambiente
- `DORI_MONITORI_LOG_URL` ou `DM_LOG_URL`
- `DORI_MONITORI_TRACE_URL` ou `DM_TRACE_URL`
- `DORI_MONITORI_API_KEY` ou `DM_API_KEY`
- `LOG_RESPONSES` ou `DORI_MONITORI_LOG_RESPONSES` (`true` para incluir `response` no log)

## API
- `routeWrapper(handler, metadata?)`
  - Envolve um handler de rota do Express para capturar timing, status, tamanho, body/query e user-agent.
  - Faz merge de qualquer objeto retornado pelo handler em `metadata`.
- `setLogUrl(url)` / `getLogUrl()`
- `setTraceUrl(url)` / `getTraceUrl()`
- `setApiKey(key)` / `getApiKey()`
- `sendLog(logData)` envia logs diretamente se necessário.
- `sendTrace(traceData)` envia traces diretamente se necessário.

## Formatos de Dados
- Payload de trace:
```json
{
  "metodo": "GET",
  "path": "/",
  "status_code": 200,
  "duracao_ms": 12,
  "tamanho": 17,
  "ip": "127.0.0.1",
  "user_agent": "Mozilla/5.0",
  "metadata": { "valor": 1, "resultado": 2 },
  "corpo": { "sample": "data" },
  "query": { "q": "test" }
}
```
  
## Logs
- Ainda não implementados. Serão adicionados em versões futuras com chaves e formato a definir.

## Projeto
- Referência do projeto: https://github.com/doricosta/dori-monitori
  - Aceita `POST` em JSON para logs e traces nas URLs configuradas
  - Requer cabeçalho `x-api-key`

## Notas
- Requer `fetch` disponível no Node.js (Node 18+).
- Baixo overhead: usa `setImmediate` para despachar I/O de rede.
