import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { P_EXPERIMENTS_USERS } from "./schema";

// TODO whack all our models in here

export interface IUser {
    display_name: string; // TODO make mandatory
    user_id: string;
}

export interface CreateHabitsUserResult {
    user: IUser;
    // habits: ...
}

// Create separate client classes for each collection
export class UserClient {
    private collectionName: string = P_EXPERIMENTS_USERS;

    // get a user by id. Throws if the user does not exist
    async getUser(id: string): Promise<IUser> {
        const userDocRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            throw "user does not exist";
        }

        const data = { ...docSnap.data() };
        return {
            display_name: data.display_name ?? "Unknown",
            user_id: docSnap.id,
        } as IUser;
    }

    // Create a user. Throws if the user already exists
    async createUser(user: IUser): Promise<IUser> {
        const userDocRef = doc(db, this.collectionName, user.user_id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            throw "user already exists";
        }

        await setDoc(userDocRef, user);
        return user;
    }
}

export function newUserClient(): UserClient {
    return new UserClient();
}
