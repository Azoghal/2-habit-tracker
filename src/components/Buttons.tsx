interface IEmojiButtonProps {
    emoji: string;
    onClick(): void;
}

export function EmojiButton(props: IEmojiButtonProps): JSX.Element {
    return (
        <button className="c-btn" onClick={props.onClick}>
            {props.emoji}
        </button>
    );
}

interface IBasicButtonProps {
    onClick(): void;
}

export function BinButton(props: IBasicButtonProps): JSX.Element {
    return EmojiButton({ ...props, emoji: "🗑️" });
}

export function AddButton(props: IBasicButtonProps): JSX.Element {
    return EmojiButton({ ...props, emoji: "➕" });
}

interface ILockButtonProps {
    onToggle(): void;
    locked: boolean;
    buttonText?: string;
    inverted?: boolean;
}

export function LockButton(props: ILockButtonProps): JSX.Element {
    return (
        <button className="c-btn" onClick={props.onToggle}>
            {(props.inverted ? !props.locked : props.locked) ? "🔒" : "🔓"}
            {props.buttonText ?? ""}
        </button>
    );
}
