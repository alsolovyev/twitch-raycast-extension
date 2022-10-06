import { List, showToast, Toast } from '@raycast/api'
import { useEffect } from 'react'
import EmptyView from './views/Empty'
import ErrorView from './views/Error'
import LiveStreams from './components/LiveStreams'
import OfflineStreams from './components/OfflineStreams'
import useFollowedStreams from './hooks/useFollowedStreams'


/** Displays information about followed channels */
export default () => {
  const [error, isLoading, liveStreams, offlineStreams] = useFollowedStreams()

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: error.error,
        message: error.message,
      })
    }
  }, [error])

  if (error) return <ErrorView error={error} />
  if (liveStreams.length === 0 && offlineStreams.length === 0 && !isLoading)
    return <EmptyView title='No Channels' description='You are currently not subscribed to any channel' />

  return (
    <List navigationTitle='Followed Channels' isLoading={isLoading}>
      <LiveStreams streams={liveStreams} />
      <OfflineStreams streams={offlineStreams} />
    </List>
  )
}
