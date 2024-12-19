import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { IHabits } from "../types/habits";
import { IUser, newUserClient } from "./users";

export type CreateHabitsResult = IHabits & { id: string };

// Create separate client classes for each collection
export class HabitsClient {
    private collectionName: string = "habits";

    async getHabitsForUser(user_id: string): Promise<IHabits> {
        const theUser: IUser = await newUserClient()
            .getUser(user_id)
            .catch((e) => {
                throw "failed to get habits for user: failed to get user: " + e;
            });
        const theHabitsId = theUser.habits_id;
        return this.getHabits(theHabitsId);
    }

    // get a user by id. Throws if the user does not exist
    async getHabits(id: string): Promise<IHabits> {
        const habitsDocRef = doc(db, this.collectionName, id);
        const docSnap = await getDoc(habitsDocRef);

        if (!docSnap.exists()) {
            throw "user does not exist";
        }

        const data = { ...docSnap.data() };
        return {
            ...data,
        } as IHabits;
    }

    async createHabits(title: string): Promise<CreateHabitsResult> {
        const newHabits: IHabits = {
            title,
            categories: [],
        };
        const habitsCollection = collection(db, this.collectionName);
        const newDocRef = await addDoc(habitsCollection, newHabits).catch(
            (e) => {
                throw "failed to create new habits: " + e;
            },
        );
        return {
            id: newDocRef.id,
            ...newHabits,
        };
    }

    // TODO make this do some validation that we're not about to bork something
    async updateHabits(id: string, newHabits: IHabits): Promise<IHabits> {
        const habitsDoc = doc(db, this.collectionName, id);
        updateDoc(habitsDoc, { ...newHabits }).catch((e) => {
            throw "could not update habits: " + e;
        });
        return newHabits;
    }
}

export function newHabitsClient(): HabitsClient {
    return new HabitsClient();
}
