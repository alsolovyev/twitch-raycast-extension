import { renderHook } from '@testing-library/react-hooks'
import {
  fakeTwitchError,
  fakeTwitchOfflineSearchedChannel,
  fakeTwitchLiveSearchedChannel,
  fakeTwitchUser
} from '../constants/fake.constants'
import twitchService from '../services/twitch.service'
import useSearchChannels from './useSearchChannels'


jest.mock('../services/twitch.service', () => ({
  searchChannels: jest.fn().mockResolvedValue([fakeTwitchOfflineSearchedChannel, fakeTwitchLiveSearchedChannel])
}))

describe('Hook: useSearchChannels', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of live and offline channels', async () => {
    const searchChannelsSpy: jest.SpyInstance = jest.spyOn(twitchService, 'searchChannels')
    const { result, waitForNextUpdate } = renderHook(() => useSearchChannels(fakeTwitchUser.login))

    expect(result.current).toStrictEqual([undefined, true, [], []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([
      undefined,
      false,
      [fakeTwitchLiveSearchedChannel],
      [fakeTwitchOfflineSearchedChannel]
    ])
    expect(searchChannelsSpy).toBeCalledTimes(1)
    expect(searchChannelsSpy).toBeCalledWith(fakeTwitchUser.login)
  })

  it('should return an error', async () => {
    const searchChannelsSpy: jest.SpyInstance = jest
      .spyOn(twitchService, 'searchChannels')
      .mockRejectedValue(fakeTwitchError)
    const { result, waitForNextUpdate } = renderHook(() => useSearchChannels('asd'))

    expect(result.current).toStrictEqual([undefined, true, [], []])

    await waitForNextUpdate()

    expect(result.current).toStrictEqual([fakeTwitchError, false, [], []])
    expect(searchChannelsSpy).toBeCalledTimes(1)
  })
})
