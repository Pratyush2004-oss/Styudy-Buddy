import { useAuth } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const TAB_COLORS = {
    androidBackground: '#0B1620',
    androidIconDefault: '#8BA1B5',
    androidIconActive: '#fff',
    androidIndicator: '#1FD8C8',
    androidRipple: 'rgba(31, 216, 200, 0.16)',
} as const;

const TAB_LABELS = {
    index: 'Home',
    explore: 'Explore',
    profile: 'Profile',
    search: 'Search',
} as const;

const TAB_ICONS = {
    index: 'chat',
    explore: 'explore',
    profile: 'person',
    search: 'search',
} as const;

const MAIN_ANDROID_TABS = ['index', 'explore', 'profile'] as const;

const AndroidTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const searchIndex = state.routes.findIndex((route) => route.name === 'search');

    return (
        <View style={styles.androidTabBarContainer}>
            <View style={styles.androidMainTabsGroup}>
                {MAIN_ANDROID_TABS.map((tabName) => {
                    const routeIndex = state.routes.findIndex((route) => route.name === tabName);
                    if (routeIndex < 0) {
                        return null;
                    }

                    const route = state.routes[routeIndex];
                    const isFocused = state.index === routeIndex;

                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={() => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name, route.params);
                                }
                            }}
                            style={[styles.androidMainTabButton, isFocused && styles.androidMainTabButtonActive]}
                        >
                            <MaterialIcons
                                name={TAB_ICONS[tabName]}
                                size={20}
                                color={isFocused ? TAB_COLORS.androidIconActive : TAB_COLORS.androidIconDefault}
                            />
                            <Text style={[styles.androidMainTabLabel, isFocused && styles.androidMainTabLabelActive]}>
                                {TAB_LABELS[tabName]}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {searchIndex >= 0 ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityState={state.index === searchIndex ? { selected: true } : {}}
                    onPress={() => {
                        const route = state.routes[searchIndex];
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (state.index !== searchIndex && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    }}
                    style={[
                        styles.androidSearchButton,
                        state.index === searchIndex && styles.androidSearchButtonActive,
                    ]}
                >
                    <MaterialIcons
                        name={TAB_ICONS.search}
                        size={22}
                        color={state.index === searchIndex ? TAB_COLORS.androidIconActive : TAB_COLORS.androidIconDefault}
                    />
                </Pressable>
            ) : null}
        </View>
    );
};

const TabsLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()
    const isAndroid = Platform.OS === 'android'

    if (!isLoaded) {
        return null
    }
    if (!isSignedIn) {
        return <Redirect href={'/(auth)'} />
    }

    if (isAndroid) {
        return (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.hiddenDefaultTabBar,
                }}
                tabBar={(props) => <AndroidTabBar {...props} />}
            >
                <Tabs.Screen name="index" options={{ title: TAB_LABELS.index }} />
                <Tabs.Screen name="explore" options={{ title: TAB_LABELS.explore }} />
                <Tabs.Screen name="profile" options={{ title: TAB_LABELS.profile }} />
                <Tabs.Screen name="search" options={{ title: TAB_LABELS.search }} />
            </Tabs>
        )
    }

    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="message" md="chat" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="explore">
                <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="safari" md="explore" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name='profile'>
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person.fill" md="person" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name='search' role='search'>
                <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
        </NativeTabs>
    )
}

const styles = StyleSheet.create({
    hiddenDefaultTabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        backgroundColor: 'transparent',
        height: 0,
    },
    androidTabBarContainer: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    androidMainTabsGroup: {
        flex: 1,
        marginRight: 12,
        borderRadius: 35,
        backgroundColor: TAB_COLORS.androidBackground,
        paddingHorizontal: 6,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    androidMainTabButton: {
        flex: 1,
        borderRadius: 30,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    androidMainTabButtonActive: {
        backgroundColor: TAB_COLORS.androidIndicator,
        opacity: 0.75,
    },
    androidMainTabLabel: {
        marginTop: 2,
        fontSize: 12,
        color: TAB_COLORS.androidIconDefault,
        fontWeight: '500',
    },
    androidMainTabLabelActive: {
        color: TAB_COLORS.androidIconActive,
        fontWeight: '700',
    },
    androidSearchButton: {
        width: 52,
        height: 52,
        borderRadius: 30,
        backgroundColor: TAB_COLORS.androidBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    androidSearchButtonActive: {
        backgroundColor: TAB_COLORS.androidIndicator,
    },
});

export default TabsLayout