import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { useAppContext } from "../context/AppContext";

import TaskEditButton from "../components/TaskSettingsButton";
import TaskItem from "../components/TaskItem";
import SaveButton from "../components/SaveButton";
import Loading from "../components/Loading";

import "../css/Task.css";

export default function Task() {
    const { editMode, toggleEditMode } = useAppContext();
    const {
        tasks,
        reorderTasks,
        toggleTaskCompletion,
        deleteTask,
        saveAllTasks,
        loading,
    } = useTasks(editMode);

    if (loading) return <Loading />;

    return (
        <>
            <h1 className="font-bold text-[2rem] text-center">
                Daily Tasks
            </h1>
            <div className="tag-grid">
                <TaskEditButton onClick={toggleEditMode} />
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task._id || index}
                            task={task}
                            index={index}
                            onToggle={toggleTaskCompletion}
                            isSettings={editMode}
                            onDelete={deleteTask}
                            onReorder={reorderTasks} // ส่ง reorderTasks แทน onMoveUp/onMoveDown
                            tasks={tasks} // ส่ง tasks array เพื่อใช้ใน drag and drop
                        />
                    ))}
                </AnimatePresence>
                {editMode && (
                    <SaveButton
                        onClick={saveAllTasks}
                    />
                )}
            </div>
        </>
    );
}