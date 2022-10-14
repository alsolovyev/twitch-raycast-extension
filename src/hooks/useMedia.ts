import { useEffect, useState } from 'react'
import { IApiServiceError } from '../services/api.service'
import twitchService, { ITwitchClip, ITwitchError, ITwitchVideo, ITwitchGetUserVideosQueryParams, TwitchMediaType } from '../services/twitch.service'


/**
 * A React hook for getting users media files (videos, clips)
 *
 * @param userId - The ID of the user whose video to get.
 * @param mediaType - The media type {@link TwitchMediaType} to be recieved.
 * @param queryParams - Optional query parameters.
 * @returns an array of three elements: error, isLoading and media.
 */
export default (
  userId: string,
  mediaType: TwitchMediaType,
  queryParams?: ITwitchGetUserVideosQueryParams
): [IApiServiceError | ITwitchError | undefined, boolean, Array<ITwitchClip> | Array<ITwitchVideo>] => {
  const [error, setError] = useState<IApiServiceError | ITwitchError>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [media, setMedia] = useState<Array<ITwitchClip> | Array<ITwitchVideo>>([])

  useEffect(() => {
    isLoading || setIsLoading(true)

    const getMedia = async () => {
      if (mediaType === TwitchMediaType.clip) {
        const _media = await twitchService.getClips(userId)
        return setMedia(_media)
      }

      if (mediaType === TwitchMediaType.video) {
        const _media = await twitchService.getUserVideos(userId, queryParams)
        return setMedia(_media)
      }

      throw {
        status: 400,
        error: 'Unknown media type',
        message: `${mediaType} media type is not yet supported`
      }
    }

    getMedia().catch(setError).finally(() => setIsLoading(false))
  }, [userId, mediaType, queryParams])

 return [error, isLoading, media]
}
