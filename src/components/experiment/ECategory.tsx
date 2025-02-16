import { useCallback, useEffect, useState } from "react";
import ERow from "./ERow";
import { IEHabit, newExperiments } from "../../clients/experimentHabits";

export interface IECategoryProps {
    title: string;
    path: string;
    // habits: IHabit[];
    // TODO move the global table settings into a context?
    lockFuture: boolean;
    lockPast: boolean;
}

// function shouldLock(
//     today: number,
//     date: number,
//     lockFuture: boolean,
//     lockPast: boolean,
// ) {
//     return (date < today && lockPast) || (date > today && lockFuture);
// }

// TODO add an input field and a button below the existing entries to allow adding a new habit
export default function ECategory(props: IECategoryProps) {
    const [newHabitTitle, setNewHabitTitle] = useState<string>("");
    // const today = getTodayMidday();

    const [habits, setHabits] = useState<IEHabit[]>([]);

    const loadData = useCallback(() => {
        console.log("loadData ECategory: ", props.path);
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

    const addHabit = useCallback((newHabitName: string) => {
        console.log("unimplimented add habit", newHabitName);
    }, []);

    const handleNewHabitSubmit = () => {
        addHabit(newHabitTitle);
        setNewHabitTitle(""); // Clear the input field
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <>
            <div className="category">
                <span className="category-title">{props.title}</span>
                {habits.map((habit) => {
                    return (
                        <ERow
                            title={habit.name}
                            path={habit.path}
                            key={habit.name}
                            futureLocked={props.lockFuture}
                            pastLocked={props.lockPast}
                        />
                    );
                })}
                <div className="new-habit">
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
