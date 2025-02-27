import {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from "react";
import { getTodayMidday } from "../components/experiment/EHabits";

// TODO add the dates: number[] to the context
interface ITableSettings {
    // Read only context
    today: number;

    //Modifiable settings
    lockPast: boolean;
    lockFuture: boolean;
    setLockPast: (value: boolean) => void;
    setLockFuture: (value: boolean) => void;
    lockHeaders: boolean;
    setLockHeaders: (value: boolean) => void;
}

// Create the context
export const TableSettingsContext = createContext<ITableSettings>({
    today: getTodayMidday(),
    lockPast: false,
    lockFuture: true,
    setLockPast: () => {},
    setLockFuture: () => {},
    lockHeaders: true,
    setLockHeaders: () => {},
});

// Custom hook to use the context
export function useTableSettings() {
    return useContext(TableSettingsContext);
}

interface ITableSettingsProviderProps {
    initialSettings: {
        lockPast: boolean;
        lockFuture: boolean;
        lockHeaders: boolean;
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
    const [lockHeaders, setLockHeaders] = useState(
        props.initialSettings.lockHeaders,
    );

    const today = getTodayMidday();

    const settings = useMemo(() => {
        return {
            today,
            lockPast,
            lockFuture,
            setLockPast,
            setLockFuture,
            lockHeaders,
            setLockHeaders,
        };
    }, [lockFuture, lockHeaders, lockPast, today]);

    return (
        <TableSettingsContext.Provider value={settings}>
            {props.children}
        </TableSettingsContext.Provider>
    );
}
