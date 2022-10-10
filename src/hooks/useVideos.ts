import { useEffect, useState } from 'react'
import { IApiServiceError } from '../services/api.service'
import twitchService, { ITwitchError, ITwitchVideo, ITwtichVideoQueryParams } from '../services/twitch.service'

/**
 * A React hook for getting videos.
 *
 * @param userId - The ID of the user whose video to get.
 * @param queryParams - Optional query parameters {@link ITwtichVideoQueryParams}.
 * @returns an array of three elements: error, isLoading and videos.
 */
export default (
  userId: string,
  queryParams?: ITwtichVideoQueryParams
): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchVideo>] => {
  const [error, setError] = useState<ITwitchError | IApiServiceError>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [videos, setVideos] = useState<Array<ITwitchVideo>>([])

  useEffect(() => {
    setIsLoading(true)

    const getUserVideos = async () => {
      const videos: Array<ITwitchVideo> = await twitchService.getUserVideos(userId, queryParams)

      setVideos(videos)
    }

    getUserVideos()
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [userId, queryParams])

  return [error, isLoading, videos]
}
