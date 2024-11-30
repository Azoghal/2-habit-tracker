import { describe, it, expect } from "vitest";
import { fillBlanks, mapifyHabits, unmapifyHabits } from "./habitsMaps"; // Replace with your file path

const originalHabits = {
    title: "Daily Routine",
    categories: [
        {
            title: "Health",
            habits: [
                {
                    title: "Exercise",
                    activities: [
                        { date: 1, value: 1 },
                        { date: 2, value: 0 },
                    ],
                },
            ],
        },
    ],
};

const expectedMappedHabits = {
    categories: new Map([
        [
            "Health",
            {
                habits: new Map([
                    [
                        "Exercise",
                        {
                            activities: new Map([
                                [1, 1],
                                [2, 0],
                            ]),
                        },
                    ],
                ]),
            },
        ],
    ]),
};

describe("mapifyHabits", () => {
    it("should convert a simple habit structure to a mapped structure", () => {
        const mappedHabits = mapifyHabits(originalHabits);

        // You might need to use a deep comparison library like `jest-deep` to compare nested structures
        expect(mappedHabits).toEqual(expectedMappedHabits);
    });
});

describe("unmapifyHabits", () => {
    it("should convert a mapped habit structure to an original structure", () => {
        // Use the `expectedMappedHabits` from the previous test as input
        const originalHabits = unmapifyHabits(expectedMappedHabits);

        // Compare the original and converted structures to ensure they match
        expect(originalHabits).toEqual(originalHabits);
    });
});

import { IHabitMapped } from "../types/habitsMaps";

describe("fillBlanks", () => {
    it("should fill missing activities within the range", () => {
        const row: IHabitMapped = {
            activities: new Map([[1694368000, 10]]),
        }; // A single activity on a specific day
        const filledRow = fillBlanks(row, 1694368000, 2, 2);
        expect(filledRow.activities.size).toBe(5); // 5 days total
        expect(filledRow.activities.get(1694281600)).toBe(0); // Two days before
        expect(filledRow.activities.get(1694454400)).toBe(0); // Two days after
    });

    it("should handle an empty row", () => {
        const row: IHabitMapped = {
            activities: new Map(),
        };
        const filledRow = fillBlanks(row, 1694368000, 2, 2);
        expect(filledRow.activities.size).toBe(5);
        expect(filledRow.activities.get(1694281600)).toBe(0); // Two days before
        expect(filledRow.activities.get(1694454400)).toBe(0); // Two days after
    });
});
