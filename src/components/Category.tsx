import Row, { IRowProps } from "./Row";

export interface ICategoryProps{
    title: string,
    habits: IRowProps[],
}

export default function Category(props: ICategoryProps) {

    console.log("my section rows", props.habits.map((row)=>{return row.title}))

    // TODO styling
    return <>
        <div className="category">
            <span>{props.title}</span>
            {props.habits.map((habit)=>{
            return <Row {...habit} key={habit.title}/>
        })}
        </div>
    </>
    
}