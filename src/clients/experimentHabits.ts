import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { P_CATEGORIES, P_EXPERIMENTS_USERS, P_HABITS } from "./schema";

// export type CreateHabitsResult = IHabits & { id: string };
interface IEUser {
    name: string;
    id: string;
}

// type IEUserWithCategories = IEUser & { categories: IECategory[] };

export interface IECategory {
    path: string;
    name: string;
}

export interface IEHabit {
    path: string;
    name: string;
}

export interface IEActivity {
    date: number;
    value: number;
}

type IDocActivities = Map<number, number>;

export class ExperimentsClient {
    private collectionName: string = P_EXPERIMENTS_USERS;

    async getUserDoc(userId: string): Promise<IEUser> {
        const userDocRef = doc(db, this.collectionName, userId);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (!docSnap.exists()) {
            throw "user doc does not exist";
        }
        const user: IEUser = {
            id: docSnap.id,
            name: docSnap.data().name ?? "Unknown",
        };
        return user;
    }

    // TODO actually a promise of categories -
    async getUserCategories(userPath: string): Promise<IECategory[]> {
        const categoriesCollection = collection(db, userPath, P_CATEGORIES);
        const categories = await getDocs(categoriesCollection).catch((e) => {
            console.log(e);
            throw e;
        });

        return categories.docs.map((c) => {
            return {
                path: "/categories/" + c.id,
                name: c.id,
            };
        });
    }

    async addCategory(
        userPath: string,
        categoryName: string,
    ): Promise<IECategory> {
        const docRef = doc(db, userPath, P_CATEGORIES, categoryName);

        await setDoc(docRef, {}).catch((e) => {
            throw "failed to create new category " + categoryName + e;
        });

        const madeCategory: IECategory = {
            name: categoryName,
            path: docRef.path,
        };
        return madeCategory;
    }

    // get the habit names for a particular category
    // category_path is <user_id>/categories/<category_id>
    async getCategoryHabits(categoryPath: string): Promise<IEHabit[]> {
        const habitsCollection = collection(db, categoryPath, P_HABITS);
        const habits = await getDocs(habitsCollection).catch((e) => {
            console.log(e);
            throw e;
        });
        // TODO need to filter for ! _.exists()?
        return habits.docs.map((h) => {
            return {
                name: h.id,
                path: categoryPath + "/" + P_HABITS + "/" + h.id,
            };
        });
    }

    async addCategoryHabit(
        categoryPath: string,
        habitName: string,
    ): Promise<IEHabit> {
        const docRef = doc(db, categoryPath, "habits", habitName);

        await setDoc(docRef, {}).catch((e) => {
            throw (
                "failed to create new habit in category" +
                categoryPath +
                " : " +
                e
            );
        });

        const madeHabit: IEHabit = {
            name: habitName,
            path: docRef.path,
        };
        return madeHabit;
    }

    //habit_path is fully qualified to get a single activity
    async getHabitActivities(habitPath: string): Promise<IEActivity[]> {
        const habitRef = doc(db, habitPath);
        const activitiesDoc = await getDoc(habitRef);
        if (!activitiesDoc.exists()) {
            throw "habit does not exist";
        }

        // TODO rip out into helper?
        const dataa = activitiesDoc.data();
        const activities: IDocActivities = dataa.activities;

        const activitesAsMap: Map<string, number> =
            activities == undefined
                ? new Map()
                : new Map(Object.entries(activities));

        return Array.from(activitesAsMap.entries()).map(([key, value]) => {
            const activity: IEActivity = {
                date: Number(key),
                value: value,
            };
            return activity;
        });
    }

    async setActivities(
        habitPath: string,
        date: number,
        value: number,
    ): Promise<IEActivity[]> {
        const habitRef = doc(db, habitPath);
        const activitiesDoc = await getDoc(habitRef);
        if (!activitiesDoc.exists) {
            throw "habit does not exist";
        }

        const data = activitiesDoc.data();
        if (data == undefined) {
            throw "habit has no data";
        }
        const activities: { [key: number]: number } = data.activities || {};

        activities[date] = value;

        const newDoc = { ...data, activities };
        await setDoc(habitRef, newDoc);

        return [];
    }

    // TODO think about doing some stuff like actually archiving to some other collection?
    async deleteHabit(habitPath: string): Promise<void> {
        const habitRef = doc(db, habitPath);
        return await deleteDoc(habitRef);
    }

    async deleteCategory(categoryPath: string): Promise<void> {
        // get, check it has no habits, delete
        return this.getCategoryHabits(categoryPath).then((habits) => {
            if (habits.length > 0) {
                throw "cannot delete category with habits";
            }
            const categoryRef = doc(db, categoryPath);
            return deleteDoc(categoryRef);
        });
    }

    // async getUser
}

export function newExperiments(): ExperimentsClient {
    return new ExperimentsClient();
}
