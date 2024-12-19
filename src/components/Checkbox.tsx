import { useCallback } from "react";
import { Box } from "./Box";

export enum CheckboxState {
    Empty = 0,
    Half = 1,
    Full = 2,
}

export function CheckboxStateFromInt(s: number): CheckboxState {
    switch (s) {
        case 1:
            return CheckboxState.Half;
        case 2:
            return CheckboxState.Full;
        default:
            return CheckboxState.Empty;
    }
}

export interface ICheckboxProps {
    date: number;
    value: number;
    state: CheckboxState;
    locked: boolean;
    onClick(): void;
}

// export interface CheckboxInfo{
//   onClick():void;
//   key: number // unix timestamp in seconds, should be 12:00pm UTC
//   state: CheckboxState
//   locked: boolean
// }

// function backToDate(epochSeconds: number): Date {
//     const date = new Date(epochSeconds * 1000);
//     return date;
// }

// function formatShortDate(date: Date): string {
//     return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
// }

export function Checkbox(props: ICheckboxProps) {
    const onLocalClick = useCallback(() => {
        if (!props.locked) {
            props.onClick();
        }
    }, [props]);

    return (
        <div
            className={`checkbox-container ${props.locked ? "checkbox-container__locked" : ""}`}
            onClick={onLocalClick}
        >
            <div className="checkbox-inner">
                <Box state={props.value} />
            </div>
        </div>
    );
}

// For styling https://blog.logrocket.com/styling-checkboxes-css-properties/
// and refer to when we had it working with the angled fill
