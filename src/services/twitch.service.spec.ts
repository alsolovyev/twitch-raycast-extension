import nock from 'nock'
import TwitchService, { ITwitchError, ITwitchUser, TwitchResources } from './twitch.service'


const twitchApiHost: string = 'https://api.twitch.tv'
const twitchService: TwitchService = new TwitchService(twitchApiHost, {})
const twitchUser: Partial<ITwitchUser> = { id: '12345', login: 'janeRivas' }
const twitch401Error: ITwitchError = { error: 'Unauthorized', status: 401, message: 'OAuth token is missing' }

describe('Twitch Service - getAuthUser', () => {
  it('should return information about the authorized (by Bearer token) user', async () => {
    nock(twitchApiHost).get(TwitchResources.users).reply(200, { data: [twitchUser] })
    await expect(twitchService.getAuthUser()).resolves.toStrictEqual(twitchUser)
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(TwitchResources.users).reply(401, twitch401Error)
    await expect(twitchService.getAuthUser()).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(TwitchResources.users).reply(200, '')
    await expect(twitchService.getAuthUser()).rejects.toStrictEqual({ code: -1, error: 'SyntaxError', message: 'Unexpected end of JSON input' })
  })
})
