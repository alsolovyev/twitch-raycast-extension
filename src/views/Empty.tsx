import { Color, Icon, Image, List } from '@raycast/api'


export interface IEmptyView {
  title: string
  description: string
}

const EmptyIcon: Image.ImageLike = {
  source: Icon.HeartDisabled,
  tintColor: Color.green
}

/** A view to display when there aren't any items available */
export default ({ title, description }: IEmptyView) => (
  <List>
    <List.EmptyView icon={EmptyIcon} title={title} description={description} />
  </List>
)
