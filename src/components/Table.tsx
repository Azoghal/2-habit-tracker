// a row of checkboxes
import { IHabits } from "@/types/habits";
import  Category  from "./Category";


export default function Table(props:IHabits) {

    console.log("my table sections", props.categories.map((category)=>{return category.title}))

    return <>
        <div className="table">
            <span>{props.title}</span>
            {props.categories.map((category)=>{
            return <Category {...category}/>  
        })}
        </div>
    </>
}