import ApiService from './api.service'
import type { OutgoingHttpHeaders } from 'node:http'
import { Singleton } from '../decorators/singleton.decorator'
import { authToken, clientId } from '../core/preferences'


export interface ITwitchService {
  getAuthUser(): Promise<ITwitchUser>
  getLiveFollowedStreams(userId: string | number): Promise<Array<ITwitchLiveStream>>
  getUserFollows(userId: string | number): Promise<Array<ITwitchUserFollowsFromTo>>
  getUsers(userIDsOrLogins: Array<string>): Promise<Array<ITwitchUser>>
  searchChannels(query: string): Promise<Array<ITwitchSearchedChannel>>
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
  type: 'staff' | 'admin' | 'global_mod' | ''
  broadcaster_type: 'partner' | 'affiliate' | ''
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
  email?: string
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
  is_mature: boolean
}

export interface ITwitchUserFollowsFromTo {
  from_id: string
  from_login: string
  from_name: string
  to_id: string
  to_name: string
  followed_at: string
}

export interface ITwitchSearchedChannel {
  broadcaster_language: string
  broadcaster_login: string
  display_name: string
  game_id: string
  game_name: string
  id: string
  is_live: boolean
  started_at: string
  tags_ids: Array<string>
  thumbnail_url: string
  title: string
}

export const enum TwitchResources {
  host = 'https://api.twitch.tv',
  users = '/helix/users',
  followed = '/helix/streams/followed',
  follows = '/helix/users/follows',
  searchChannels = '/helix/search/channels'
}

/**
 * Service for working with Twitch.tv API
 *
 * @remarks
 * Twitch API Docs- {@link https://dev.twitch.tv/docs}
 */
@Singleton
class TwitchService extends ApiService implements ITwitchService {
  /** A user authenticated with a Bearer token. */
  private _authUser: ITwitchUser | undefined

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
    if (this._authUser) return this._authUser

    const { data } = await this.get<ITwitchResponse<ITwitchUser>, ITwitchError>(TwitchResources.users)
    this._authUser = data[0]

    return this._authUser
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
  public async getUsers(userIDsOrLogins: Array<string>): Promise<Array<ITwitchUser>> {
    if (userIDsOrLogins.length === 0) return []

    const queryParams: string = userIDsOrLogins
      .reduce((prev: string, cur: string) => `${prev}${isNaN(Number(cur)) ? 'login=' : 'id='}${cur}&`, '')
      .slice(0, -1)

    const { data } = await this.get<ITwitchResponse<ITwitchUser>, ITwitchError>(
      `${TwitchResources.users}?${queryParams}`
    )
    return data
  }

  /**
   * Searches for channels (users who have streamed within the past 6 months)
   * that match a query via channel name or description either entirely or partially.
   *
   * @remarks
   * Twitch API Reference Search Channels - {@link https://dev.twitch.tv/docs/api/reference#search-channels}
   *
   * @param query - The search query.
   * @returns a list of channels (users who have streamed within the past 6 months).
   */
  public async searchChannels(query: string): Promise<Array<ITwitchSearchedChannel>> {
    if (query === '') return []

    const { data } = await this.get<ITwitchResponse<ITwitchSearchedChannel>>(
      `${TwitchResources.searchChannels}?query=${encodeURI(query)}`
    )

    return data
  }
}

export default new TwitchService(TwitchResources.host, {
  'Authorization': `Bearer ${ authToken }`,
  'Client-Id': clientId
})
