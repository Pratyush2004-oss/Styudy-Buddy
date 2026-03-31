import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGreetingForHour } from '@/lib/utils';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppProvider';
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from '@/lib/theme';
import { ChannelList } from 'stream-chat-expo';
import type { Channel } from 'stream-chat';

const ChatScreen = () => {
    const router = useRouter();
    const { setChannel } = useAppContext();
    const { user } = useUser();
    const firstName = user?.firstName || "there";
    const [search, setSearch] = useState("");

    const filters = {
        members: { $in: [user?.id!] },
        type: "messaging"
    };

    // channel Render Filter function
    const channelRenderFilterFn = (channels: Channel[]) => {
        if (!search.trim()) return channels;
        const q = search.toLowerCase();

        return channels.filter((ch) => {
            const name = (ch.data?.name as string | undefined)?.toLowerCase() ?? ""
            const cid = ch.cid.toLowerCase();
            return name.includes(q) || cid.includes(q);
        });
    }

    return (
        <SafeAreaView className='flex-1 bg-background'>
            {/* Header */}
            <View className='px-5 pt-3 pb-2'>
                <Text className='text-sm text-foreground-muted mb-0.5 font-outfit'>{getGreetingForHour()}, {firstName}</Text>
            </View>

            {/* Search bar */}
            <View className='flex-row items-center mx-5 mb-3 bg-surface px-3.5 py-3 rounded-[14px] gap-2.5 border border-border'>
                <Ionicons name='search' size={18} color={COLORS.textMuted} />
                <TextInput
                    className='flex-1 text-sm text-foreground font-outfit'
                    placeholder='Search study rooms...'
                    placeholderTextColor={COLORS.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Section Label */}
            <View className='flex-row items-center px-5 my-1.5 gap-2'>
                <Ionicons name='chatbubbles' size={16} color={COLORS.primaryLight} />
                <Text className='text-sm font-outfit-semibold text-primary-light'>Your Study Sessions</Text>
            </View>

            {/* Channel List */}
            <ChannelList
                filters={filters}
                options={{
                    state: true,    // will fetch initial full data of the channel
                    watch: true     // will keep the channel updated with the latest data
                }}
                sort={{ last_updated: -1 }}
                channelRenderFilterFn={channelRenderFilterFn}
                onSelect={(channel) => {
                    setChannel(channel)
                    router.push(`/channel/${channel.id}`);
                }}
                additionalFlatListProps={{
                    contentContainerStyle: { flexGrow: 1 }
                }}
            />
        </SafeAreaView>
    )
}

export default ChatScreen;