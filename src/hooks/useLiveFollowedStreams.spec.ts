import { renderHook } from '@testing-library/react-hooks'
import { fakeTwitchError, fakeTwitchLiveStream, fakeTwitchUser } from '../constants/fake.constants'
import TwitchService from '../services/twitch.service'
import useLiveFollowedStreams from './useLiveFollowedStreams'


jest.mock('../services/twitch.service')

describe('Hook: useLiveFollowedStreams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of live streams', async () => {
    const getAuthUserMock: jest.SpyInstance = jest
      .spyOn(TwitchService.prototype, 'getAuthUser')
      .mockImplementationOnce(() => Promise.resolve(fakeTwitchUser))

    const getLiveFollowedStreamsMock: jest.SpyInstance = jest
      .spyOn(TwitchService.prototype, 'getLiveFollowedStreams')
      .mockImplementationOnce(() => Promise.resolve([fakeTwitchLiveStream]))

    const { result, waitForNextUpdate } = renderHook(() =>
      useLiveFollowedStreams(new TwitchService('https://api.fake.tv', {}))
    )

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchLiveStream]])
    expect(getAuthUserMock).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsMock).toBeCalledTimes(1)
  })

  it('should return an error', async () => {
    const getAuthUserMock: jest.SpyInstance = jest
      .spyOn(TwitchService.prototype, 'getAuthUser')
      .mockImplementationOnce(() => Promise.resolve(fakeTwitchUser))

    const getLiveFollowedStreamsMock: jest.SpyInstance = jest
      .spyOn(TwitchService.prototype, 'getLiveFollowedStreams')
      .mockImplementationOnce(() => Promise.reject(fakeTwitchError))

    const { result, waitForNextUpdate } = renderHook(() =>
      useLiveFollowedStreams(new TwitchService('https://api.fake.tv', {}))
    )

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([fakeTwitchError, false, []])
    expect(getAuthUserMock).toBeCalledTimes(1)
    expect(getLiveFollowedStreamsMock).toBeCalledTimes(1)
  })
})
