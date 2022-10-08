import { renderHook } from '@testing-library/react-hooks'
import { fakeTwitchAuthToken, fakeTwitchClientId, fakeTwitchError, fakeTwitchVideo } from '../constants/fake.constants'
import twitchService from '../services/twitch.service'
import useUserVideos from './useVideos'

jest.mock('../core/preferences', () => ({
  authToken: fakeTwitchAuthToken,
  clientId: fakeTwitchClientId
}))

jest.mock('../services/twitch.service', () => ({
  getUserVideos: jest.fn().mockReturnValue([fakeTwitchVideo, fakeTwitchVideo]),
  TwitchVideoType: {
    all: ''
  }
}))

describe('Hook: useVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of user videos', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserVideos(fakeTwitchVideo.user_id))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchVideo, fakeTwitchVideo]])
  })

  it('should return an error', async () => {
    const getUserVideosSpy: jest.SpyInstance = jest
      .spyOn(twitchService, 'getUserVideos')
      .mockRejectedValue(fakeTwitchError)
    const { result, waitForNextUpdate } = renderHook(() => useUserVideos(fakeTwitchVideo.user_id))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([fakeTwitchError, false, []])
    expect(getUserVideosSpy).toBeCalledTimes(1)
  })
})
