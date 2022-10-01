import ApiService from './api.service'
import https from 'node:https'
import nock from 'nock'
import type { IApiServiceError } from './api.service'
import type { OutgoingHttpHeaders } from 'node:http'


describe('Api Service module', () => {
  const defaultHost: string = 'https://example.com'
  const defaultPath: string = '/path/to'

  it('should set the correct hostname', () => {
    const url: string = 'example.com'

    const firstApiService = new ApiService('https://' + url)
    expect(firstApiService['_options'].host).toBe(url)

    const secondApiService = new ApiService('http://' + url)
    expect(secondApiService['_options'].host).toBe(url)

    const fourthApiService = new ApiService('https://www.' + url)
    expect(fourthApiService['_options'].host).toBe(url)

    const fifthApiService = new ApiService('www.' + url)
    expect(fifthApiService['_options'].host).toBe(url)

    const sixthApiService = new ApiService('http://www.' + url)
    expect(sixthApiService['_options'].host).toBe(url)

    const thirdApiService = new ApiService(url)
    expect(thirdApiService['_options'].host).toBe(url)
  })

  it('should set the correct headers', () => {
    const apiServiceWithoutHeaders = new ApiService('https://example.com')
    expect(apiServiceWithoutHeaders['_options'].headers).toStrictEqual({})

    const initialHeaders: OutgoingHttpHeaders = { 'Content-Type': 'text/xml' }
    const newHeaders: OutgoingHttpHeaders = { 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
    const apiService = new ApiService('https://example.com', initialHeaders)

    expect(apiService['_options'].headers).toStrictEqual(initialHeaders)

    apiService.headers = newHeaders
    expect(apiService['_options'].headers).toStrictEqual(newHeaders)
    expect(apiService['_options'].headers?.['Content-Type']).toBe(newHeaders['Content-Type'])
  })

  it('should send a GET request successfully', async () => {
    const data: { [key: string]: string } = { key: 'value' }

    nock(defaultHost).get(defaultPath).reply(200, data)

    const spyHTTPRequest = jest.spyOn(https, 'request')
    const apiService = new ApiService(defaultHost)
    const response = await apiService.get<typeof data>(defaultPath)

    expect(spyHTTPRequest).toHaveBeenCalled()
    expect(response).toStrictEqual(data)
  })

  it('should catch server errors', async () => {
    const apiService = new ApiService(defaultHost)
    const error404: Partial<IApiServiceError> = { code: 404, error: 'Not Found' }
    const error502: Partial<IApiServiceError> = { code: 502, error: 'Bad Gateway' }

    nock(defaultHost).get(defaultPath).reply(404, error404)
    await expect(apiService.get<unknown, typeof error404>(defaultPath)).rejects.toStrictEqual(error404)

    nock(defaultHost).get(defaultPath).reply(502, error502)
    await expect(apiService.get<unknown, typeof error502>(defaultPath)).rejects.toStrictEqual(error502)
  })

  it('should catch system errors', async () => {
    const apiService = new ApiService(defaultHost)
    const responseError: { [key: string]: string | number } = {
      message: 'getaddrinfo ENOTFOUND https://example.com',
      name: 'ENOTFOUND',
      code: 404
    }
    const rejectedError: IApiServiceError = {
      message: 'getaddrinfo ENOTFOUND https://example.com',
      error: 'ENOTFOUND',
      code: 404
    }

    nock(defaultHost).get(defaultPath).replyWithError(responseError)
    await expect(apiService.get<unknown>(defaultPath)).rejects.toStrictEqual(rejectedError)
  })

  it('should throw an error if the response content-type is not json', async () => {
    const contentTypeError: IApiServiceError = {
      code: -1, error: 'SyntaxError', message: 'Unexpected end of JSON input'
    }
    const apiService = new ApiService(defaultHost)
    nock(defaultHost).get(defaultPath).reply(200, '')

    await expect(apiService.get<unknown>(defaultPath)).rejects.toStrictEqual(contentTypeError)
  })

  it('should return true if a number is between two values (inclusive)', () => {
    const apiService = new ApiService(defaultHost)

    expect(apiService['_isNumberBetween'](200, 200, 300)).toBeTruthy()
    expect(apiService['_isNumberBetween'](300, 200, 300)).toBeTruthy()
    expect(apiService['_isNumberBetween'](-100, 200, 300)).toBeFalsy()
    expect(apiService['_isNumberBetween'](400, 200, 300)).toBeFalsy()
  })
})
