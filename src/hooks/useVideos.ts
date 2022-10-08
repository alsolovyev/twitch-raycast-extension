import { useEffect, useState } from 'react'
import { IApiServiceError } from '../services/api.service'
import twitchService, { ITwitchError, ITwitchVideo, TwitchVideoType } from '../services/twitch.service'

/**
 * A React hook for getting videos.
 *
 * @param userId - The ID of the user whose video to get.
 * @param type - The type of videos {@link TwitchVideoType}.
 * @returns an array of three elements: error, isLoading and videos.
 */
export default (
  userId: string,
  type: TwitchVideoType = TwitchVideoType.all
): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchVideo>] => {
  const [error, setError] = useState<ITwitchError | IApiServiceError>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [videos, setVideos] = useState<Array<ITwitchVideo>>([])

  useEffect(() => {
    setIsLoading(true)

    const getUserVideos = async () => {
      const videos: Array<ITwitchVideo> = await twitchService.getUserVideos(userId, type)

      setVideos(videos)
    }

    getUserVideos()
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [userId, type])

  return [error, isLoading, videos]
}
