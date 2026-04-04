import ExploreUserCard from '@/components/ExploreUserCard';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import { useAppContext } from '@/contexts/AppProvider';
import useStartChat from '@/hooks/useStartChat';
import useStreamUsers from '@/hooks/useStreamUsers';
import { COLORS } from '@/lib/theme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { UserResponse } from 'stream-chat';
import { useChatContext } from 'stream-chat-expo';

const SearchScreen = () => {
  const { setChannel } = useAppContext();
  const { user } = useUser();
  const { client } = useChatContext();
  const userId = user?.id ?? "";

  const [creating, setCreating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { users, loading } = useStreamUsers(client, userId);
  const { handleStartChat } = useStartChat({ client, userId, setChannel, setCreating });

  const handleClearSearch = () => {
    setSearch("");
  };

  // Filter users based on search
  const filteredUsers = !search.trim() ? users : users.filter(
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
      {/* Header */}
      <View className='px-5 pt-3 pb-2'>
        <Text className='text-[28px] font-outfit-bold text-foreground'>Search</Text>
        <Text className='text-sm text-foreground-muted font-outfit'>
          Find people and start chatting
        </Text>
      </View>

      {/* Search Bar */}
      <View className='flex-row items-center mx-5 my-3 bg-surface px-3.5 py-2.5 rounded-[14px] gap-2.5 border border-border'>
        <Ionicons name='search' size={18} color={COLORS.textMuted} />
        <TextInput
          className='flex-1 text-sm text-foreground font-outfit'
          placeholder='Search by name, username...'
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize='none'
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={handleClearSearch}>
            <Ionicons name='close-circle' size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View className='items-center justify-center flex-1'>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <View className='flex-1'>
          {search.trim().length === 0 && (
            <View className='px-5 mb-3'>
              <Text className='text-base font-outfit-semibold text-foreground'>
                Explore People
              </Text>
              <Text className='mt-1 text-sm text-foreground-muted font-outfit'>
                Start typing to filter by name, username, or id.
              </Text>
            </View>
          )}

          {filteredUsers.length > 0 ? (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<ListEmptyComponent />}
            />
          ) : (
            <View className='items-center justify-center flex-1 px-5'>
              <Ionicons name='search-outline' size={48} color={COLORS.textMuted} />
              <Text className='mt-4 text-lg font-outfit-semibold text-foreground'>
                No results found
              </Text>
              <Text className='mt-2 text-sm text-center text-foreground-muted font-outfit'>
                Try searching for a different name or username
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

export default SearchScreen