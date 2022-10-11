import { Color, getPreferenceValues } from '@raycast/api'


interface RaycastPreferences {
  accentColor: string
  authToken: string
  clientId: string
}

const { accentColor: color, authToken, clientId } = getPreferenceValues<RaycastPreferences>()

const accentColor = Color[color as keyof typeof Color]

export { accentColor, authToken, clientId }
