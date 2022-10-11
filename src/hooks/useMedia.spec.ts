import { renderHook } from '@testing-library/react-hooks'
import { fakeTwitchClip, fakeTwitchError, fakeTwitchVideo } from '../constants/fake.constants'
import twitchService, { ITwitchGetUserVideosQueryParams, TwitchMediaType, TwitchVideoType } from '../services/twitch.service'
import useMedia from './useMedia'


jest.mock('../services/twitch.service', () => ({
  getUserVideos: jest.fn().mockReturnValue([fakeTwitchVideo, fakeTwitchVideo]),
  getClips: jest.fn().mockReturnValue([fakeTwitchClip, fakeTwitchClip]),
  TwitchMediaType: {
    video: 'video',
    clip: 'clip',
    photo: 'photo'
  },
  TwitchVideoType: {
    all: 'all'
  }
}))

describe('Hook: useMedia', () => {
   beforeEach(() => {
    jest.clearAllMocks()
  })

  const getUserVideosSpy: jest.SpyInstance = jest.spyOn(twitchService, 'getUserVideos')
  const getClipsSpy: jest.SpyInstance = jest.spyOn(twitchService, 'getClips')

  it('should return a list of videos', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, TwitchMediaType.video))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(getUserVideosSpy).toBeCalledTimes(1)
    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchVideo, fakeTwitchVideo]])
  })

  it('should return a list of clips', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchClip.broadcaster_id, TwitchMediaType.clip))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(getClipsSpy).toBeCalledTimes(1)
    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchClip, fakeTwitchClip]])
  })

  it('should accept optional query parameters', async () => {
    const queryParams: ITwitchGetUserVideosQueryParams = { type: TwitchVideoType.all }
    const { waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, TwitchMediaType.video, queryParams))

    await waitForNextUpdate()

    expect(getUserVideosSpy).toBeCalledWith(fakeTwitchVideo.user_id, queryParams)
  })

  it('should return an error', async () => {
    getUserVideosSpy.mockRejectedValue(fakeTwitchError)

    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, TwitchMediaType.video))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(getUserVideosSpy).toBeCalledTimes(1)
    expect(result.current).toStrictEqual([fakeTwitchError, false, []])
  })

  it('should throw an error if an unknown media type is passed', async () => {
    const unkownMediaTypeError = {
      status: 400,
      error: 'Unknown media type',
      message: 'photo media type is not yet supported'
    }
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, 'photo' as TwitchMediaType))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([unkownMediaTypeError, false, []])
  })
})
