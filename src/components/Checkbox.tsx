export enum CheckboxState {
    Empty = 1,
    Half,
    Full,
}

interface ICheckboxProps {
    onClick():void;
    state: CheckboxState
}

export default function Checkbox(props: ICheckboxProps) {
    

    return <div className="line-height-0 border-t-20-transparent border-r-20-green">
        {/* Hello */}
    </div>;
  }
  