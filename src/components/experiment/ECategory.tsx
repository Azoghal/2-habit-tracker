import { useCallback, useEffect, useState } from "react";
import ERow from "./ERow";
import { IEHabit, newExperiments } from "../../clients/experimentHabits";
import BinButton from "../BinButton";

export interface IECategoryProps {
    title: string;
    path: string;
    // habits: IHabit[];
    dates: number[];
    allowDelete: boolean;
    onDelete(): void;
}

export default function ECategory(props: IECategoryProps) {
    const [newHabitTitle, setNewHabitTitle] = useState<string>("");
    // const today = getTodayMidday();

    const [habits, setHabits] = useState<IEHabit[]>([]);

    const loadData = useCallback(() => {
        const experimentClient = newExperiments();
        experimentClient
            .getCategoryHabits(props.path)
            .then((habits: IEHabit[]) => {
                setHabits(habits);
            })
            .catch((e) => {
                console.log("failed to set habits in ECategory:", e);
            });
    }, [props.path]);

    const addHabit = useCallback(
        (newHabitName: string) => {
            newExperiments()
                .addCategoryHabit(props.path, newHabitName)
                .then((newHabit: IEHabit) => {
                    // set the habits with the one we got back, then reload for sanity
                    setHabits((oldHabits: IEHabit[]) => {
                        return oldHabits.concat(newHabit);
                    });
                    loadData();
                })
                .catch((e) => {
                    console.log("failed to add new habit: ", e);
                });
        },
        [loadData, props.path],
    );

    const handleNewHabitSubmit = () => {
        addHabit(newHabitTitle);
        setNewHabitTitle(""); // Clear the input field
    };

    const handleHabitDelete = useCallback((path: string) => {
        newExperiments()
            .deleteHabit(path)
            .catch((e) => {
                console.log("failed to delete habit", e);
            })
            .finally(() => {
                loadData();
            });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            <tr>
                <td className="category-title">
                    {props.allowDelete && habits.length == 0 && (
                        <BinButton onClick={props.onDelete} />
                    )}
                    {props.title}
                </td>
            </tr>
            {habits.map((habit) => {
                return (
                    <ERow
                        title={habit.name}
                        path={habit.path}
                        key={habit.name}
                        dates={props.dates}
                        allowDelete={props.allowDelete}
                        onDelete={() => handleHabitDelete(habit.path)}
                    />
                );
            })}
            <tr className="new-habit">
                <td>
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
                </td>
            </tr>
        </>
    );
}
