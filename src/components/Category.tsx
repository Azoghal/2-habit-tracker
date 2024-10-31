import { ICategory } from "@/types/habits";
import Row from "./Row";


export default function Category(props: ICategory) {

    console.log("my section rows", props.habits.map((row)=>{return row.title}))

    // TODO styling
    return <>
        <div className="category">
            <span>{props.title}</span>
            {props.habits.map((habit)=>{
            return <Row {...habit}/>
        })}
        </div>
    </>
    
}