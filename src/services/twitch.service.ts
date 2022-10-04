import ApiService from './api.service'
import type { OutgoingHttpHeaders } from 'node:http'
import { Singleton } from '../decorators/singleton.decorator'


export interface ITwitchService {
  getAuthUser(): Promise<ITwitchUser>
  getLiveFollowedStreams(userId: string | number): Promise<Array<ITwitchLiveStream>>
  getUserFollows(userId: string | number): Promise<Array<ITwitchUserFollowsFromTo>>
  getUsers(userIDsOrLogins: Array<string>): Promise<Array<ITwitchUserInfo>>
}

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

export interface ITwitchUserInfo {
  id: string
  login: string
  display_name: string
  type: 'staff' | 'admin' | 'global_mod' | ''
  broadcaster_type: 'partner' | 'affiliate' | ''
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: string
  email: string
  created_at: string
}

export interface ITwitchLiveStream {
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
@Singleton
export default class TwitchService extends ApiService implements ITwitchService {
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
   * Gets information about line streams belonging to channels that the authenticated user follows.
   *
   * @remarks
   * Twitch API Reference Get Followed Streams - {@link https://dev.twitch.tv/docs/api/reference#get-followed-streams}
   *
   * @param userId - the User ID in the bearer token.
   * @returns information about live streams.
   */
  public async getLiveFollowedStreams(userId: string | number): Promise<Array<ITwitchLiveStream>> {
    const { data } = await this.get<ITwitchResponse<ITwitchLiveStream>, ITwitchError>(
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

  /**
   * Gets information about one or more specified Twitch users.
   *
   * @remarks
   * Twitch API Reference Get Users - {@link https://dev.twitch.tv/docs/api/reference#get-users}
   *
   * @param userIDsOrLogins - the list of user IDs or logins.
   * @returns returns a list with information about Twitch users.
   */
  public async getUsers(userIDsOrLogins: Array<string>): Promise<Array<ITwitchUserInfo>> {
    if (userIDsOrLogins.length === 0) return []

    const queryParams: string = userIDsOrLogins
      .reduce((prev: string, cur: string) => `${prev}${isNaN(Number(cur)) ? 'login=' : 'id='}${cur}&`, '')
      .slice(0, -1)

    const { data } = await this.get<ITwitchResponse<ITwitchUserInfo>, ITwitchError>(
      `${TwitchResources.users}?${queryParams}`
    )
    return data
  }
}
