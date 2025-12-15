export interface LogData {
  metodo: string
  path: string
  status_code: number
  duracao_ms: number
  tamanho: number
  ip?: string
  user_agent?: string
  metadata?: Record<string, any>
  corpo?: any
  query?: any
}
export interface TraceData {
  metodo: string
  path: string
  status_code: number
  duracao_ms: number
  tamanho: number
  ip?: string
  user_agent?: string
  metadata?: Record<string, any>
  corpo?: any
  query?: any
}
export type ExpressHandler = (req: any, res: any) => any | Promise<any>
export declare function routeWrapper(handler: ExpressHandler, metadata?: Record<string, any>): (req: any, res: any, next: any) => Promise<void>
export declare function sendTrace(traceData: TraceData): Promise<void>
export type QueueHandler = (job: any) => any | Promise<any>
export declare function queueWrapper(handler: QueueHandler, metadata?: Record<string, any>): (job: any) => Promise<any>
export declare function setLogUrl(url: string | null): void
export declare function getLogUrl(): string | null
export declare function setTraceUrl(url: string | null): void
export declare function getTraceUrl(): string | null
export declare function setApiKey(key: string | null): void
export declare function getApiKey(): string | null
export declare function shouldLogResponses(): boolean
export declare const dm_middleware: {
  routeWrapper: typeof routeWrapper
  queueWrapper: typeof queueWrapper
  sendLog: typeof sendLog
  sendTrace: typeof sendTrace
  setLogUrl: typeof setLogUrl
  getLogUrl: typeof getLogUrl
  setTraceUrl: typeof setTraceUrl
  getTraceUrl: typeof getTraceUrl
  setApiKey: typeof setApiKey
  getApiKey: typeof getApiKey
  shouldLogResponses: typeof shouldLogResponses
}
export {}
