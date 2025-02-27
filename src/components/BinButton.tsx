interface IBinButtonProps {
    onClick(): void;
}

export default function BinButton(props: IBinButtonProps): JSX.Element {
    return (
        <button className="c-btn" onClick={props.onClick}>
            🗑️
        </button>
    );
}
