// a row of checkboxes
import { useState } from "react";
import Category, { ICategoryProps } from "./Category";

export interface ITableProps {
  title: string;
  categories: Map<string, ICategoryProps>;
  addCategory: (newCategory: string) => void;
}

export default function Table(props: ITableProps) {
  const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");

  const handleNewCategorySubmit = () => {
    console.log("adding new habit, ", newCategoryTitle);
    props.addCategory(newCategoryTitle);
    setNewCategoryTitle(""); // Clear the input field
  };

  return (
    <div className="table">
      <span>{props.title}</span>
      {Array.from(props.categories.entries()).map(([title, category]) => {
        return <Category {...category} key={title} />;
      })}
      <div className="new-category">
        <button className="c-btn" onClick={handleNewCategorySubmit}>
          +
        </button>
        <input
          className="input new-category-input"
          type="text"
          placeholder="New Category"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
        />
      </div>
    </div>
  );
}
