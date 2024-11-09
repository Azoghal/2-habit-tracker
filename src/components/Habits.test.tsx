import { fillBlanks } from "./Habits"; // Adjust the path as needed
import { describe, it, expect } from "vitest";
import { IHabitMapped } from "@/types/habitsMaps";

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
