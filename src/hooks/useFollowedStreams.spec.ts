import { renderHook } from '@testing-library/react-hooks'
import {
  fakeTwitchError,
  fakeTwitchLiveStream,
  fakeTwitchUser,
  fakeTwitchUserFollowsFromTo
} from '../constants/fake.constants'
import twitchService from '../services/twitch.service'
import useLiveFollowedStreams from './useFollowedStreams'

jest.mock('../services/twitch.service', () => ({
  getAuthUser: jest.fn().mockResolvedValue(fakeTwitchUser),
  getLiveFollowedStreams: jest.fn().mockResolvedValue([fakeTwitchLiveStream]),
  getUserFollows: jest.fn().mockResolvedValue([fakeTwitchUserFollowsFromTo]),
  getUsers: jest.fn().mockResolvedValue([fakeTwitchUser])
}))

describe('Hook: useLiveFollowedStreams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of live and offline streams', async () => {
    const getAuthUser = jest.spyOn(twitchService, 'getAuthUser')
    const getLiveFollowedStreamsSpy = jest.spyOn(twitchService, 'getLiveFollowedStreams')
    const getUserFollowsSpy = jest.spyOn(twitchService, 'getUserFollows')
    const getUsersSpy = jest.spyOn(twitchService, 'getUsers')
    const { result, waitForNextUpdate } = renderHook(() => useLiveFollowedStreams())

    expect(result.current).toStrictEqual([undefined, true, [], []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchLiveStream], [fakeTwitchUser]])
    expect(getAuthUser).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsSpy).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsSpy).toBeCalledWith(fakeTwitchUser.id)
    expect(getUserFollowsSpy).toBeCalledTimes(1)
    expect(getUserFollowsSpy).toBeCalledWith(fakeTwitchUser.id)
    expect(getUsersSpy).toBeCalledTimes(1)
    expect(getUsersSpy).toBeCalledWith([fakeTwitchUserFollowsFromTo.to_id])
  })

  it('should return an error', async () => {
    const getAuthUser = jest.spyOn(twitchService, 'getAuthUser')
    const getLiveFollowedStreamsSpy = jest.spyOn(twitchService, 'getLiveFollowedStreams')
    const getUserFollowsSpy = jest.spyOn(twitchService, 'getUserFollows').mockRejectedValue(fakeTwitchError)
    const getUsersSpy = jest.spyOn(twitchService, 'getUsers')
    const { result, waitForNextUpdate } = renderHook(() => useLiveFollowedStreams())

    expect(result.current).toStrictEqual([undefined, true, [], []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([fakeTwitchError, false, [fakeTwitchLiveStream], []])
    expect(getAuthUser).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsSpy).toBeCalledTimes(1)
    expect(getUserFollowsSpy).toBeCalledTimes(1)
    expect(getUsersSpy).toBeCalledTimes(0)
  })
})
