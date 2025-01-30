import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../firebase";

// export type CreateHabitsResult = IHabits & { id: string };
interface IEUser {
    name: string;
    id: string;
}

type IEUserWithCategories = IEUser & { categories: IECategory[] };

interface IECategory {
    path: string;
    name: string;
}

type IECategoryWithHabits = IECategory & { habits: IEHabit[] };

interface IEHabit {
    path: string;
    name: string;
}

type IEHabitWithActivities = IEHabit & { activities: IEActivity[] };

interface IEActivity {
    date: number;
    value: number;
}

type IDocActivities = Map<number, number>;

export class ExperimentsClient {
    private collectionName: string = "experimentsUsers";

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
    async getUserCategories(user_id: string): Promise<IECategory[]> {
        const categoriesCollection = collection(
            db,
            this.collectionName,
            user_id + "/categories",
        );
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

    async categoriesToCategoriesWithHabits(
        categories: IECategory[],
    ): Promise<IECategoryWithHabits[]> {
        const categoriesWithHabits = categories.map(
            async (category: IECategory) => {
                const habits = await this.getCategoryHabits(category.path);
                const habitWithActivity: IECategoryWithHabits = {
                    name: category.name,
                    path: category.path,
                    habits: habits,
                };
                return habitWithActivity;
            },
        );

        return Promise.all(categoriesWithHabits);
    }

    // get the habit names for a particular category
    // category_path is <user_id>/categories/<category_id>
    async getCategoryHabits(category_path: string): Promise<IEHabit[]> {
        const habitsCollection = collection(
            db,
            this.collectionName,
            category_path + "/habits",
        );
        const habits = await getDocs(habitsCollection).catch((e) => {
            console.log(e);
            throw e;
        });
        // TODO need to filter for ! _.exists()?
        return habits.docs.map((h) => {
            return {
                name: h.id,
                path: category_path + "/habits/" + h.id,
            };
        });
    }

    async habitsToHabitsWithActivities(
        habits: IEHabit[],
    ): Promise<IEHabitWithActivities[]> {
        const habitsWithActivities = habits.map(async (habit: IEHabit) => {
            const activities = await this.getHabitActivities(habit.path);
            const habitWithActivity: IEHabitWithActivities = {
                name: habit.name,
                path: habit.path,
                activities: activities,
            };
            return habitWithActivity;
        });

        return Promise.all(habitsWithActivities);
    }

    //habit_path is fully qualified to get a single activity
    async getHabitActivities(habit_path: string): Promise<IEActivity[]> {
        const habitRef = doc(db, this.collectionName, habit_path);
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
        const userDocRef = doc(db, this.collectionName, user_id);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (!docSnap.exists()) {
            throw "user doc does not exist";
        }

        const categories: IECategory[] = await this.getUserCategories(user_id);
        console.log("categories", categories);

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
