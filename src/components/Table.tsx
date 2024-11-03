// a row of checkboxes
import { IHabits } from "@/types/habits";
import  Category, { ICategoryProps }  from "./Category";


export interface ITableProps {
    title: string,
    categories: ICategoryProps[]
}

export default function Table(props:ITableProps) {

    console.log("my table sections", props.categories.map((category)=>{return category.title}))

    return <>
        <div className="table">
            <span>{props.title}</span>
            {props.categories.map((category)=>{
            return <Category {...category} key={category.title}/>  
        })}
        </div>
    </>
}