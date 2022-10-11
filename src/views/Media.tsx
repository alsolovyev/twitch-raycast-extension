import { Action, ActionPanel, Color, Grid, Icon } from '@raycast/api'
import { useState } from 'react'
import useMedia from '../hooks/useMedia'
import { ITwtichGetUserVideosQueryParams, TwitchMediaType, TwitchVideoType } from '../services/twitch.service'
import ErrorView from './Error'

export const enum ThumbnailSize {
  medium = '400'
}

export interface IMediaView {
  user: { id: string; name: string }
}

/** A view to display user media (videos, clips) */
export default ({ user: { name, id } }: IMediaView) => {
  const [mediaType, setMediaType] = useState<TwitchMediaType>(TwitchMediaType.video)
  const [queryParams, setQueryParams] = useState<ITwtichGetUserVideosQueryParams>({ type: TwitchVideoType.all })
  const [error, isLoading, videos] = useMedia(id, mediaType, queryParams)

  if (error) return <ErrorView error={error} />

  return (
    <Grid
      navigationTitle={`${name}'s ${mediaType}s`}
      itemSize={Grid.ItemSize.Medium}
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip='Select Video Type'
          onChange={value => {
            const { type, queryParams } = JSON.parse(value)
            setMediaType(type)
            setQueryParams(queryParams)
          }}
        >
          <Grid.Dropdown.Section title='Videos'>
            {(Object.keys(TwitchVideoType) as Array<keyof typeof TwitchVideoType>).map((key, index) => (
              <Grid.Dropdown.Item
                key={index}
                title={key}
                value={JSON.stringify({ type: TwitchMediaType.video, queryParams: { type: key } })}
              />
            ))}
          </Grid.Dropdown.Section>
          <Grid.Dropdown.Section title='Clips'>
            <Grid.Dropdown.Item key='-1' title='all' value={JSON.stringify({ type: TwitchMediaType.clip })} />
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      <Grid.EmptyView
        icon={{ source: Icon.Video, tintColor: Color.Purple }}
        title={`No ${mediaType}s`}
        description={`${name} has no ${mediaType}s`}
      />

      {videos.map(({ id, thumbnail_url, title, url, created_at, view_count }) => (
        <Grid.Item
          title={title}
          subtitle={
            mediaType === TwitchMediaType.video
              ? new Date(created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : `${view_count} views`
          }
          content={{ source: thumbnail_url.replaceAll(/%{(width|height)}/gi, ThumbnailSize.medium) }}
          key={id}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                icon={{ source: Icon.Video, tintColor: Color.Purple }}
                title={`Open ${mediaType} in Browser`}
                url={url}
              />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  )
}
