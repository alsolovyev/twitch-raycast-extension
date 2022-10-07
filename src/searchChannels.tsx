import { List, showToast, Toast } from '@raycast/api'
import { useEffect, useState } from 'react'
import SearchedChannels from './components/SearchedChannels'
import useSearchChannels from './hooks/useSearchChannels'
import EmptyView from './views/Empty'
import ErrorView from './views/Error'


/** Search Twitch channels by name or description  */
export default () => {
  const [query, setQuery] = useState<string>('')
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
  if (query.length > 0 && liveChannels.length === 0 && offlineChannels.length === 0 && !isLoading)
    return <EmptyView title='No Matches Found' description='Please try another search' />

  return (
    <List
      enableFiltering={false}
      onSearchTextChange={setQuery}
      navigationTitle='Search Twitch Channels'
      searchBarPlaceholder='Type channel name or description'
      isLoading={isLoading}
      throttle={true}
    >
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
