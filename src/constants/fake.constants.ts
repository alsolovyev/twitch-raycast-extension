import { ITwitchError, ITwitchLiveStream, ITwitchUser, ITwitchUserFollowsFromTo } from '../services/twitch.service'

export const fakeTwitchAuthToken: string = 't6v8z82dmym8zz69tej4atolibdcr7'
export const fakeTwitchClientId: string = 'qou2ulob7b2y1w6zc6qhahdj75653x'

export const fakeTwitchUser: ITwitchUser = {
  broadcaster_type: 'partner',
  created_at: '2016-12-14T20:32:28Z',
  description: 'Supporting third-party developers building Twitch integrations from chatbots to game integrations.',
  display_name: 'TwitchDev',
  email: 'not-real@email.com',
  id: '141981764',
  login: 'twitchdev',
  offline_image_url:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/3f13ab61-ec78-4fe6-8481-8682cb3b0ac2-channel_offline_image-1920x1080.png',
  profile_image_url:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png',
  type: '',
  view_count: 5980557
}

export const fakeTwitchLiveStream: ITwitchLiveStream = {
  game_id: '494131',
  game_name: 'Little Nightmares',
  id: '41375541868',
  is_mature: false,
  language: 'es',
  started_at: '2021-03-10T15:04:21Z',
  tag_ids: ['d4bb9c58-2141-4881-bcdc-3fe0505457d1'],
  thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_auronplay-{width}x{height}.jpg',
  title: 'hablamos y le damos a Little Nightmares 1',
  type: 'live',
  user_id: '459331509',
  user_login: 'auronplay',
  user_name: 'auronplay',
  viewer_count: 78365
}

export const fakeTwitchUserFollowsFromTo: ITwitchUserFollowsFromTo = {
  from_id: "171003792",
  from_login: "iiisutha067iii",
  from_name: "IIIsutha067III",
  to_id: "23161357",
  to_name: "LIRIK",
  followed_at: "2017-08-22T22:55:24Z"
}

export const fakeTwitchError: ITwitchError = {
  error: 'Unauthorized',
  message: 'OAuth token is missing',
  status: 401
}
