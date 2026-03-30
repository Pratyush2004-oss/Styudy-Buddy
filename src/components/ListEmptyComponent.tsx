import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from '@/lib/theme'

const ListEmptyComponent = () => {
    return (
        <View className='items-center gap-2 pt-20'>
            <Ionicons name="people-outline" size={48} color={COLORS.textSubtle} />
            <Text className='text-[17px] font-outfit-semibold text-foreground'>
                No users found
            </Text>
        </View>
    )
}

export default ListEmptyComponent;