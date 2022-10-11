import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { accentColor } from '../core/preferences'
import { ITwitchUser } from '../services/twitch.service'
import MediaView from '../views/Media'


export interface IOfflineStreams {
  streams: Array<ITwitchUser>
}

/**
 * A component to display a list of offline streams.
 *
 * @param streams - The list of streams to display.
 * @returns jsx element.
 **/
export default ({ streams }: IOfflineStreams) => (
  <List.Section
    title='Offline channels'
    subtitle={`currently ${streams.length} ${streams.length > 1 ? 'channels' : 'channel'} offline`}
  >
    {streams.map(({ description, display_name, id, login }) => (
      <List.Item
        icon={{ source: Icon.Livestream }}
        title={display_name}
        subtitle={description}
        key={id}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser
              icon={{ source: Icon.Livestream, tintColor: accentColor }}
              title='Open Channel in Browser'
              url={`https://twitch.tv/${login}`}
            />
            <Action.Push
              icon={{ source: Icon.Video, tintColor: accentColor }}
              title='Open Channel Media'
              target={<MediaView user={{ id, name: display_name }} />}
            />
          </ActionPanel>
        }
      />
    ))}
  </List.Section>
)
