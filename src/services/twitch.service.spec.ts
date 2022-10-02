import nock from 'nock'
import { API_SERVICE_PARSE_ERROR } from './api.service'
import TwitchService, { ITwitchError, ITwitchOnlineStream, ITwitchUser, TwitchResources } from './twitch.service'


const twitchApiHost: string = 'https://api.twitch.tv'
const twitchService: TwitchService = new TwitchService(twitchApiHost, {})
const twitchUser: Partial<ITwitchUser> = { id: '12345', login: 'janeRivas' }
const twitch401Error: ITwitchError = { error: 'Unauthorized', status: 401, message: 'OAuth token is missing' }
const twitchOnlineStream: Partial<ITwitchOnlineStream> = { id: twitchUser.id, user_name: twitchUser.login }

describe('Twitch Service - getAuthUser', () => {
  it('should return information about the authorized (by Bearer token) user', async () => {
    nock(twitchApiHost).get(TwitchResources.users).reply(200, { data: [twitchUser] })
    await expect(twitchService.getAuthUser()).resolves.toStrictEqual(twitchUser)
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(TwitchResources.users).reply(401, twitch401Error)
    await expect(twitchService.getAuthUser()).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(TwitchResources.users).reply(200, '')
    await expect(twitchService.getAuthUser()).rejects.toStrictEqual(API_SERVICE_PARSE_ERROR)
  })
})

describe('Twitch Service - getOnlineFollowedStreams', () => {
  it('should return a list of online streams', async () => {
    nock(twitchApiHost)
      .get(`${TwitchResources.followed}?user_id=${twitchUser.id}`)
      .reply(200, { data: [twitchOnlineStream, twitchOnlineStream] })
    await expect(twitchService.getOnlineFollowedStreams(twitchUser.id as string)).resolves.toStrictEqual([
      twitchOnlineStream,
      twitchOnlineStream
    ])
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(`${TwitchResources.followed}?user_id=${twitchUser.id}`).reply(401, twitch401Error)
    await expect(twitchService.getOnlineFollowedStreams(twitchUser.id as string)).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(`${TwitchResources.followed}?user_id=${twitchUser.id}`).reply(200, '')
    await expect(twitchService.getOnlineFollowedStreams(twitchUser.id as string)).rejects.toStrictEqual(
      API_SERVICE_PARSE_ERROR
    )
  })
})
