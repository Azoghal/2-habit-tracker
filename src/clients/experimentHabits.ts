import { collection, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { P_CATEGORIES, P_EXPERIMENTS_USERS, P_HABITS } from "./schema";

// export type CreateHabitsResult = IHabits & { id: string };
interface IEUser {
    name: string;
    id: string;
}

type IEUserWithCategories = IEUser & { categories: IECategory[] };

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

    async getUserDoc(user_id: string): Promise<IEUser> {
        const userDocRef = doc(db, this.collectionName, user_id);
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
        console.log(userPath);
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
        user_path: string,
        category_name: string,
    ): Promise<IECategory> {
        const docRef = doc(db, user_path, P_CATEGORIES, category_name);

        await setDoc(docRef, {}).catch((e) => {
            throw "failed to create new category " + category_name + e;
        });

        const madeCategory: IECategory = {
            name: category_name,
            path: docRef.path,
        };
        return madeCategory;
    }

    // get the habit names for a particular category
    // category_path is <user_id>/categories/<category_id>
    async getCategoryHabits(category_path: string): Promise<IEHabit[]> {
        const habitsCollection = collection(db, category_path, P_HABITS);
        const habits = await getDocs(habitsCollection).catch((e) => {
            console.log(e);
            throw e;
        });
        // TODO need to filter for ! _.exists()?
        return habits.docs.map((h) => {
            return {
                name: h.id,
                path: category_path + "/" + P_HABITS + "/" + h.id,
            };
        });
    }

    async addCategoryHabit(
        category_path: string,
        habit_name: string,
    ): Promise<IEHabit> {
        const docRef = doc(db, category_path, "habits", habit_name);

        await setDoc(docRef, {}).catch((e) => {
            throw (
                "failed to create new habit in category" +
                category_path +
                " : " +
                e
            );
        });

        const madeHabit: IEHabit = {
            name: habit_name,
            path: docRef.path,
        };
        return madeHabit;
    }

    //habit_path is fully qualified to get a single activity
    async getHabitActivities(habit_path: string): Promise<IEActivity[]> {
        const habitRef = doc(db, habit_path);
        const activitiesDoc = await getDoc(habitRef);
        if (!activitiesDoc.exists()) {
            throw "activities does not exist";
        }

        // TODO rip out into helper?
        const dataa = activitiesDoc.data();
        const activities: IDocActivities = dataa.activities;
        const activitesAsMap: Map<string, number> = new Map(
            Object.entries(activities),
        );

        return Array.from(activitesAsMap.entries()).map(([key, value]) => {
            const activity: IEActivity = {
                date: Number(key),
                value: value,
            };
            return activity;
        });
    }

    async getFullUserDoc2(user_id: string): Promise<IEUserWithCategories> {
        const userPath = this.collectionName + "/" + user_id;
        const userDocRef = doc(db, userPath);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (!docSnap.exists()) {
            throw "user doc does not exist";
        }

        const categories: IECategory[] = await this.getUserCategories(userPath);

        const res: IEUserWithCategories = {
            id: user_id,
            name: docSnap.data().name,
            categories: categories,
        };

        return res;
    }

    async getFullUserDoc(user_id: string): Promise<void> {
        const userDocRef = doc(db, this.collectionName, user_id);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (!docSnap.exists()) {
            throw "user doc does not exist";
        }

        console.log("data before stuff:", docSnap.data());

        const aSubCollection = collection(
            db,
            this.collectionName,
            user_id + "/categories",
        );
        const subSnaps = await getDocs(aSubCollection).catch((e) => {
            console.log(e);
            throw e;
        });

        console.log(subSnaps);
        subSnaps.forEach(async (subSnap) => {
            console.log(subSnap.id);
            const aSubSubCollection = collection(
                db,
                this.collectionName,
                user_id + "/categories/" + subSnap.id + "/habits",
            );
            const subSubSnaps = await getDocs(aSubSubCollection).catch((e) => {
                console.log(e);
                throw e;
            });
            subSubSnaps.forEach(async (subSubSnap) => {
                console.log(subSubSnap.id);
                console.log(subSubSnap.data());
            });
        });
    }

    // async getUser
}

export function newExperiments(): ExperimentsClient {
    return new ExperimentsClient();
}
