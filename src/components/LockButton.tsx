interface ILockButtonProps {
    onToggle(): void;
    locked: boolean;
    buttonText?: string;
    inverted?: boolean;
}

export default function LockButton(props: ILockButtonProps): JSX.Element {
    return (
        <button className="c-btn" onClick={props.onToggle}>
            {(props.inverted ? !props.locked : props.locked) ? "🔒" : "🔓"}
            {props.buttonText ?? ""}
        </button>
    );
}
