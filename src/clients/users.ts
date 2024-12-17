import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../firebase";

// TODO whack all our models in here

export interface IUser {
    user_id: string;
    habits_id: string;
}

// Create separate client classes for each collection
class UserClient {
    private collectionName: string = "habitusers";

    // get a user by id. Throws if the user does not exist
    async getUser(id: string): Promise<IUser> {
        const userDocRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            console.log("user lookup id:", id);
            throw "user does not exist";
        }

        const data = { ...docSnap.data() };
        return {
            user_id: docSnap.id,
            habits_id: data.habits_id,
        } as IUser;
    }

    // Create a user. Throws if the user already eists
    async createUser(user: IUser): Promise<void> {
        const userDocRef = doc(db, this.collectionName, user.user_id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            throw "user already exists";
        }

        await setDoc(userDocRef, user);
    }
}

export function newUserClient(): UserClient {
    return new UserClient();
}
