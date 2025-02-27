// a row of checkboxes
import { useCallback, useEffect, useMemo, useState } from "react";
import ECategory from "./ECategory";
import { IECategory, newExperiments } from "../../clients/experimentHabits";
import { DaysOfWeekShort, getDayOfWeek } from "./helpers";
import { useTableSettings } from "../../context/TableSettings";
import LockButton from "../LockButton";

export interface IETableProps {
    title: string;
    path: string;
    dates: number[];
}

export default function ETable(props: IETableProps) {
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
    const [categories, setCategories] = useState<IECategory[]>([]);
    const { today, lockHeaders, setLockHeaders } = useTableSettings();

    const calculateHeaders = useMemo(() => {
        const headers: JSX.Element[] = [];
        props.dates.forEach((t) => {
            const dow = getDayOfWeek(t);
            if (dow == 0) {
                headers.push(<th key={"wb" + t}> | </th>); // Add a blank column to indicate week beginning
            }

            headers.push(
                <th
                    className={`${t == today ? "c-th-today" : "c-th-some-day"}`}
                    key={t}
                >
                    {DaysOfWeekShort[dow]}
                </th>,
            );
        });
        return headers;
    }, [props.dates, today]);

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

    const handleDeleteCategory = useCallback((path: string) => {
        newExperiments()
            .deleteCategory(path)
            .catch((e) => {
                console.log("failed to delete category", e);
            })
            .finally(() => {
                loadData();
            });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <table className="c-table">
            <thead>
                <tr>
                    <th className="c-table-title">{props.title}</th>
                </tr>
                <tr>
                    <th className="c-table-subtitle">
                        <LockButton
                            locked={lockHeaders}
                            onToggle={() => setLockHeaders(!lockHeaders)}
                        />
                        &nbsp;
                    </th>
                    {calculateHeaders}
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => {
                    return (
                        <ECategory
                            title={category.name}
                            path={props.path + category.path}
                            key={category.name}
                            dates={props.dates}
                            allowDelete={!lockHeaders}
                            onDelete={() => {
                                handleDeleteCategory(
                                    props.path + category.path,
                                );
                            }}
                        />
                    );
                })}
                <tr>
                    <td>
                        <button
                            className="c-btn"
                            onClick={handleNewCategorySubmit}
                        >
                            +
                        </button>
                        <input
                            className="input new-category-input"
                            type="text"
                            placeholder="New Category"
                            value={newCategoryTitle}
                            onChange={(e) =>
                                setNewCategoryTitle(e.target.value)
                            }
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
