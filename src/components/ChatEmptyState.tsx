import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '@/lib/theme';

type EmptyStateProps = {
    icon : keyof typeof Ionicons.glyphMap
    title:string
    subtitle: string
}

const ChatEmptyState = ({icon, title, subtitle} : EmptyStateProps) => {
  return (
    <View className='items-center justify-center flex-1 px-5 bg-surface-light'>
        <View className='mb-5'>
            <Ionicons name={icon} size={64} color={COLORS.textSubtle} />
        </View>
        <Text className='text-base text-center font-outfit text-foreground-muted'>{title}</Text>
        <Text className='mt-1 text-sm text-center text-foreground-subtle font-outfit'>{subtitle}</Text>
    </View>
  )
}

export default ChatEmptyState