import { filterZeroActivities } from "./habits"; // Replace with the correct path
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
