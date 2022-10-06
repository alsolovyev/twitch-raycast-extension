import { IApiServiceError } from '../services/api.service'
import { useEffect, useState } from 'react'
import twitchService from '../services/twitch.service'
import type { ITwitchError, ITwitchLiveStream, ITwitchUser } from '../services/twitch.service'


/**
 * A React hook to get information about active streams belonging to channels that the authenticated user follows.
 *
 * @returns an array of three elements: error, isLoading and an array of live stream.
 */
 export default (): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchLiveStream>] => {
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