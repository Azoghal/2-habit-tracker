// a row of checkboxes
import  Category, { ICategoryProps }  from "./Category";


export interface ITableProps{
    categories: ICategoryProps[];
    onUpdateCheckbox: (key:number)=>void;
    currentDay: number;
    lockPast:boolean;
    lockFuture: boolean;
    title: string;
}

export default function Table(props:ITableProps) {

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