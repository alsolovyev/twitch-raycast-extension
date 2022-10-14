import { Color, getPreferenceValues } from '@raycast/api'


interface RaycastPreferences {
  accentColor: string
  areFollowedOfflineChannelsHidden: boolean
  authToken: string
  clientId: string
}

const { accentColor: color, areFollowedOfflineChannelsHidden, authToken, clientId } = getPreferenceValues<RaycastPreferences>()

const accentColor = Color[color as keyof typeof Color]

export { accentColor, areFollowedOfflineChannelsHidden, authToken, clientId }
