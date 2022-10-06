import { IApiServiceError } from '../services/api.service'
import { useEffect, useState } from 'react'
import twitchService, { ITwitchUserFollowsFromTo } from '../services/twitch.service'
import type { ITwitchError, ITwitchLiveStream, ITwitchUser } from '../services/twitch.service'


/**
 * A React hook to get information about streams belonging to channels that the authenticated user follows.
 *
 * @param minViewCount - The minimum number of views to display a channel.
 * @returns an array of three elements: error, isLoading and an array of live stream.
 */
export default (
  minViewCount: number = 1e4
): [ITwitchError | IApiServiceError | undefined, boolean, Array<ITwitchLiveStream>, Array<ITwitchUser>] => {
  const [error, setError] = useState<ITwitchError | IApiServiceError>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [liveStreams, setLiveStreams] = useState<Array<ITwitchLiveStream>>([])
  const [offlineStreams, setOfflineStreams] = useState<Array<ITwitchUser>>([])

  useEffect(() => {
    setIsLoading(true)

    const getStreams = async () => {
      const authUser: ITwitchUser = await twitchService.getAuthUser()
      const liveStreams: Array<ITwitchLiveStream> = await twitchService.getLiveFollowedStreams(authUser.id)

      setLiveStreams(liveStreams)

      const followedUsers: Array<ITwitchUserFollowsFromTo> = await twitchService.getUserFollows(authUser.id)
      const offlineFollowedUsers: Array<ITwitchUserFollowsFromTo> = followedUsers.filter(
        ({ to_id }) => !liveStreams.some(({ user_id }) => user_id === to_id)
      )
      const offlineStreams: Array<ITwitchUser> = await twitchService.getUsers(
        offlineFollowedUsers.map(({ to_id }) => to_id)
      )
      const filteredOfflineStreams: Array<ITwitchUser> = offlineStreams.filter(
        ({ view_count }) => Number(view_count) > minViewCount
      )

      setOfflineStreams(filteredOfflineStreams)
    }

    getStreams().catch(setError).finally(() => setIsLoading(false))
  }, [])

  return [error, isLoading, liveStreams, offlineStreams]
}
