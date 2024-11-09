import Row, { IRowProps } from "./Row";

export interface ICategoryProps {
  title: string;
  habits: Map<string, IRowProps>;
}

export default function Category(props: ICategoryProps) {
  // TODO styling
  return (
    <>
      <div className="category">
        <span>{props.title}</span>
        {Array.from(props.habits.entries()).map(([title, habit]) => {
          return <Row {...habit} key={title} />;
        })}
      </div>
    </>
  );
}
