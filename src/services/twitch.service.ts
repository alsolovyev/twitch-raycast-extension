import ApiService from './api.service'
import type { OutgoingHttpHeaders } from 'node:http'


export interface ITwitchResponse<T> {
  data: Array<T>
}

export interface ITwitchError {
  error: string
  status: number
  message: string
}

export interface ITwitchUser {
  id: string
  login: string
  display_name: string
  type: 'partner' | 'affiliate' | ''
  broadcaster_type: 'staff' | 'admin' | 'global_mod' | ''
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
}

export interface ITwitchOnlineStream {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: 'live' | ''
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tag_ids: Array<string>
}

export const enum TwitchResources {
  users = '/helix/users',
  followed = '/helix/streams/followed'
}

export default class TwitchService extends ApiService {
  constructor(host: string, headers: OutgoingHttpHeaders) {
    super(host, headers)
  }

  public async getAuthUser(): Promise<ITwitchUser> {
    const { data } = await this.get<ITwitchResponse<ITwitchUser>, ITwitchError>(TwitchResources.users)
    return data[0]
  }

  /**
   * Gets information about online streams belonging to channels that the authenticated user follows.
   *
   * @remarks
   * Twitch API Reference Get Followed Streams - {@link https://dev.twitch.tv/docs/api/reference#get-followed-streams}
   *
   * @param userId - the User ID in the bearer token.
   * @returns information about active streams.
   */
  public async getOnlineFollowedStreams(userId: string | number): Promise<Array<ITwitchOnlineStream>> {
    const { data } = await this.get<ITwitchResponse<ITwitchOnlineStream>, ITwitchError>(
      `${TwitchResources.followed}?user_id=${userId}`
    )
    return data
  }
}