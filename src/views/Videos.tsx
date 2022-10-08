import { Action, ActionPanel, Color, Grid, Icon } from '@raycast/api'
import { useState } from 'react'
import useVideos from '../hooks/useVideos'
import { TwitchVideoType } from '../services/twitch.service'
import ErrorView from './Error'


export const enum ThumbnailSize {
  medium = '400'
}

export interface IVideoView {
  user: { id: string; name: string }
}

/** A view to display a grid of user videos */
export default ({ user: { name, id } }: IVideoView) => {
  const [type, setType] = useState<TwitchVideoType>(TwitchVideoType.archive)
  const [error, isLoading, videos] = useVideos(id, type)

  if (error) return <ErrorView error={error} />

  return (
    <Grid
      navigationTitle={`${name}'s Videos`}
      itemSize={Grid.ItemSize.Medium}
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip='Select Video Type'
          storeValue={true}
          onChange={type => setType(type as TwitchVideoType)}
        >
          <Grid.Dropdown.Section title='Video Types'>
            {(Object.keys(TwitchVideoType) as Array<keyof typeof TwitchVideoType>).map((key, index) => (
              <Grid.Dropdown.Item key={index} title={key} value={key} />
            ))}
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      <Grid.EmptyView
        icon={{ source: Icon.Video, tintColor: Color.Purple }}
        title='No Videos'
        description={`${name} has no videos`}
      />

      {videos.map(({ id, thumbnail_url, title, url, created_at }) => (
        <Grid.Item
          title={title}
          subtitle={new Date(created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          content={{ source: thumbnail_url.replaceAll(/%{(width|height)}/gi, ThumbnailSize.medium) }}
          key={id}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                icon={{ source: Icon.Video, tintColor: Color.Purple }}
                title='Open Video in Browser'
                url={url}
              />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  )
}
