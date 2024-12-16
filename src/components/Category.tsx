import { useMemo, useState } from "react";
import Row, { IHabitProps } from "./Row";
import { IActivity, IHabit } from "../types/habits";
import { CheckboxStateFromInt, ICheckboxProps } from "./Checkbox";
import { DAY_SECONDS, getTodayMidday } from "./Habits";

export interface ICategoryProps {
    title: string;
    habits: IHabit[];
    lockFuture: boolean;
    lockPast: boolean;
    addHabit: (newHabit: string) => void;
    changeValue: (habit: string, date: number, value: number) => void;
}

function shouldLock(
    today: number,
    date: number,
    lockFuture: boolean,
    lockPast: boolean,
) {
    return (date < today && lockPast) || (date > today && lockFuture);
}

// TODO add an input field and a button below the existing entries to allow adding a new habit
export default function Category(props: ICategoryProps) {
    const [newHabitTitle, setNewHabitTitle] = useState<string>("");
    const today = getTodayMidday();

    const handleNewHabitSubmit = () => {
        props.addHabit(newHabitTitle);
        setNewHabitTitle(""); // Clear the input field
    };

    const propifiedHabits = useMemo(() => {
        return props.habits.map((h) => {
            // todo here we need to:
            // 1. have filtered out dates that aren't in the current range
            // 2. have filled in dates that aren't in the current list

            const hardCodedEarliest = today - 7 * DAY_SECONDS;
            const hardCodedLatest = today + 7 * DAY_SECONDS;
            const filtered = h.activities.filter((a) => {
                return a.date >= hardCodedEarliest && a.date <= hardCodedLatest;
            });
            const datesWeHave = h.activities.map((a) => {
                return a.date;
            });

            // TODO actually have all the days
            // const datesWeNeedToAdd = [
            //     today - DAY_SECONDS,
            //     today,
            //     today + DAY_SECONDS,
            // ];

            // TODO make sure this actually does what we want.
            const datesWeNeed = Array.from(
                { length: 15 },
                (_, i) => (i - 7) * DAY_SECONDS + today,
            );

            // filter out the dates that don't appear
            const datesToAdd = datesWeNeed.filter((d) => {
                return !datesWeHave.includes(d);
            });

            console.log("toAdd: ", datesToAdd);

            filtered.concat(
                datesToAdd.map((date: number) => {
                    const activity: IActivity = {
                        date,
                        value: 0,
                    };
                    return activity;
                }),
            );

            const checkboxes = filtered.map((a) => {
                const checkbox: ICheckboxProps = {
                    ...a,
                    state: CheckboxStateFromInt(a.value),
                    locked: shouldLock(
                        today,
                        a.date,
                        props.lockFuture,
                        props.lockPast,
                    ),
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
    }, [props, today]);

    return (
        <>
            <div className="category">
                <span className="category-title">{props.title}</span>
                {propifiedHabits.map((habit) => {
                    return <Row {...habit} key={habit.title} />;
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
