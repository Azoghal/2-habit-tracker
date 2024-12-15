// a row of checkboxes
import { useState } from "react";
import Category from "./Category";
import { ICategory } from "../types/habits";

export interface ITableProps {
    title: string;
    categories: ICategory[];
    lockPast: boolean;
    lockFuture: boolean;
    addCategory: (newCategory: string) => void;
    addHabit: (category: string, newHabit: string) => void;
    changeValue: (
        category: string,
        habit: string,
        date: number,
        value: number,
    ) => void;
}

export default function Table(props: ITableProps) {
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");

    const handleNewCategorySubmit = () => {
        props.addCategory(newCategoryTitle);
        setNewCategoryTitle(""); // Clear the input field
    };

    return (
        <div className="table">
            <span>{props.title}</span>
            {props.categories.map((category) => {
                return (
                    <Category
                        title={category.title}
                        habits={category.habits}
                        lockFuture={props.lockFuture}
                        lockPast={props.lockPast}
                        addHabit={(habitName: string) => {
                            props.addHabit(category.title, habitName);
                        }}
                        changeValue={(
                            habit: string,
                            date: number,
                            value: number,
                        ) => {
                            props.changeValue(
                                category.title,
                                habit,
                                date,
                                value,
                            );
                        }}
                        key={category.title}
                    />
                );
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
