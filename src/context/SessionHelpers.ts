import { User } from "@firebase/auth";
import { createContext, useContext } from "react";

// Create the context
export const UserAuthContext = createContext<User | undefined>(undefined);

// Custom hook to use the context
export function useUserAuth() {
    return useContext(UserAuthContext);
}
