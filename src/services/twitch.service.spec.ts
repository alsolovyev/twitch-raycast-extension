/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nock from 'nock'
import { API_SERVICE_PARSE_ERROR } from './api.service'
import TwitchService, {
  ITwitchError,
  ITwitchUserFollowsFromTo,
  ITwitchLiveStream,
  ITwitchUser,
  TwitchResources
} from './twitch.service'


const twitchApiHost: string = 'https://api.twitch.tv'
const twitchService: TwitchService = new TwitchService(twitchApiHost, {})
const twitchUser: Partial<ITwitchUser> = { id: '12345', login: 'janeRivas' }
const twitch401Error: ITwitchError = { error: 'Unauthorized', status: 401, message: 'OAuth token is missing' }
const twitchLiveStream: Partial<ITwitchLiveStream> = { id: twitchUser.id, user_name: twitchUser.login }
const twitchUserFollowFromTo: Partial<ITwitchUserFollowsFromTo> = { from_id: twitchUser.id, to_id: twitchUser.id }

describe('Twitch Service - singleton', () => {
  it('should only create one instance of the service', () => {
    const newTwitchService: TwitchService = new TwitchService('https://twitch.tv', {})

    expect(newTwitchService).toMatchObject(twitchService)
  })
})

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

describe('Twitch Service - getLiveFollowedStreams', () => {
  it('should return a list of online streams', async () => {
    nock(twitchApiHost)
      .get(`${TwitchResources.followed}?user_id=${twitchUser.id}`)
      .reply(200, { data: [twitchLiveStream, twitchLiveStream] })
    await expect(twitchService.getLiveFollowedStreams(twitchUser.id as string)).resolves.toStrictEqual([
      twitchLiveStream,
      twitchLiveStream
    ])
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(`${TwitchResources.followed}?user_id=${twitchUser.id}`).reply(401, twitch401Error)
    await expect(twitchService.getLiveFollowedStreams(twitchUser.id as string)).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(`${TwitchResources.followed}?user_id=${twitchUser.id}`).reply(200, '')
    await expect(twitchService.getLiveFollowedStreams(twitchUser.id as string)).rejects.toStrictEqual(
      API_SERVICE_PARSE_ERROR
    )
  })
})

describe('Twitch Service - getUserFollows', () => {
  it('should return a list of users', async () => {
    nock(twitchApiHost)
      .get(`${TwitchResources.follows}?from_id=${twitchUser.id}`)
      .reply(200, { data: [twitchUserFollowFromTo, twitchUserFollowFromTo] })
    await expect(twitchService.getUserFollows(twitchUser.id as string)).resolves.toStrictEqual([
      twitchUserFollowFromTo,
      twitchUserFollowFromTo
    ])
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(`${TwitchResources.follows}?from_id=${twitchUser.id}`).reply(401, twitch401Error)
    await expect(twitchService.getUserFollows(twitchUser.id as string)).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(`${TwitchResources.follows}?from_id=${twitchUser.id}`).reply(200, '')
    await expect(twitchService.getUserFollows(twitchUser.id as string)).rejects.toStrictEqual(API_SERVICE_PARSE_ERROR)
  })
})

describe('Twitch Service - getUsers', () => {
  it('should return a list of users', async () => {
    nock(twitchApiHost)
      .get(`${TwitchResources.users}?id=${twitchUser.id}&login=${twitchUser.login}`)
      .reply(200, { data: [twitchUserFollowFromTo, twitchUserFollowFromTo] })
    await expect(twitchService.getUsers([twitchUser.id!, twitchUser.login!])).resolves.toStrictEqual([
      twitchUserFollowFromTo,
      twitchUserFollowFromTo
    ])
  })

  it('should return an empty list if an empty array is passed', async () => {
    await expect(twitchService.getUsers([])).resolves.toStrictEqual([])
  })

  it('should return an error if the request fails', async () => {
    nock(twitchApiHost).get(`${TwitchResources.users}?id=${twitchUser.id}&login=${twitchUser.login}`).reply(401, twitch401Error)
    await expect(twitchService.getUsers([twitchUser.id!, twitchUser.login!])).rejects.toStrictEqual(twitch401Error)

    nock(twitchApiHost).get(`${TwitchResources.users}?id=${twitchUser.id}&login=${twitchUser.login}`).reply(200, '')
    await expect(twitchService.getUsers([twitchUser.id!, twitchUser.login!])).rejects.toStrictEqual(
      API_SERVICE_PARSE_ERROR
    )
  })
})
