import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { ITwitchUser } from '../services/twitch.service'


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
              icon={{ source: Icon.Livestream, tintColor: Color.Purple }}
              title='Open Channel in Browser'
              url={`https://twitch.tv/${login}`}
            />
          </ActionPanel>
        }
      />
    ))}
  </List.Section>
)
