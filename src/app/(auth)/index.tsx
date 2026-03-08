import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import useSocialAuth from '@/hooks/useSocialAuth';
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { openAuthSessionAsync } from 'expo-web-browser';

const tags = [
    {
        icon: "videocam" as const,
        label: "Video Calls",
        color: "#A29BFE",
        bg: "bg-primary/12 border-primary/20",
    },
    {
        icon: "chatbubbles" as const,
        label: "Study Rooms",
        color: "#FF6B6B",
        bg: "bg-accent/12 border-accent/20",
    },
    {
        icon: "people" as const,
        label: "Find Partners",
        color: "#00B894",
        bg: "bg-accent-secondary/12 border-accent-secondary/20",
    },
]

const AuthScreen = () => {
    const { handleSocialAuth, loadingStrategy } = useSocialAuth();
    const isLoading = loadingStrategy !== null;
    return (
        <View className='bg-background flex-1'>
            <View className='absolute inset-0'>
                <LinearGradient
                    colors={['#0F0E17', '#1A1A2E', '#2D1B69', '#1A1A2E', '#0F0E17']}
                    locations={[0, 0.25, 0.5, 0.75, 1]}
                    style={{ height: '100%', width: '100%' }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>
            <SafeAreaView className='flex-1 justify-between'>
                {/* top section - logo and tagline */}
                <View>
                    <View className='items-center pt-10 pb-2'>
                        <View className='size-16 rounded-[20px] bg-primary/15 items-center justify-center border border-primary/20'>
                            <Ionicons name="school" size={30} color="#A29BFE" />
                        </View>
                        <Text className='text-3xl font-outfit-bold text-foreground tracking-tight mt-4'>Study Buddy</Text>

                        <Text className='text-foreground-muted text-sm mt-1.5 tracking-wide font-outfit'>Learn together, grow together</Text>
                    </View>

                    <View className='items-center px-6 mt-4'>
                        <Image
                            source={require('@/assets/images/auth.png')}
                            style={{ width: 320, height: 350 }}
                            contentFit="cover"
                        />
                    </View>

                    {/* feature chips */}
                    <View className='flex-row flex-wrap justify-center gap-3 px-6 mt-5'>{
                        tags.map(({ icon, label, color, bg }) => (
                            <View className={`${bg} rounded-full py-2 px-3.5 items-center flex-row gap-1.5`} key={label}>
                                <Ionicons name={icon} size={14} color={color} />
                                <Text className='text-xs font-outfit-semibold text-foreground tracking-wide'>{label}</Text>
                            </View>
                        ))
                    }</View>
                </View>

                {/* Authentication buttons */}
                <View className='px-8 pb-4'>

                    {/* divider */}
                    <View className='flex-row items-center gap-3 mb-6'>
                        <View className='flex-1 h-px bg-border' />
                        <Text className='text-foreground-subtle text-xs font-medium tracking-widest uppercase font-outfit'>Continue With</Text>
                        <View className='flex-1 h-px bg-border' />
                    </View>

                    {/* Buttons */}
                    <View className='flex-row justify-center items-center gap-4 mb-5'>
                        {/* Google btn */}
                        <Pressable
                            className='size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg shadow-white/10'
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            onPress={() => handleSocialAuth("oauth_google")}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel='Continue with Google'
                        >
                            {
                                loadingStrategy === "oauth_google" ? (
                                    <ActivityIndicator size={"small"} color={"#6C5CE7"} />
                                ) : (
                                    <Image source={require("@/assets/images/google.png")}
                                        contentFit='contain'
                                        style={{ width: 32, height: 32 }}
                                    />
                                )
                            }
                        </Pressable>
                        {/* Apple btn */}
                        <Pressable
                            className='size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg shadow-white/10'
                            onPress={() => handleSocialAuth("oauth_apple")}
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel='Continue with Apple'
                        >
                            {
                                loadingStrategy === "oauth_apple" ? (
                                    <ActivityIndicator size={"small"} color={"#6C5CE7"} />
                                ) : (
                                    <Ionicons name="logo-apple" size={32} color="#A29BFE" />
                                )
                            }
                        </Pressable>
                        {/* Github btn */}
                        <Pressable className='size-20 rounded-2xl bg-white items-center justify-center active:scale-95 shadow-lg shadow-white/10'
                            onPress={() => handleSocialAuth("oauth_github")}
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            disabled={isLoading}
                            accessibilityRole='button'
                            accessibilityLabel='Continue with Github'
                        >
                            {
                                loadingStrategy === "oauth_github" ? (
                                    <ActivityIndicator size={"small"} color={"#6C5CE7"} />
                                ) : (
                                    <Ionicons name="logo-github" size={32} color="#A29BFE" />
                                )
                            }
                        </Pressable>
                    </View>
                    <Text className="text-foreground-subtle text-[11px] text-center leading-4">
                        By continuing, you agree to our{" "}
                        <Text className="text-primary-light">Terms of Service</Text> and{" "}
                        <Text className="text-primary-light">Privacy Policy</Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default AuthScreen;