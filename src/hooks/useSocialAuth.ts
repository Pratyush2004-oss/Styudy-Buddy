import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {

    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple" | "oauth_github") => {
        if (loadingStrategy) return // guard againt concurrent flows
        setLoadingStrategy(strategy);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl: AuthSession.makeRedirectUri({ path: "sso-callback" }),
            });
            if (!createdSessionId || !setActive) {
                const provider = strategy === "oauth_google" ? "Google" : strategy === "oauth_apple" ? "Apple" : "Github";
                Alert.alert("Sign-in incomplete", `Unable to sign in with ${provider}. Please try again later.`);
                return;
            };
            await setActive({ session: createdSessionId });
            router.replace("/");
        } catch (error) {
            console.log("Error in social auth: ", error);
            const provider = strategy === "oauth_google" ? "Google" : strategy === "oauth_apple" ? "Apple" : "Github";
            Alert.alert("Error signing in", `Unable to sign in with ${provider}. Please try again later.`);
        }
        finally {
            setLoadingStrategy(null);
        }
    }
    return {
        loadingStrategy,
        handleSocialAuth
    }
}

export default useSocialAuth;