import { useAuth } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

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
        <View className="absolute bottom-[5px] left-3 right-3 flex-row items-center justify-between">
            <View className="mr-3 flex-1 flex-row items-center rounded-[35px] bg-[#0B1620] px-1.5 py-1.5">
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
                            android_ripple={{ color: TAB_COLORS.androidRipple, borderless: false }}
                            className={`flex-1 items-center justify-center rounded-[30px] py-2 ${isFocused ? 'bg-[#1FD8C8]/75' : ''}`}
                        >
                            <MaterialIcons
                                name={TAB_ICONS[tabName]}
                                size={20}
                                color={isFocused ? TAB_COLORS.androidIconActive : TAB_COLORS.androidIconDefault}
                            />
                            <Text
                                className={`mt-0.5 text-xs ${isFocused ? 'text-white' : 'text-[#8BA1B5]'}`}
                                style={{ fontFamily: 'Outfit', fontWeight: isFocused ? '700' : '500' }}
                            >
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
                    android_ripple={{ color: TAB_COLORS.androidRipple, borderless: false }}
                    className={`h-[52px] w-[52px] items-center justify-center rounded-[30px] ${state.index === searchIndex ? 'bg-[#1FD8C8]' : 'bg-[#0B1620]'}`}
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
    const { isSignedIn, isLoaded } = useAuth();
    const isAndroid = Platform.OS === 'android';

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Redirect href={'/(auth)'} />;
    }

    if (isAndroid) {
        return (
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        position: 'absolute',
                        borderTopWidth: 0,
                        elevation: 0,
                        backgroundColor: 'transparent',
                        height: 0,
                    },
                }}
                tabBar={(props) => <AndroidTabBar {...props} />}
            >
                <Tabs.Screen name="index" options={{ title: TAB_LABELS.index }} />
                <Tabs.Screen name="explore" options={{ title: TAB_LABELS.explore }} />
                <Tabs.Screen name="profile" options={{ title: TAB_LABELS.profile }} />
                <Tabs.Screen name="search" options={{ title: TAB_LABELS.search }} />
            </Tabs>
        );
    }

    return (
        <NativeTabs labelStyle={{ fontFamily: 'Outfit' }}>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="message" md="chat" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="explore">
                <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="safari" md="explore" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person.fill" md="person" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="search" role="search">
                <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" selectedColor={'#6C5CE7'} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
};

export default TabsLayout;
