import { useState } from "react";
import Row, { IRowProps } from "./Row";

export interface ICategoryProps {
  title: string;
  habits: Map<string, IRowProps>;
  addHabit: (categoryName: string, newHabit: string) => void;
}

// TODO add an input field and a button below the existing entries to allow adding a new habit
export default function Category(props: ICategoryProps) {
  const [newHabitTitle, setNewHabitTitle] = useState<string>("");

  const handleNewHabitSubmit = () => {
    console.log("submitting new row from Category.tsx", newHabitTitle);
    props.addHabit(props.title, newHabitTitle);
    setNewHabitTitle(""); // Clear the input field
  };

  return (
    <>
      <div className="category">
        <span className="category-title">{props.title}</span>
        {Array.from(props.habits.entries()).map(([title, habit]) => {
          return <Row {...habit} key={title} />;
        })}
        <div className="new-habit">
          <span>---- </span>
          <button className="c-btn" onClick={handleNewHabitSubmit}>
            +
          </button>
          <input
            className="new-habit-input input "
            type="text"
            placeholder="New Habit"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
