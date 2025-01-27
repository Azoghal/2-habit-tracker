import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../firebase";
import { IUser } from "./users";

// export type CreateHabitsResult = IHabits & { id: string };
interface IEUser {
    name: string;
    id: string;
}

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

    async getFullUserDoc(user_id: string): Promise<void> {
        const userDocRef = doc(db, this.collectionName, user_id);
        const docSnap = await getDoc(userDocRef).catch((e) => {
            console.log("failed to get user: ", e);
            throw "failed to get user" + e;
        });
        if (docSnap.exists()) {
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
                const subSubSnaps = await getDocs(aSubSubCollection).catch(
                    (e) => {
                        console.log(e);
                        throw e;
                    },
                );
                subSubSnaps.forEach(async (subSubSnap) => {
                    console.log(subSubSnap.id);
                    console.log(subSubSnap.data());
                });
            });
        } else {
            console.log("doc snap not exists");
        }
    }

    // async getUser
}

export function newExperiments(): ExperimentsClient {
    return new ExperimentsClient();
}
