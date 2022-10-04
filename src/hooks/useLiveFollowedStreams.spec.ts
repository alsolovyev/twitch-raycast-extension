import { renderHook } from '@testing-library/react-hooks'
import {
  fakeTwitchAuthToken,
  fakeTwitchClientId,
  fakeTwitchError,
  fakeTwitchLiveStream,
  fakeTwitchUser
} from '../constants/fake.constants'
import twitchService from '../services/twitch.service'
import useLiveFollowedStreams from './useLiveFollowedStreams'


jest.mock('../services/twitch.service', () => ({
  getAuthUser: jest.fn(),
  getLiveFollowedStreams: jest.fn()
}))

jest.mock('../core/preferences', () => ({
  authorization: fakeTwitchAuthToken,
  clientId: fakeTwitchClientId
}))

describe('Hook: useLiveFollowedStreams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of live streams', async () => {
    const getAuthUserMock = jest.spyOn(twitchService, 'getAuthUser').mockResolvedValueOnce(fakeTwitchUser)
    const getLiveFollowedStreamsMock = jest
      .spyOn(twitchService, 'getLiveFollowedStreams')
      .mockResolvedValue([fakeTwitchLiveStream])
    const { result, waitForNextUpdate } = renderHook(() => useLiveFollowedStreams())

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchLiveStream]])
    expect(getAuthUserMock).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsMock).toBeCalledTimes(1)
  })

  it('should return an error', async () => {
    const getAuthUserMock = jest.spyOn(twitchService, 'getAuthUser').mockResolvedValueOnce(fakeTwitchUser)
    const getLiveFollowedStreamsMock = jest
      .spyOn(twitchService, 'getLiveFollowedStreams')
      .mockRejectedValueOnce(fakeTwitchError)
    const { result, waitForNextUpdate } = renderHook(() => useLiveFollowedStreams())

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([fakeTwitchError, false, []])
    expect(getAuthUserMock).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsMock).toBeCalledTimes(1)
  })
})
