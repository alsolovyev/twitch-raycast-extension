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

export interface ITwitchUserFollowsFromTo {
  from_id: string
  from_login: string
  from_name: string
  to_id: string
  to_name: string
  followed_at: string
}

export const enum TwitchResources {
  users = '/helix/users',
  followed = '/helix/streams/followed',
  follows = '/helix/users/follows'
}

/**
 * Service for working with Twitch.tv API
 *
 * @remarks
 * Twitch API Docs- {@link https://dev.twitch.tv/docs}
 */
export default class TwitchService extends ApiService {
  constructor(host: string, headers: OutgoingHttpHeaders) {
    super(host, headers)
  }

  /**
   * Gets information about a user authenticated with a Bearer token.
   *
   * @remarks
   * Twitch API Reference Get Users - {@link https://dev.twitch.tv/docs/api/reference#get-users}
   *
   * @returns user information.
   */
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

  /**
   * Gets information about users who are being followed by a user.
   *
   * @remarks
   * Twitch API Reference Get Users Follows - {@link https://dev.twitch.tv/docs/api/reference#get-users-follows}
   *
   * @param userId - the user ID.
   * @returns information about users who are being followed by the from_id user.
   */
  public async getUserFollows(userId: string | number): Promise<Array<ITwitchUserFollowsFromTo>> {
    const { data } = await this.get<ITwitchResponse<ITwitchUserFollowsFromTo>, ITwitchError>(
      `${TwitchResources.follows}?from_id=${userId}`
    )
    return data
  }
}
