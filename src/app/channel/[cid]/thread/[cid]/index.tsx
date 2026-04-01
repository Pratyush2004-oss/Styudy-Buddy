import { View, Text } from 'react-native'
import React from 'react'
import { useAppContext } from '@/contexts/AppProvider'
import { useHeaderHeight } from '@react-navigation/elements';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel, Thread } from 'stream-chat-expo';
import ChatEmptyState from '@/components/ChatEmptyState';

const ThreadScreen = () => {
  const { thread, channel, setThread } = useAppContext();
  const headerHeight = useHeaderHeight();

  if (channel === null) return <FullScreenLoader message='Loading Thread....' />
  return (
    <SafeAreaView className='flex-1 bg-surface'>
      <Channel
        channel={channel}
        keyboardVerticalOffset={headerHeight}
        thread={thread}
        threadList={true}
        EmptyStateIndicator={() => (
          <ChatEmptyState
            icon='book-outline'
            title='No Messages yet'
            subtitle='Send a message to start a conversation'
          />
        )}
      >
        <View className='justify-center flex-1'>
            <Thread onThreadDismount={() => setThread(null)}/>
        </View>
      </Channel>
    </SafeAreaView>
  )
}

export default ThreadScreen