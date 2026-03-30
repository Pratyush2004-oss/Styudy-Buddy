import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGreetingForHour } from '@/lib/utils';
import { useUser } from '@clerk/clerk-expo';

const ChatScreen = () => {
    const { user } = useUser();
    return (
        <SafeAreaView className='flex-1 bg-background'>
            <View className='px-5 pt-3 pb-2'>
                <Text className='text-sm text-foreground-muted mb-0.5 font-outfit'>{getGreetingForHour()}, {user?.firstName}</Text>
            </View>
        </SafeAreaView>
    )
}

export default ChatScreen;