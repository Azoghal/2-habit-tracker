import { EBox } from "../experiment/EBox";

interface ITablePracticeProps {
    columnKeys: number[];
}

export function TablePractice(props: ITablePracticeProps) {
    console.log(props);

    return <AnBox />;
}

function AnBox(): JSX.Element {
    return (
        <div className={`checkbox-container`}>
            <label className="checkbox-inner">
                <EBox state={1} />
            </label>
        </div>
    );
}
