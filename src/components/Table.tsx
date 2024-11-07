// a row of checkboxes
import Category, { ICategoryProps } from "./Category";

export interface ITableProps {
  title: string;
  categories: ICategoryProps[];
}

export default function Table(props: ITableProps) {
  return (
    <>
      <div className="table">
        <span>{props.title}</span>
        {props.categories.map((category) => {
          return <Category {...category} key={category.title} />;
        })}
      </div>
    </>
  );
}
