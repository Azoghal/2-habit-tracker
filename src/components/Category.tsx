import Row, { IRowProps } from "./Row";


export interface ICategoryProps{
    title: string,
    rows: IRowProps[]
}

export default function Category(props: ICategoryProps) {

    console.log("my section rows", props.rows.map((row)=>{return row.title}))

    // TODO styling
    return <>
        <div className="category">
            <span>{props.title}</span>
            {props.rows.map((row)=>{
            return <Row {...row}/>
        })}
        </div>
    </>
    
}