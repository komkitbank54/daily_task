import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => setEditMode((prev) => !prev);

    return (
        <AppContext.Provider value={{ editMode, toggleEditMode }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
