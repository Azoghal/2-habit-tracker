export function getDayOfWeek(unixTimestamp: number): number {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const dayNumber = date.getDay() % 7; // 0 (sunday) to 6 (saturday)
    let dayNumberAdjusted = dayNumber - 1;
    if (dayNumberAdjusted < 0) {
        dayNumberAdjusted += 7;
    }
    return dayNumberAdjusted;
}

export const DaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const DaysOfWeekShort = ["M", "T", "W", "T", "F", "S", "S"];
