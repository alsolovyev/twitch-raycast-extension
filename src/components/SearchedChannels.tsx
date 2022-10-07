import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { ITwitchSearchedChannel } from '../services/twitch.service'


export interface ISearchedChannels {
  channels: Array<ITwitchSearchedChannel>
  subtitle?: string
  title?: string
}

/**
 * A component for displaying the list of found channels.
 *
 * @param props.channels - The list of channels to display.
 * @param props.subtitle - The subtitle of the list.
 * @param props.title - The title of the list.
 * @returns jsx element.
 **/
export default ({ channels, subtitle, title }: ISearchedChannels): JSX.Element => (
  <List.Section title={title} subtitle={subtitle}>
    {channels.map(({ broadcaster_login, id, display_name, game_name, title, is_live, started_at }) => (
      <List.Item
        icon={{ source: Icon.Livestream, tintColor: is_live ? Color.Green : undefined }}
        title={display_name}
        subtitle={`${game_name} | ${title}`}
        key={id}
        accessories={[
          is_live
            ? { icon: { source: Icon.Clock }, date: new Date(started_at), tooltip: 'Time Spent Live Streaming' }
            : {}
        ]}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser
              icon={Icon.Livestream}
              title='Open Channel in Browser'
              url={`https://twitch.tv/${broadcaster_login}`}
            />
            {is_live && (
              <Action.OpenInBrowser
                icon={Icon.SpeechBubble}
                title='Open Chat in Browser'
                url={`https://twitch.tv/popout/${broadcaster_login}/chat?popout=`}
              />
            )}
          </ActionPanel>
        }
      />
    ))}
  </List.Section>
)