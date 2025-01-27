import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../firebase";

// export type CreateHabitsResult = IHabits & { id: string };
interface IEUser {
    name: string;
    id: string;
}

// interface IECategory {
//     name: string;
// }

// interface IEHabit {
//     name: string;
// }

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
            name: docSnap.data().name ?? "Unkown",
            id: docSnap.id,
        };
        return user;
    }

    // TODO actually a promise of categories -
    async getUserCategories(user_id: string): Promise<string[]> {
        const categoriesCollection = collection(
            db,
            this.collectionName,
            user_id + "/categories",
        );
        const categories = await getDocs(categoriesCollection).catch((e) => {
            console.log(e);
            throw e;
        });

        // let categoriesList: string[] = [];
        // categories.forEach((c) => {
        //     if (c.exists()) {
        //         categoriesList = categoriesList.concat(c.id);
        //     } else {
        //         categoriesList = categoriesList.concat("unknown");
        //     }
        // });

        // return categoriesList;

        return categories.docs.map((c) => {
            return c.id;
        });
    }

    // get the habit names for a particular category
    // category_path is <user_id>/categories/<category_id>
    async getCategoryHabits(category_path: string): Promise<string[]> {
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
            return h.id;
        });
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
        console.log(dataa);
        const activities: IDocActivities = dataa.activities;
        console.log(activities);

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

    async getFullUserDoc2(user_id: string): Promise<void> {
        const userDocRef = doc(db, this.collectionName, user_id);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (!docSnap.exists()) {
            throw "user doc does not exist";
        }

        const categoryNames: string[] = await this.getUserCategories(user_id);
        console.log("categories", categoryNames);

        categoryNames.forEach(async (categoryName: string) => {
            const habitNames = await this.getCategoryHabits(
                `${user_id}/categories/${categoryName}`,
            );
            console.log("habits", habitNames);

            habitNames.forEach(async (habitName: string) => {
                const activities = await this.getHabitActivities(
                    `${user_id}/categories/${categoryName}/habits/${habitName}`,
                );
                console.log("activities", activities);
            });
        });
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
