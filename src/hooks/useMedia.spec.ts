import { renderHook } from '@testing-library/react-hooks'
import { fakeTwitchClip, fakeTwitchError, fakeTwitchVideo } from '../constants/fake.constants'
import twitchService, { TwitchMediaType, TwitchVideoType } from '../services/twitch.service'
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
    const hookOptions = { mediaType: TwitchMediaType.video }
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, hookOptions))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(getUserVideosSpy).toBeCalledTimes(1)
    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchVideo, fakeTwitchVideo]])
  })

  it('should return a list of clips', async () => {
    const hookOptions = { mediaType: TwitchMediaType.clip }
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchClip.broadcaster_id, hookOptions))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(getClipsSpy).toBeCalledTimes(1)
    expect(result.current).toStrictEqual([undefined, false, [fakeTwitchClip, fakeTwitchClip]])
  })

  it('should accept optional query parameters', async () => {
    const hookOptions = { mediaType: TwitchMediaType.video, queryParams: { type: TwitchVideoType.all } }
    const { waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, hookOptions))

    await waitForNextUpdate()

    expect(getUserVideosSpy).toBeCalledWith(fakeTwitchVideo.user_id, hookOptions.queryParams)
  })

  it('should return an error', async () => {
    getUserVideosSpy.mockRejectedValue(fakeTwitchError)

    const hookOptions = { mediaType: TwitchMediaType.video }
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, hookOptions))

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
    const hookOptions = { mediaType: 'photo' as TwitchMediaType }
    const { result, waitForNextUpdate } = renderHook(() => useMedia(fakeTwitchVideo.user_id, hookOptions))

    expect(result.current).toStrictEqual([undefined, true, []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([unkownMediaTypeError, false, []])
  })
})
