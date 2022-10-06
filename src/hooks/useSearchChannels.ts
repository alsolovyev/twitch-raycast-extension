import { useEffect, useState } from 'react'
import { IApiServiceError } from '../services/api.service'
import twitchService, { ITwitchError, ITwitchSearchedChannel } from '../services/twitch.service'


/**
 * A React hook for searching Twitch channels.
 *
 * @param query - The search query.
 * @returns an array of four elements: error, isLoading, onlineChannels and offlineChannels.
 */
export default (
  query: string
): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchSearchedChannel>, Array<ITwitchSearchedChannel>] => {
  const [error, setError] = useState<ITwitchError | IApiServiceError>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [onlineChannels, setOnlineChannels] = useState<Array<ITwitchSearchedChannel>>([])
  const [offlineChannels, setOffllineChannels] = useState<Array<ITwitchSearchedChannel>>([])

  useEffect(() => {
    setIsLoading(true)

    const searchChannels = async () => {
      const channels: Array<ITwitchSearchedChannel> = await twitchService.searchChannels(query)

      const _onlineChannels: Array<ITwitchSearchedChannel> = []
      const _offlineChannels: Array<ITwitchSearchedChannel> = []

      channels.forEach(channel => (channel.is_live ? _onlineChannels : _offlineChannels).push(channel))

      setOnlineChannels(_onlineChannels)
      setOffllineChannels(_offlineChannels)
    }

    searchChannels().catch(setError).finally(() => setIsLoading(false))
  }, [query])

  return [error, isLoading, onlineChannels, offlineChannels]
}
