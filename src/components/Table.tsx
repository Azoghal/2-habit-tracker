// a row of checkboxes

import Row, { IRowProps } from "./Row";
import { CheckboxInfo } from "@/pages";
import Section from "./Section";

interface Category{
    title: string,
    rows: IRowProps[]
}

interface ITableProps{
    sections: Category[];
    onUpdateCheckbox: (key:number)=>void;
    currentDay: number;
    lockPast:boolean;
    lockFuture: boolean;
    title: string;
}



export default function Table(props:ITableProps) {

    console.log("my table sections", props.sections.map((section)=>{return section.title}))

    return <>
        <div className="row">
            <span>{props.title}</span>
            {props.sections.map((section)=>{
            return <Section
                rows={section.rows}
            />
        })}
        </div>
    </>
}