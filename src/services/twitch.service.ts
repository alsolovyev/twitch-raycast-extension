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

export const enum TwitchResources {
  users = '/helix/users'
}

export default class TwitchService extends ApiService {
  constructor(host: string, headers: OutgoingHttpHeaders) {
    super(host, headers)
  }

  public async getAuthUser(): Promise<ITwitchUser> {
    const { data } = await this.get<ITwitchResponse<ITwitchUser>, ITwitchError>(TwitchResources.users)
    return data[0]
  }
}
