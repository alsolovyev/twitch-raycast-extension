/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nock from 'nock'
import {
  fakeTwitchAuthToken,
  fakeTwitchClientId,
  fakeTwitchError,
  fakeTwitchLiveStream,
  fakeTwitchLiveSearchedChannel,
  fakeTwitchUser,
  fakeTwitchUserFollowsFromTo,
  fakeTwitchVideo
} from '../constants/fake.constants'
import { API_SERVICE_PARSE_ERROR } from './api.service'
import twitchService, { TwitchResources, TwitchVideoType } from './twitch.service'


jest.mock('../core/preferences', () => ({
  authToken: fakeTwitchAuthToken,
  clientId: fakeTwitchClientId
}))

describe('Twitch Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAuthUser', () => {
    beforeEach(() => {
      twitchService['_authUser'] = undefined
    })

    it('should return information about the authorized (by Bearer token) user', async () => {
      nock(TwitchResources.host).get(TwitchResources.users).reply(200, { data: [fakeTwitchUser] })
      await expect(twitchService.getAuthUser()).resolves.toStrictEqual(fakeTwitchUser)
    })

    it('should return information about the authorized user from the cache', async () => {
      const getSpy: jest.SpyInstance = jest.spyOn(twitchService, 'get')
      nock(TwitchResources.host).get(TwitchResources.users).reply(200, { data: [fakeTwitchUser] })

      await twitchService.getAuthUser()
      expect(twitchService['_authUser']).toStrictEqual(fakeTwitchUser)

      await twitchService.getAuthUser()
      expect(getSpy).toBeCalledTimes(1)
    })

    it('should return an error if the request fails', async () => {
      nock(TwitchResources.host).get(TwitchResources.users).reply(401, fakeTwitchError)
      await expect(twitchService.getAuthUser()).rejects.toStrictEqual(fakeTwitchError)

      nock(TwitchResources.host).get(TwitchResources.users).reply(200, '')
      await expect(twitchService.getAuthUser()).rejects.toStrictEqual(API_SERVICE_PARSE_ERROR)
    })
  })

  describe('getLiveFollowedStreams', () => {
    it('should return a list of online streams', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.followed}?user_id=${fakeTwitchUser.id}`)
        .reply(200, { data: [fakeTwitchLiveStream, fakeTwitchLiveStream] })
      await expect(twitchService.getLiveFollowedStreams(fakeTwitchUser.id as string)).resolves.toStrictEqual([
        fakeTwitchLiveStream,
        fakeTwitchLiveStream
      ])
    })

    it('should return an error if the request fails', async () => {
      nock(TwitchResources.host).get(`${TwitchResources.followed}?user_id=${fakeTwitchUser.id}`).reply(401, fakeTwitchError)
      await expect(twitchService.getLiveFollowedStreams(fakeTwitchUser.id as string)).rejects.toStrictEqual(
        fakeTwitchError
      )

      nock(TwitchResources.host).get(`${TwitchResources.followed}?user_id=${fakeTwitchUser.id}`).reply(200, '')
      await expect(twitchService.getLiveFollowedStreams(fakeTwitchUser.id as string)).rejects.toStrictEqual(
        API_SERVICE_PARSE_ERROR
      )
    })
  })

  describe('getUserFollows', () => {
    it('should return a list of users', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.follows}?from_id=${fakeTwitchUser.id}`)
        .reply(200, { data: [fakeTwitchUserFollowsFromTo, fakeTwitchUserFollowsFromTo] })
      await expect(twitchService.getUserFollows(fakeTwitchUser.id as string)).resolves.toStrictEqual([
        fakeTwitchUserFollowsFromTo,
        fakeTwitchUserFollowsFromTo
      ])
    })

    it('should return an error if the request fails', async () => {
      nock(TwitchResources.host).get(`${TwitchResources.follows}?from_id=${fakeTwitchUser.id}`).reply(401, fakeTwitchError)
      await expect(twitchService.getUserFollows(fakeTwitchUser.id as string)).rejects.toStrictEqual(fakeTwitchError)

      nock(TwitchResources.host).get(`${TwitchResources.follows}?from_id=${fakeTwitchUser.id}`).reply(200, '')
      await expect(twitchService.getUserFollows(fakeTwitchUser.id as string)).rejects.toStrictEqual(
        API_SERVICE_PARSE_ERROR
      )
    })
  })

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.users}?id=${fakeTwitchUser.id}&login=${fakeTwitchUser.login}`)
        .reply(200, { data: [fakeTwitchUserFollowsFromTo, fakeTwitchUserFollowsFromTo] })
      await expect(twitchService.getUsers([fakeTwitchUser.id!, fakeTwitchUser.login!])).resolves.toStrictEqual([
        fakeTwitchUserFollowsFromTo,
        fakeTwitchUserFollowsFromTo
      ])
    })

    it('should return an empty list if an empty array is passed', async () => {
      await expect(twitchService.getUsers([])).resolves.toStrictEqual([])
    })

    it('should return an error if the request fails', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.users}?id=${fakeTwitchUser.id}&login=${fakeTwitchUser.login}`)
        .reply(401, fakeTwitchError)
      await expect(twitchService.getUsers([fakeTwitchUser.id!, fakeTwitchUser.login!])).rejects.toStrictEqual(
        fakeTwitchError
      )

      nock(TwitchResources.host)
        .get(`${TwitchResources.users}?id=${fakeTwitchUser.id}&login=${fakeTwitchUser.login}`)
        .reply(200, '')
      await expect(twitchService.getUsers([fakeTwitchUser.id!, fakeTwitchUser.login!])).rejects.toStrictEqual(
        API_SERVICE_PARSE_ERROR
      )
    })
  })

  describe('getUserVideos', () => {
    it('should return a list of videos', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.videos}?user_id=${fakeTwitchVideo.user_id}`)
        .reply(200, { data: [fakeTwitchVideo, fakeTwitchVideo] })

      await expect(twitchService.getUserVideos(fakeTwitchVideo.user_id)).resolves.toStrictEqual([fakeTwitchVideo, fakeTwitchVideo])
    })

    it('should return an empty list if an empty user id is passed', async () => {
      const getSpy: jest.SpyInstance = jest.spyOn(twitchService, 'get')

      await expect(twitchService.getUserVideos('')).resolves.toStrictEqual([])

      expect(getSpy).not.toBeCalled()
    })

    it('should correctly throw an error', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.videos}?user_id=${fakeTwitchVideo.user_id}`)
        .reply(401, fakeTwitchError)

      await expect(twitchService.getUserVideos(fakeTwitchVideo.user_id)).rejects.toStrictEqual(fakeTwitchError)
    })

    it('should currectlu parse qyery params', async () => {
      const getSpy: jest.SpyInstance = jest.spyOn(twitchService, 'get')

      nock(TwitchResources.host)
        .get(`${TwitchResources.videos}?user_id=${fakeTwitchVideo.user_id}&type=${TwitchVideoType.all}`)
        .reply(200, { data: [fakeTwitchVideo, fakeTwitchVideo] })

      await twitchService.getUserVideos(fakeTwitchVideo.user_id, { type: TwitchVideoType.all })

      expect(getSpy).toBeCalledWith(
        `${TwitchResources.videos}?user_id=${fakeTwitchVideo.user_id}&type=${TwitchVideoType.all}`
      )
    })
  })

  describe('searchChannels', () => {
    it('should return a list of channels', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.searchChannels}?query=${fakeTwitchLiveSearchedChannel.broadcaster_login}`)
        .reply(200, { data: [fakeTwitchLiveSearchedChannel] })

      await expect(twitchService.searchChannels(fakeTwitchLiveSearchedChannel.broadcaster_login)).resolves.toStrictEqual([
        fakeTwitchLiveSearchedChannel
      ])
    })

    it('should not send a request if an empty string is passed', async () => {
      jest.clearAllMocks()

      const getSpy: jest.SpyInstance = jest.spyOn(twitchService, 'get')

      nock(TwitchResources.host)
        .get(`${TwitchResources.searchChannels}?query=${fakeTwitchLiveSearchedChannel.broadcaster_login}`)
        .reply(200, { data: [fakeTwitchLiveSearchedChannel] })

      await twitchService.searchChannels(fakeTwitchLiveSearchedChannel.broadcaster_login)
      await twitchService.searchChannels('')

      expect(getSpy).toBeCalledTimes(1)
    })

    it('should correctly throw an error', async () => {
      nock(TwitchResources.host)
        .get(`${TwitchResources.searchChannels}?query=${fakeTwitchLiveSearchedChannel.broadcaster_login}`)
        .reply(401, fakeTwitchError)

      await expect(twitchService.searchChannels(fakeTwitchLiveSearchedChannel.broadcaster_login)).rejects.toStrictEqual(
        fakeTwitchError
      )
    })
  })
})
