import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { useAppContext } from "../context/AppContext";

import TaskEditButton from "../components/BtnTaskSettings";
import TaskItem from "../components/BannerTask";
import SaveButton from "../components/BtnSave";
import AddTaskBanner from "../components/BannerAddTask";
import AddTaskModal from "../components/ModalAddTask";
import Loading from "../components/Loading";

import "../css/index.css";

export default function Task() {
    const { editMode, toggleEditMode } = useAppContext();
    const [showAddModal, setShowAddModal] = useState(false);
    const {
        tasks,
        reorderTasks,
        toggleTaskCompletion,
        deleteTask,
        hasUpdated,
        addTask,
        saveAllTasks,
        loading,
    } = useTasks(editMode);

    if (loading) return <Loading />;

    return (
        <>
            <h1 className="font-bold text-[2rem] text-center">Tasks</h1>
            <div className="task-grid">
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
                            onReorder={reorderTasks}
                            tasks={tasks}
                        />
                    ))}
                </AnimatePresence>
                {editMode && (
                    <>
                        <AddTaskBanner
                        onClick={() => setShowAddModal(true)}
                        />
                        <SaveButton
                            onClick={() => saveAllTasks(toggleEditMode)}
                            isUpdated={hasUpdated()}
                        />
                    </>
                )}
            </div>
                                    <AddTaskModal
                            isOpen={showAddModal}
                            onClose={() => setShowAddModal(false)}
                            onSave={(newTask) => {
                                addTask(newTask);
                                setShowAddModal(false);
                            }}
                            />
        </>
    );
}
