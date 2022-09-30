import ApiService from './api.service'
import https from 'node:https'
import nock from 'nock'
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
    expect(apiService['_options'].headers!['Content-Type']).toBe(newHeaders['Content-Type'])
  })

  it('should send a GET request successfully', async () => {
    const data: { [key: string]: any } = { key: 'value' }

    nock(defaultHost).get(defaultPath).reply(200, data)

    const spyHTTPRequest = jest.spyOn(https, 'request')
    const apiService = new ApiService(defaultHost)
    const response = await apiService.get<typeof data>(defaultPath)

    expect(spyHTTPRequest).toHaveBeenCalled()
    expect(response).toStrictEqual(data)
  })

  it('should catch system errors', async () => {
    const apiService = new ApiService(defaultHost)
    const notFoundError: { [key: string]: any } = {
      message: 'getaddrinfo ENOTFOUND https://example.com',
      name: 'ENOTFOUND'
    }

    nock(defaultHost).get(defaultPath).replyWithError(notFoundError)

    try {
      await apiService.get<unknown>(defaultPath)
    } catch({error, message}) {
      expect(error).toBe(notFoundError.name)
      expect(message).toBe(notFoundError.message)
    }
  })
})
