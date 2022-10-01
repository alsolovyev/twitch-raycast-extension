import { request } from 'node:https'
import type { OutgoingHttpHeaders, RequestOptions, IncomingMessage } from 'node:http'


export interface IApiService {
  get<T>(resourcePath: string): Promise<T>
  set headers(headers: OutgoingHttpHeaders)
}

export interface IApiServiceError {
  code: string | number
  error: string
  message: string
}

export default class ApiService implements IApiService {
  private readonly _options: RequestOptions = {}

  constructor(host: string, headers: OutgoingHttpHeaders = {}) {
    this._options.host = host.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
    this._options.headers = headers
  }

  public set headers(headers: OutgoingHttpHeaders) {
    this._options.headers = { ...this._options.headers, ...headers }
  }

  public get<T>(resourcePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
      request({ method: 'GET', path: resourcePath, ...this._options }, (response: IncomingMessage) => {
        let buffer: string = ''

        response.addListener('data', bufferChunk => buffer += bufferChunk)
        response.addListener('close', () => resolve(JSON.parse(buffer)))

      }).addListener('error', ({ name, message }) => {
        reject({ error: name, message })
      }).end()
    })
  }
}
