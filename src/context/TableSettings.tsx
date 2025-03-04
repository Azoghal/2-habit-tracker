import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { DAY_SECONDS, getTodayMidday } from "../components/experiment/EHabits";

// TODO add the dates: number[] to the context
interface ITableSettings {
    // Read only context
    today: number;
    days: number[];

    //Modifiable settings
    lockPast: boolean;
    lockFuture: boolean;
    setLockPast: (value: boolean) => void;
    setLockFuture: (value: boolean) => void;
    deleteHeaderMode: boolean;
    setDeleteHeaderMode: (value: boolean) => void;
    addHeaderMode: boolean;
    setAddHeaderMode: (value: boolean) => void;
}

// Create the context
export const TableSettingsContext = createContext<ITableSettings>({
    today: getTodayMidday(),
    days: [getTodayMidday()],
    lockPast: false,
    lockFuture: true,
    setLockPast: () => {},
    setLockFuture: () => {},
    deleteHeaderMode: false,
    setDeleteHeaderMode: () => {},
    addHeaderMode: false,
    setAddHeaderMode: () => {},
});

// Custom hook to use the context
export function useTableSettings() {
    return useContext(TableSettingsContext);
}

interface ITableSettingsProviderProps {
    initialSettings: {
        lockPast: boolean;
        lockFuture: boolean;
        deleteHeaderMode: boolean;
        addHeaderMode: boolean;
    }; // Optional initial settings
    children: React.ReactNode;
}

// Context provider component
export function TableSettingsProvider(
    props: PropsWithChildren<ITableSettingsProviderProps>,
) {
    const [lockPast, setLockPast] = useState(props.initialSettings.lockPast);
    const [lockFuture, setLockFuture] = useState(
        props.initialSettings.lockFuture,
    );
    const [deleteHeaderMode, setDeleteHeaderMode] = useState(
        props.initialSettings.deleteHeaderMode,
    );
    const [addHeaderMode, setAddHeaderMode] = useState(
        props.initialSettings.addHeaderMode,
    );

    const today = getTodayMidday();

    const getDates = useCallback(() => {
        const today = getTodayMidday();
        const start = today - 21 * DAY_SECONDS;
        const end = today + 7 * DAY_SECONDS;

        const middays: number[] = [];
        for (let t = start; t <= end; t += DAY_SECONDS) {
            middays.push(t);
        }
        return middays;
    }, []);

    const settings = useMemo(() => {
        const settings: ITableSettings = {
            today,
            days: getDates(),
            lockPast,
            lockFuture,
            setLockPast,
            setLockFuture,
            deleteHeaderMode,
            setDeleteHeaderMode,
            addHeaderMode,
            setAddHeaderMode,
        };
        return settings;
    }, [
        today,
        getDates,
        lockPast,
        lockFuture,
        deleteHeaderMode,
        addHeaderMode,
        setDeleteHeaderMode,
        setAddHeaderMode,
    ]);

    return (
        <TableSettingsContext.Provider value={settings}>
            {props.children}
        </TableSettingsContext.Provider>
    );
}
