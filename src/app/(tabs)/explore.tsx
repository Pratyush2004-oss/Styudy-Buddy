import { useAppContext } from '@/contexts/AppProvider'
import useStreamUsers from '@/hooks/useStreamUsers';
import { useUser } from '@clerk/clerk-expo';
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatContext } from 'stream-chat-expo';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/lib/theme';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import type { UserResponse } from 'stream-chat'
import ExploreUserCard from '@/components/ExploreUserCard';
import useStartChat from '@/hooks/useStartChat';

const ExploreScreen = () => {
    const { setChannel } = useAppContext();
    const { user } = useUser();
    const { client } = useChatContext();
    const userId = user?.id ?? "";

    const [creating, setCreating] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const { users, loading } = useStreamUsers(client, userId);

    const { handleStartChat } = useStartChat({ client, userId, setChannel, setCreating });
    const FilteredUsers = !search.trim() ? users : users.filter(
        (user) =>
            user.id?.toLowerCase().includes(search.toLowerCase()) ||
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.username?.toLowerCase().includes(search.toLowerCase())
    );

    const renderUserItem = ({ item }: { item: UserResponse }) => {
        return (
            <ExploreUserCard item={item} creating={creating} onStartChat={handleStartChat} />
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-background'>
            {/* Header component */}
            <View className='px-5 pt-3 pb-1'>
                <Text className='text-[28px] font-outfit-bold text-foreground'>Explore</Text>
                <Text className='text-sm text-foreground-muted font-outfit'>
                    Find people and start chatting
                </Text>
            </View>

            {/* Search Bar */}
            <View className='flex-row items-center mx-5 my-4 bg-surface px-3.5 py-1 rounded-[14px] gap-2.5 border border-border'>
                <Ionicons name='search' size={18} color={COLORS.textMuted} />
                <TextInput
                    className='flex-1 text-sm text-foreground font-outfit'
                    placeholder='Search people...'
                    placeholderTextColor={COLORS.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                        <Ionicons name='close-circle' size={18} color={COLORS.textMuted} />
                    </Pressable>
                )}
            </View>

            {/* Users List */}
            {loading ? (
                <View className='items-center justify-center flex-1'>
                    <ActivityIndicator size={"large"} color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={FilteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<ListEmptyComponent />}
                />
            )}


        </SafeAreaView>
    )
}

export default ExploreScreen;