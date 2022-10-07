import { Color, Icon, List, showToast, Toast } from '@raycast/api'
import { useEffect, useState } from 'react'
import SearchedChannels from './components/SearchedChannels'
import useSearchChannels from './hooks/useSearchChannels'
import ErrorView from './views/Error'


/** Search Twitch channels by name or description  */
export default () => {
  const [query, setQuery] = useState<string>()
  const [error, isLoading, liveChannels, offlineChannels] = useSearchChannels(query)

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: error.error,
        message: error.message
      })
    }
  }, [error])

  if (error) return <ErrorView error={error} />

  return (
    <List
      enableFiltering={false}
      onSearchTextChange={setQuery}
      navigationTitle='Search Twitch Channels'
      searchBarPlaceholder='Search'
      isLoading={isLoading}
      throttle={true}
    >
      {query === undefined || (query === '' && liveChannels.length === 0 && offlineChannels.length === 0) ? (
        <List.EmptyView
          icon={{ source: Icon.MagnifyingGlass, tintColor: Color.Purple }}
          title='Search Twitch Channels'
          description='Enter a channel name or description'
        />
      ) : (
        <List.EmptyView
          icon={{ source: Icon.HeartDisabled, tintColor: Color.Purple }}
          title='No Matches Found'
          description='Please try another search'
        />
      )}
      <SearchedChannels
        title='Live Channels'
        subtitle={`${liveChannels.length} live channels were found`}
        channels={liveChannels}
      />
      <SearchedChannels
        title='Offline Channels'
        subtitle={`${offlineChannels.length} offline channels were found`}
        channels={offlineChannels}
      />
    </List>
  )
}
