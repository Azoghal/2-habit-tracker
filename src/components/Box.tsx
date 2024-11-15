interface IBoxProps {
  state: number;
}

export function Box(props: IBoxProps) {
  const className = `box-box box-box__${props.state == 2 ? "full" : props.state == 1 ? "half" : "empty"}`;

  return <div className={className}></div>;
}
