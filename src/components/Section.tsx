import Row, { IRowProps } from "./Row";

interface ISectionProps {
    rows: IRowProps[]
}

export default function Section(props: ISectionProps) {


    console.log("my section rows", props.rows.map((row)=>{return row.title}))

    // TODO styling
    return <>
        {props.rows.map((row)=>{
            <Row {...row}/>
        })}
    </>
}