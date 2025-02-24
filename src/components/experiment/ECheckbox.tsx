import { useCallback, useState } from "react";
import { EBox } from "./EBox";
import { ECheckboxState } from "../../types/types";

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

export function ECheckbox(props: IECheckboxProps) {
    const [state, setState] = useState(props.value);

    const onLocalClick = useCallback(() => {
        if (!props.locked) {
            setState((state + 1) % 3);
            props.onClick();
        }
    }, [props, state]);

    return (
        <div onClick={onLocalClick}>
            <label className="checkbox-inner">
                <EBox locked={props.locked} state={state} />
            </label>
        </div>
    );
}
