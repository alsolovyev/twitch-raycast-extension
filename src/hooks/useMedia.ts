import { useEffect, useState } from 'react'
import { IApiServiceError } from '../services/api.service'
import twitchService, {
  ITwitchClip,
  ITwitchError,
  ITwitchVideo,
  ITwitchGetUserVideosQueryParams,
  TwitchMediaType,
  ITwitchGetClipsQueryParams
} from '../services/twitch.service'

export interface IUseMediaVideosParams {
  mediaType: TwitchMediaType.video
  queryParams?: ITwitchGetUserVideosQueryParams
}

export interface IUseMediaClipsParams {
  mediaType: TwitchMediaType.clip
  queryParams?: ITwitchGetClipsQueryParams
}


/**
 * A React hook for getting users media files (videos, clips)
 *
 * @param userId - The ID of the user whose video to get.
 * @param params.mediaType - The media type {@link TwitchMediaType} to be recieved.
 * @param params.queryParams - Optional query parameters.
 * @returns an array of three elements: error, isLoading and media.
 */
export default (
  userId: string,
  params: IUseMediaClipsParams | IUseMediaVideosParams
): [IApiServiceError | ITwitchError | undefined, boolean, Array<ITwitchClip> | Array<ITwitchVideo>] => {
  const [error, setError] = useState<IApiServiceError | ITwitchError>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [media, setMedia] = useState<Array<ITwitchClip> | Array<ITwitchVideo>>([])

  useEffect(() => {
    isLoading || setIsLoading(true)

    const getMedia = async () => {
      if (params.mediaType === TwitchMediaType.clip) {
        const _media = await twitchService.getClips(userId, params.queryParams)
        return setMedia(_media)
      }

      if (params.mediaType === TwitchMediaType.video) {
        const _media = await twitchService.getUserVideos(userId, params.queryParams)
        return setMedia(_media)
      }

      throw {
        status: 400,
        error: 'Unknown media type',
        message: `${params['mediaType']} media type is not yet supported`
      }
    }

    getMedia().catch(setError).finally(() => setIsLoading(false))
  }, [params])

  return [error, isLoading, media]
}
