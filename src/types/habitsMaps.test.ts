import { describe, it, expect } from "vitest";
import { mapifyHabits, unmapifyHabits } from "./habitsMaps"; // Replace with your file path

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
