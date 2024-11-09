// a row of checkboxes
import Category, { ICategoryProps } from "./Category";

export interface ITableProps {
  title: string;
  categories: Map<string, ICategoryProps>;
}

export default function Table(props: ITableProps) {
  return (
    <div className="table">
      <span>{props.title}</span>
      {Array.from(props.categories.entries()).map(([title, category]) => {
        return <Category {...category} key={title} />;
      })}
    </div>
  );
}
