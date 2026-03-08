import { useAuth, useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Pressable,
    StatusBar,
    Text,
    View,
} from 'react-native';

const SSOCallbackScreen = () => {
    const router = useRouter();
    const clerk = useClerk();
    const { isLoaded, isSignedIn } = useAuth();
    const pulse = useRef(new Animated.Value(0)).current;
    const [isCompletingAuth, setIsCompletingAuth] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        pulseAnimation.start();

        return () => {
            pulseAnimation.stop();
        };
    }, [pulse]);

    useEffect(() => {
        let isCancelled = false;

        const completeSSO = async () => {
            if (!isLoaded) return;

            if (isSignedIn) {
                router.replace('/');
                return;
            }

            try {
                await clerk.handleRedirectCallback(
                    {
                        signInFallbackRedirectUrl: '/',
                        signUpFallbackRedirectUrl: '/',
                    },
                    async (to) => {
                        if (isCancelled) return;
                        if (typeof to === 'string' && to.startsWith('/')) {
                            router.replace(to as any);
                            return;
                        }
                        router.replace('/');
                    }
                );
            } catch (error) {
                if (isCancelled) return;

                if (isSignedIn) {
                    router.replace('/');
                    return;
                }

                console.log('Error completing SSO callback:', error);
                setErrorMessage('We could not finish sign in. Please try again.');
            } finally {
                if (!isCancelled) {
                    setIsCompletingAuth(false);
                }
            }
        };

        completeSSO();

        return () => {
            isCancelled = true;
        };
    }, [clerk, isLoaded, isSignedIn, router]);

    const pulseScale = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.08],
    });

    const pulseOpacity = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    return (
        <View className="bg-background flex-1 items-center justify-center px-6">
            <StatusBar barStyle="light-content" />

            <View className="absolute inset-0">
                <LinearGradient
                    colors={['#0F0E17', '#1A1A2E', '#2D1B69', '#1A1A2E', '#0F0E17']}
                    locations={[0, 0.25, 0.5, 0.75, 1]}
                    style={{ height: '100%', width: '100%' }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            <View className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-primary/15" />
            <View className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent-secondary/10" />

            <View className="w-full max-w-[360px] rounded-3xl border border-primary/20 bg-surface/90 px-[22px] py-7">
                <View className="mb-4 size-14 rounded-2xl border border-primary/25 bg-primary/15 items-center justify-center">
                    <Ionicons name="lock-closed" size={24} color="#A29BFE" />
                </View>

                <Animated.View
                    className="mb-4 h-[52px] w-[52px] items-center justify-center rounded-full border border-primary/40 bg-primary/20"
                    style={[
                        {
                            transform: [{ scale: pulseScale }],
                            opacity: pulseOpacity,
                        },
                    ]}
                >
                    <ActivityIndicator size="small" color="#A29BFE" />
                </Animated.View>

                <Text className="mb-2 text-[27px] leading-8 text-foreground font-outfit-bold">Completing sign in</Text>
                <Text className="mb-[22px] text-[15px] leading-[21px] text-foreground-muted font-outfit">
                    We are securely verifying your SSO credentials and preparing your workspace.
                </Text>

                <View className="mb-[10px] flex-row items-center gap-[10px]">
                    <View className="h-2 w-2 rounded-full bg-accent-secondary" />
                    <Text className="text-sm text-foreground font-outfit-medium">Redirect received</Text>
                </View>
                <View className="mb-[10px] flex-row items-center gap-[10px]">
                    <ActivityIndicator size="small" color="#A29BFE" />
                    <Text className="text-sm text-foreground font-outfit-medium">
                        {isCompletingAuth ? 'Establishing session...' : 'Finalizing sign in...'}
                    </Text>
                </View>

                {errorMessage ? (
                    <View className="mt-2 rounded-xl border border-accent/25 bg-accent/10 p-3">
                        <Text className="text-xs text-accent font-outfit-medium">{errorMessage}</Text>
                        <Pressable
                            className="mt-3 self-start rounded-full border border-primary/30 bg-primary/15 px-3 py-1.5"
                            onPress={() => router.replace('/(auth)')}
                        >
                            <Text className="text-[11px] uppercase tracking-wide text-primary-light font-outfit-semibold">
                                Back to sign in
                            </Text>
                        </Pressable>
                    </View>
                ) : null}

                <View className="mt-4 flex-row items-center gap-2 rounded-full border border-border-light bg-surface-light px-3 py-2 self-start">
                    <Ionicons name="sparkles" size={13} color="#A29BFE" />
                    <Text className="text-[11px] uppercase tracking-wider text-foreground-subtle font-outfit-semibold">
                        Secure SSO handshake
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default SSOCallbackScreen;