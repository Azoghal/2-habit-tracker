import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { CreateHabitsResult, newHabitsClient } from "./habits";
import { IHabits } from "../types/habits";

// TODO whack all our models in here

export interface IUser {
    user_id: string;
    habits_id: string;
}

export interface CreateHabitsUserResult {
    user: IUser;
    habits: IHabits;
}

// Create separate client classes for each collection
export class UserClient {
    private collectionName: string = "habitusers";

    // get a user by id. Throws if the user does not exist
    async getUser(id: string): Promise<IUser> {
        const userDocRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            throw "user does not exist";
        }

        const data = { ...docSnap.data() };
        return {
            user_id: docSnap.id,
            habits_id: data.habits_id,
        } as IUser;
    }

    // Create a user. Throws if the user already eists
    async createUser(user: IUser): Promise<IUser> {
        const userDocRef = doc(db, this.collectionName, user.user_id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            throw "user already exists";
        }

        await setDoc(userDocRef, user);
        return user;
    }

    // if the user id does not already exist, create a habits doc, a habitsuser doc associating it
    async createHabitsUser(user_id: string): Promise<CreateHabitsUserResult> {
        const habitsRes: CreateHabitsResult =
            await newHabitsClient().createHabits("Your habits");
        const user: IUser = await this.createUser({
            user_id,
            habits_id: habitsRes.id,
        });

        return {
            user: user,
            habits: habitsRes,
        };
    }
}

export function newUserClient(): UserClient {
    return new UserClient();
}
