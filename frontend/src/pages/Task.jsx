import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "../components/TaskItem";

import "../css/Task.css";
import settingsIcon from "../css/icons/settings.png";

export default function Task() {
    const { tasks, toggleTaskCompletion } = useTasks();

    return (
        <>
            <h1 className="font-bold text-[2rem] text-center border-test">Daily Tasks</h1>
            <div className="tag-grid">
                <button className="tag-settings" onClick={() => alert("Settings clicked!")}>
                    <img src={settingsIcon} alt="Settings" />
                </button>
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task._id || index}
                            task={task}
                            index={index}
                            onToggle={toggleTaskCompletion}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
