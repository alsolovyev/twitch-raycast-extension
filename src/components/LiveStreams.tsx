import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { ITwitchLiveStream } from '../services/twitch.service'


export interface ILiveStreams {
  streams: Array<ITwitchLiveStream>
}

/**
 * A component to display a list of live streams.
 *
 * @param streams - The list of streams to display.
 * @returns jsx element.
 **/
export default ({ streams }: ILiveStreams) => (
  <List.Section
    title='Live channels'
    subtitle={`currently ${streams.length} ${streams.length > 1 ? 'channels' : 'channel'} live`}
  >
    {streams.map(({ game_name, started_at, title, user_id, user_login, user_name, viewer_count }) => (
      <List.Item
        icon={{ source: Icon.Livestream, tintColor: Color.Green }}
        title={user_name}
        subtitle={`${game_name} | ${title}`}
        key={user_id}
        accessories={[
          { icon: { source: Icon.TwoPeople }, text: String(viewer_count), tooltip: 'Viewer Count' },
          { icon: { source: Icon.Clock }, date: new Date(started_at), tooltip: 'Time Spent Live Streaming' }
        ]}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser
              icon={Icon.Livestream}
              title='Open Channel in Browser'
              url={`https://twitch.tv/${user_login}`}
            />
            <Action.OpenInBrowser
              icon={Icon.SpeechBubble}
              title='Open Chat in Browser'
              url={`https://twitch.tv/popout/${user_login}/chat?popout=`}
            />
          </ActionPanel>
        }
      />
    ))}
  </List.Section>
)
