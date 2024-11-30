// import { useCallback, useMemo, useState } from "react";
// import { Recipe } from "../pages/Landing";

// interface IRecipeFormProps {
//     createRecipe(recipe: Recipe): void;
// }

// function RecipeForm(props: IRecipeFormProps) {
//     const [recipeTitle, setRecipeTitle] = useState<string>();
//     const [recipePrepTime, setRecipePrepTime] = useState<number>();
//     const [recipeCookTime, setRecipeCookTIme] = useState<number>(); // mins

//     const recipeSubmitEnabled = useMemo(() => {
//         return (
//             recipeTitle != undefined &&
//             recipeTitle != "" &&
//             recipeCookTime != undefined &&
//             recipePrepTime != undefined
//         );
//     }, [recipeCookTime, recipePrepTime, recipeTitle]);

//     const submitNewRecipe = useCallback(() => {
//         const newRecipe: Recipe = {
//             title: recipeTitle ?? "",
//             cooking_time_mins: recipeCookTime ?? 0,
//             prep_time: recipePrepTime ?? 0,
//         };
//         props.createRecipe(newRecipe);
//     }, [props, recipeCookTime, recipePrepTime, recipeTitle]);

//     return (
//         <div className="card">
//             <h1>Add Recipe</h1>
//             <div className="recipe-form">
//                 <div className="form-group">
//                     <label htmlFor="recipe-name">Recipe name:</label>
//                     <input
//                         type="text"
//                         id="recipe-name"
//                         placeholder="Recipe Name"
//                         onChange={(event) => setRecipeTitle(event.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="prep-time">Prep time: </label>
//                     <input
//                         type="number"
//                         id="prep-time"
//                         onChange={(event) =>
//                             setRecipePrepTime(event.target.valueAsNumber)
//                         }
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="cooking-time">Cooking time: </label>
//                     <input
//                         type="number"
//                         id="cooking-time"
//                         onChange={(event) =>
//                             setRecipeCookTIme(event.target.valueAsNumber)
//                         }
//                     />
//                 </div>
//                 <button
//                     disabled={!recipeSubmitEnabled}
//                     onClick={submitNewRecipe}
//                 >
//                     Submit
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default RecipeForm;
