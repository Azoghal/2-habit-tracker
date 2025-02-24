interface IEBoxProps {
    state: number;
    locked: boolean;
}

export function EBox(props: IEBoxProps) {
    const lockedName = props.locked ? " box-box__locked" : "";

    const className =
        `box-box box-box__${props.state == 2 ? "full" : props.state == 1 ? "half" : "empty"}` +
        lockedName;

    return (
        <div className="box-box-container">
            <div className={className}></div>
        </div>
    );
}
