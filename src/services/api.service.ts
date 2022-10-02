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

export const SUCCESSFUL_STATUS_CODES: [number, number] = [200, 299]
export const API_SERVICE_PARSE_ERROR: IApiServiceError = {
  code: -1,
  error: 'SyntaxError',
  message: 'Unable to parse response as JSON'
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

  public get<T, B = IApiServiceError>(resourcePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
      request({ method: 'GET', path: resourcePath, ...this._options }, (response: IncomingMessage) => {
        let buffer: string = ''

        response.addListener('data', bufferChunk => buffer += bufferChunk)
        response.addListener('close', () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const responseData: { [key: string]: any } = JSON.parse(buffer)
            /** ToDo: handle errors by status codes (3**, 4**, etc) */
            response.statusCode && this._isNumberBetween(response.statusCode, ...SUCCESSFUL_STATUS_CODES)
              ? resolve(responseData as T)
              : reject(responseData as B)
          } catch (_) {
            reject(API_SERVICE_PARSE_ERROR)
          }
        })
      })
        .addListener('error', ({ code, message, name }: { [key: string]: string }) => {
          /* ToDo: deal with the type of error */
          reject({ code, error: name, message } as IApiServiceError)
        })
        .end()
    })
  }

  private _isNumberBetween(number: number, from: number, to: number): boolean {
    return number >= from && number <= to ? true : false
  }
}
