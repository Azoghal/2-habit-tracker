interface ILockButtonProps {
    onToggle(): void;
    locked: boolean;
    buttonText?: string;
}

export default function LockButton(props: ILockButtonProps): JSX.Element {
    return (
        <button className="c-btn" onClick={props.onToggle}>
            {props.locked ? "🔒" : "🔓"}
            {props.buttonText ?? ""}
        </button>
    );
}
