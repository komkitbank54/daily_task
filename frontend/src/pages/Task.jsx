import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { useAppContext } from "../context/AppContext";

import TaskSettingsButton from "../components/TaskSettingsButton";
import TaskItem from "../components/TaskItem";

import "../css/Task.css";

export default function Task() {
    const {
        tasks,
        toggleTaskCompletion,
        deleteTask,
        moveTaskUp,
        moveTaskDown,
    } = useTasks();
    const { editMode, toggleEditMode } = useAppContext();

    return (
        <>
            <h1 className="font-bold text-[2rem] text-center border-test">
                Daily Tasks
            </h1>
            <div className="tag-grid">
                <TaskSettingsButton onClick={toggleEditMode} />
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task._id || index}
                            task={task}
                            index={index}
                            onToggle={toggleTaskCompletion}
                            isSettings={editMode}
                            onDelete={deleteTask}
                            onMoveUp={moveTaskUp}
                            onMoveDown={moveTaskDown}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
