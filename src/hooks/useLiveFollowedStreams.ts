import { IApiServiceError } from '../services/api.service'
import { useEffect, useState } from 'react'
import type { ITwitchError, ITwitchLiveStream, ITwitchService, ITwitchUser } from '../services/twitch.service'


/**
 * A React hook to get information about active streams belonging to channels that the authenticated user follows.
 *
 * @param twitchService - an instance of twitch service.
 * @returns an array of three elements: error, isLoading and an array of live stream.
 */
const useLiveFollowedStreams = (
  twitchService: ITwitchService
): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchLiveStream>] => {
  const [error, setError] = useState<ITwitchError | IApiServiceError>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [liveFollowedStreams, setLiveFollowedStreams] = useState<Array<ITwitchLiveStream>>([])

  useEffect(() => {
    setIsLoading(true)

    const getLiveStreams = async () => {
      const authUser: ITwitchUser = await twitchService.getAuthUser()
      const liveFollowedStreams: Array<ITwitchLiveStream> = await twitchService.getLiveFollowedStreams(authUser.id)

      setLiveFollowedStreams(liveFollowedStreams)
    }

    getLiveStreams().catch(setError).finally(() => setIsLoading(false))
  }, [])

  return [error, isLoading, liveFollowedStreams]
}

export default useLiveFollowedStreams
