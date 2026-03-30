import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import type { UserResponse } from 'stream-chat'
import { Image } from 'expo-image'
import { COLORS } from '@/lib/theme'
import { Ionicons } from '@expo/vector-icons'
type UserCardProp =
    {
        item: UserResponse,
        creating: string | null,
        onStartChat: (targetId: string) => void
    }

const ExploreUserCard = ({ item, creating, onStartChat }: UserCardProp) => {
    return (
        <Pressable className='flex-row items-center bg-surface rounded-2xl p-3.5 mb-2.5 border border-border gap-3.5'
            onPress={() => onStartChat(item.id)}
            disabled={creating !== null}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
                contentFit='cover'
            />
            {item.online && (
                <View className='absolute left-[50px] top-[46px] border-2 rounded-full size-3 bg-accent-secondary ' />
            )}

            {/* User information */}
            <View className='flex-1'>
                <Text className='text-base font-outfit-semibold text-foreground' numberOfLines={1}>
                    {item.name || item.id}
                </Text>
                <Text className='text-xs text-foreground-muted mt-0.5'>
                    {item.online ? "Online" : "Offline"}
                </Text>
            </View>

            {/* Chat button on right */}
            {creating === item.id ? (
                <ActivityIndicator size='small' color={COLORS.primary} />
            ) : (
                <View className='items-center justify-center rounded-full size-9 bg-primary/20'>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
                </View>
            )}
        </Pressable>
    )
}

export default ExploreUserCard