// a row of checkboxes
import { useCallback, useEffect, useState } from "react";
import ECategory from "./ECategory";
import { IECategory, newExperiments } from "../../clients/experimentHabits";

export interface IETableProps {
    title: string;
    path: string;
    lockPast: boolean;
    lockFuture: boolean;
}

export default function ETable(props: IETableProps) {
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
    const [categories, setCategories] = useState<IECategory[]>([]);

    const loadData = useCallback(() => {
        // TODO set Categories
        const experimentClient = newExperiments();
        experimentClient
            .getUserCategories(props.path)
            .then((resp: IECategory[]) => {
                setCategories(resp);
            })
            .catch((e) => {
                console.log("failed to load categories in ETable", e);
            });
    }, [props.path]);

    const addCategory = useCallback(
        (categoryName: string) => {
            newExperiments()
                .addCategory(props.path, categoryName)
                .then((newCategory: IECategory) => {
                    setCategories((oldCategories: IECategory[]) => {
                        return oldCategories.concat(newCategory);
                    });
                    loadData();
                })
                .catch((e) => {
                    console.log("failed to add category: ", e);
                });
        },
        [loadData, props.path],
    );

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
                        title={category.name}
                        path={props.path + category.path}
                        lockFuture={props.lockFuture}
                        lockPast={props.lockPast}
                        key={category.name}
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
