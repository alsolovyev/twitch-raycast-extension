import { getPreferenceValues } from '@raycast/api'


interface RaycastPreferences {
  authToken: string
  clientId: string
}

const { authToken, clientId } = getPreferenceValues<RaycastPreferences>()

export { authToken, clientId }
