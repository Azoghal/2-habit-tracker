interface IEGetStartedProps {
    onClick: () => void;
}

export default function EGetStarted(props: IEGetStartedProps): JSX.Element {
    return <button onClick={props.onClick}>Get Started</button>;
}
