import React, { useState } from "react";
import type { Channel, LocalMessage } from "stream-chat";

type AppContextType = {
    channel: Channel | null;
    setChannel: (channel: Channel) => void;
    thread: LocalMessage | null;
    setThread: (thread: LocalMessage) => void;
}

export const AppContext = React.createContext<AppContextType>({
    channel: null,
    setChannel: (channel) => { },
    thread: null,
    setThread: (thread) => { },
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [channel, setChannel] = useState<null | Channel>(null);
    const [thread, setThread] = useState<null | LocalMessage>(null);

    return (
        <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => React.useContext(AppContext);