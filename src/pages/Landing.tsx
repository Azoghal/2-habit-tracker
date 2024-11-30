import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import { useUserAuth } from "../context/SessionHelpers";
import RecipeForm from "../components/RecipeForm";

export interface Recipe {
    cooking_time_mins: number;
    prep_time: number;
    title: string;
    id?: string;
    starred?: boolean;
}

function Landing(): JSX.Element {
    // const navigate = useNavigate();
    const user = useUserAuth();

    // TODO fetch example
    const recipesCollection = collection(db, "recipes");
    const [recipes, setRecipes] = useState<Recipe[]>();

    const loadData = useCallback(() => {
        // TODO make sure this can't run
        getDocs(recipesCollection).then((rs) => {
            const docs = rs.docs;
            const rss: Recipe[] = docs.map((r) => {
                const data = r.data();
                const recipe: Recipe = {
                    cooking_time_mins: data.cooking_time_mins,
                    prep_time: data.prep_time,
                    title: data.title,
                    id: r.id,
                };
                return recipe;
            });
            setRecipes(rss);
        });
    }, [recipesCollection, setRecipes]);

    useEffect(() => {
        loadData();
    });

    const createRecipe = useCallback(
        (recipe: Recipe) => {
            addDoc(recipesCollection, recipe).finally(() => {
                loadData();
            });
        },
        [loadData, recipesCollection],
    );

    return (
        <>
            <h1>Firebase Demo - Recipes</h1>
            <h2>{user?.email}</h2>
            <div className="card">
                Stored Recipes:{" "}
                {recipes?.map((r) => {
                    return <p key={r.id}>{r.title}</p>;
                })}
            </div>
            <RecipeForm createRecipe={createRecipe} />
        </>
    );
}

export default Landing;
