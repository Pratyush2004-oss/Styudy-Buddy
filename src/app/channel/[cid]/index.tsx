import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useAppContext } from '@/contexts/AppProvider'
import { Channel, MessageInput, MessageList, ThemeContext, useChatContext } from 'stream-chat-expo';
import { useNavigation, useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import ChatEmptyState from '@/components/ChatEmptyState';
import { COLORS } from '@/lib/theme';
import { Ionicons } from "@expo/vector-icons"
import { Image } from 'expo-image';

const ChannelScreen = () => {
    const { channel, setThread } = useAppContext();
    const { client } = useChatContext();

    const router = useRouter();
    const navigation = useNavigation();

    const headerHeight = useHeaderHeight();

    let displayName = "";
    let avatarUrl = "";

    if (channel) {
        const members = Object.values(channel.state.members);
        const otherMember = members.find((member) => member.user_id !== client.userID);
        displayName = otherMember?.user?.name!;
        avatarUrl = otherMember?.user?.image || "";
    }

    /**
     * ? useEffect v/s useLayoutEffect
     * useLayoutEffect runs before the screen has been painted (synchronously)
     * useEffect runs after the screen has been painted (asyncronously)
     * so here if you use useEffect, there will be flickering effect on the screen when screen is mounted
     */

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: {
                backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.text,
            headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}
                    className='flex-row items-center ml-2'
                >
                    <Ionicons name='arrow-back' size={24} color={COLORS.text} />
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <View className='flex-row items-center ml-6'>
                    {
                        avatarUrl ? (
                            <Image
                                source={avatarUrl}
                                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
                            />
                        ) : (
                            <View className='mr-2.5 size-8 items-center justify-center rounded-full'
                                style={{ backgroundColor: COLORS.primary }}
                            >
                                <Text className='text-base font-outfit-semibold text-foreground'>
                                    {displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    <Text className='font-outfit-semibold text-foreground'>{displayName}</Text>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    // to do: implement video call functionality later
                }}
                    className='flex-row items-center p-2 mr-2 border rounded-full border-primary'
                >
                    <Ionicons name='videocam-outline' size={20} color={COLORS.primary} />
                </TouchableOpacity>
            )
        })

    }, [navigation, displayName, avatarUrl, channel?.cid, channel?.id, router]);

    if (!channel) return <FullScreenLoader message='Loading Study room ...' />;

    return (
        <View className='flex-1 bg-border'>
            <Channel
                channel={channel}
                keyboardVerticalOffset={headerHeight}
                EmptyStateIndicator={() => {
                    return <ChatEmptyState
                        icon='book-outline'
                        title='No Messages yet'
                        subtitle='Start a study conversation by sending the first message!' />;
                }}
            >
                <MessageList
                    onThreadSelect={(thread) => {
                        setThread(thread);
                        router.push(`/channel/${channel.cid}/thread/${thread?.cid}`);
                    }}
                />

                <View className='pb-5 bg-surface'>
                    <MessageInput
                    audioRecordingEnabled
                    />
                </View>
            </Channel>
        </View>
    )
}

export default ChannelScreen;