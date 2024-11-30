// Provides a session for firebase authenticated users
import { useState, useEffect, PropsWithChildren } from "react";
import { onAuthStateChanged, User } from "@firebase/auth";
import { UserAuthContext } from "./SessionHelpers";
import { auth } from "../firebase";

// Context provider component
export function UserAuthProvider(props: PropsWithChildren<object>) {
    // TODO move this to a session context provider?
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user is logged in");
                setUser(user);
            } else {
                //   navigate("/")
                console.log("user is not logged in");
            }

            return () => unsubscribe();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserAuthContext.Provider value={user}>
            {user ? (
                props.children
            ) : (
                <p>
                    You are not authenticated. Please <a href="/">Log in</a>.
                </p>
            )}
        </UserAuthContext.Provider>
    );
}
