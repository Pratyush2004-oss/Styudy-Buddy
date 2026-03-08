import { studyBuddyTheme } from '@/lib/theme';
import { useUser } from '@clerk/clerk-expo';
import type { UserResource } from '@clerk/types';
import * as Sentry from '@sentry/react-native';
import React, { useEffect, useRef } from 'react';
import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import { FullScreenLoader } from './FullScreenLoader';

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY as string;
const syncUserToStream = async (user: UserResource) => {
    try {
        await fetch("api/sync-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                name: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                image: user.imageUrl
            })
        })
    } catch (error) {
        console.log("Failed to sync user to Stream: ", error)

    }
}

// full logic of building the chat client
const ChatClient = ({ children, user }: { children: React.ReactNode, user: UserResource }) => {
    const syncedRef = useRef(false);
    useEffect(() => {
        if (!syncedRef.current) {
            syncedRef.current = true;
            syncUserToStream(user);
        }
    }, [user]);

    // providing the chat token
    const tokenProvider = async () => {
        try {
            const response = await fetch("/api/token", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ userId: user.id })
            });
            const data = await response.json();
            return data.token;
        } catch (error) {
            Sentry.logger.error("Failed to get Stream chat token", {
                userId: user.id,
                message: error instanceof Error ? error.message : String(error),
            });
            Sentry.captureException(error, { extra: { userId: user.id, hook: "tokenProvider" } });
        }
    }

    // creating the chat-client
    const chatClient = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: tokenProvider,
        userData: {
            id: user.id,
            name: user.fullName ?? user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
            image: user.imageUrl
        }
    });

    if (!chatClient) return <FullScreenLoader message="Loading Chat..." />
    return (
        <OverlayProvider value={{ style: studyBuddyTheme }} >
            <Chat client={chatClient} style={studyBuddyTheme}>{children}</Chat>
        </OverlayProvider>
    )
}

const ChatWrapper = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <FullScreenLoader message="Loading Chat..." />

    // if user is not signed in - render children directly (auth screens)
    if (!user) return <>{children}</>

    return (
        <ChatClient user={user}>{children}</ChatClient>
    )
}

export default ChatWrapper