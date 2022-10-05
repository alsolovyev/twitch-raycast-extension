import { Color, Icon, Image, List } from '@raycast/api'
import type { IApiServiceError } from '../services/api.service'
import type { ITwitchError } from '../services/twitch.service'


export interface IErrorView {
  error: ITwitchError | IApiServiceError
}

const ErrorIcon: Image.ImageLike = {
  source: Icon.HeartDisabled,
  tintColor: Color.Red
}

/** A view to display when an error occurs */
export default ({ error: { message, error } }: IErrorView): JSX.Element => (
  <List>
    <List.EmptyView icon={ErrorIcon} title={error} description={message} />
  </List>
)
