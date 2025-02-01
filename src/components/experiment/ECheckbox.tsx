import { useCallback } from "react";
import { EBox } from "./EBox";

export enum ECheckboxState {
    Empty = 0,
    Half = 1,
    Full = 2,
}

export function CheckboxStateFromInt(s: number): ECheckboxState {
    switch (s) {
        case 1:
            return ECheckboxState.Half;
        case 2:
            return ECheckboxState.Full;
        default:
            return ECheckboxState.Empty;
    }
}

export interface IECheckboxProps {
    date: number;
    value: number;
    state: ECheckboxState;
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

export function ECheckbox(props: IECheckboxProps) {
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
            <label className="checkbox-inner">
                <EBox state={props.value} />
            </label>
        </div>
    );
}

// For styling https://blog.logrocket.com/styling-checkboxes-css-properties/
// and refer to when we had it working with the angled fill
