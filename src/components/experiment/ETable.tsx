// a row of checkboxes
import { useCallback, useEffect, useState } from "react";
import ECategory from "./ECategory";
import { ICategory } from "../../types/habits";

export interface IETableProps {
    title: string;
    path: string;
    lockPast: boolean;
    lockFuture: boolean;
}

export default function ETable(props: IETableProps) {
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);

    const loadData = useCallback(() => {
        // TODO set Categories
        setCategories([]);
    }, []);

    const addCategory = useCallback((categoryName: string) => {
        console.log("unimplimented add category", categoryName);
    }, []);

    const handleNewCategorySubmit = () => {
        addCategory(newCategoryTitle);
        setNewCategoryTitle(""); // Clear the input field
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="table">
            <span>{props.title}</span>
            {categories.map((category) => {
                return (
                    <ECategory
                        title={category.title}
                        path={props.path + "/" + category.title}
                        lockFuture={props.lockFuture}
                        lockPast={props.lockPast}
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
