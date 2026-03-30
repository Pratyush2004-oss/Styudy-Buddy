import { useEffect, useState } from "react"
import type { StreamChat, UserResponse } from "stream-chat"
const useStreamUsers = (client: StreamChat, userId: string) => {

    const [users, setusers] = useState<UserResponse[]>([]);
    const [loading, setloading] = useState(true);

    // fetching users 
    const fetchUsers = async () => {
        setloading(true);
        try {
            // do not fetch myself and admins
            const response = await client.queryUsers(
                { id: { $nin: [userId] }, role: { $nin: ["admin"] } } as any,
                { last_active: -1 },
                { limit: 50 }
            );
            setusers(response.users);
        } catch (error) {
            console.log("Failed to fetch users: ", error);
            // TO DO: sentry logs & capture exception
        }
        finally {
            setloading(false);
        }
    }
    useEffect(() => {
        if(userId) fetchUsers();
    }, [client, userId]);
    return {
        loading,
        users
    }
}

export default useStreamUsers