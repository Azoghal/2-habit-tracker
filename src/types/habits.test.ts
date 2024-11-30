import { DAY_SECONDS } from "../components/Habits";
import { fillAll, filterZeroActivities, IHabits } from "./habits"; // Replace with the correct path
import { describe, it, expect } from "vitest";

describe("filterZeroActivities", () => {
    it("should filter out activities with value 0", () => {
        const originalHabits = {
            title: "Daily Routine",
            categories: [
                {
                    title: "Health",
                    habits: [
                        {
                            title: "Exercise",
                            activities: [
                                { date: 1, value: 30 },
                                { date: 2, value: 0 },
                                { date: 3, value: 20 },
                            ],
                        },
                    ],
                },
            ],
        };

        const expectedHabits = {
            title: "Daily Routine",
            categories: [
                {
                    title: "Health",
                    habits: [
                        {
                            title: "Exercise",
                            activities: [
                                { date: 1, value: 30 },
                                { date: 3, value: 20 },
                            ],
                        },
                    ],
                },
            ],
        };

        const filteredHabits = filterZeroActivities(originalHabits);

        expect(filteredHabits).toEqual(expectedHabits);
    });
});

describe("fillAll", () => {
    it("fills all dates", () => {
        const today = 0; // Timestamp (seconds since epoch) - adjust for your test
        const backwards = 2;
        const forwards = 2;
        const habits: IHabits = {
            title: "frank",
            categories: [
                {
                    title: "test category",
                    habits: [
                        {
                            title: "test habit",
                            activities: [
                                { date: today - DAY_SECONDS, value: 1 }, // 1 day ago
                                { date: today, value: 2 }, // Today
                            ],
                        },
                    ],
                },
            ],
        };

        const expectedHabits: IHabits = {
            title: "frank",
            categories: [
                {
                    title: "test category",
                    habits: [
                        {
                            title: "test habit",
                            activities: [
                                { date: today - 2 * DAY_SECONDS, value: 0 },
                                { date: today - DAY_SECONDS, value: 1 },
                                { date: today, value: 2 },
                                { date: today + DAY_SECONDS, value: 0 },
                                { date: today + 2 * DAY_SECONDS, value: 0 },
                            ],
                        },
                    ],
                },
            ],
        };

        const filledHabits = fillAll(habits, today, backwards, forwards);
        expect(filledHabits).toEqual(expectedHabits);
    });
});
