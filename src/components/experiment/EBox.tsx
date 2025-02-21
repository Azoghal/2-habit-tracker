interface IEBoxProps {
    state: number;
}

export function EBox(props: IEBoxProps) {
    const className = `box-box box-box__${props.state == 2 ? "full" : props.state == 1 ? "half" : "empty"}`;

    return (
        <div className="box-box-container">
            <div className={className}></div>
        </div>
    );
}
