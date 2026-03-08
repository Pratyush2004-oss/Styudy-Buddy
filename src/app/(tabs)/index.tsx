import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native';

const HomeScreen = () => {
    return (
        <SafeAreaView>
            <Text>HomeScreen</Text>
            <Pressable onPress={() => { Sentry.captureException(new Error('First error')) }}>
                <Text>Throw error</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default HomeScreen