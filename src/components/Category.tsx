import { useMemo, useState } from "react";
import Row, { IHabitProps } from "./Row";
import { IHabit } from "../types/habits";
import { CheckboxStateFromInt, ICheckboxProps } from "./Checkbox";

export interface ICategoryProps {
    title: string;
    habits: IHabit[];
    addHabit: (newHabit: string) => void;
    changeValue: (habit: string, date: number, value: number) => void;
}

// TODO add an input field and a button below the existing entries to allow adding a new habit
export default function Category(props: ICategoryProps) {
    const [newHabitTitle, setNewHabitTitle] = useState<string>("");

    const handleNewHabitSubmit = () => {
        console.log("submitting new row from Category.tsx", newHabitTitle);
        props.addHabit(newHabitTitle);
        setNewHabitTitle(""); // Clear the input field
    };

    const propifiedHabits = useMemo(() => {
        return props.habits.map((h) => {
            const checkboxes = h.activities.map((a) => {
                const checkbox: ICheckboxProps = {
                    ...a,
                    state: CheckboxStateFromInt(a.value),
                    locked: false, // TODO
                    onClick: () => {
                        props.changeValue(h.title, a.date, (a.value + 1) % 3);
                    },
                };
                return checkbox;
            });
            const proppedHabits: IHabitProps = {
                ...h,
                activities: checkboxes,
            };
            return proppedHabits;
        });
    }, [props]);

    return (
        <>
            <div className="category">
                <span className="category-title">{props.title}</span>
                {propifiedHabits.map((habit) => {
                    return <Row {...habit} key={habit.title} />;
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
