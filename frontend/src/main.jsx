import React from "react";
import ReactDOM from "react-dom/client";
import Task from "./pages/Task";
import { AppProvider } from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppProvider>
            <Task />
        </AppProvider>
    </React.StrictMode>
);
