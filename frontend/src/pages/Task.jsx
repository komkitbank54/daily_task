import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { useAppContext } from "../context/AppContext";

import {
  TaskEditButton,
  SaveButton,
  AddTaskModal,
  ConfirmModal,
  Loading,
  AddTaskBanner,
  TaskItem,
} from "../components";


import "../css/index.css";

export default function Task() {
    const { editMode, toggleEditMode } = useAppContext();
    const [showAddModal, setShowAddModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
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

    if (!tasks || tasks.length === 0) {
        return (
            <>
                <h1 className="font-bold text-[2rem] text-center">Tasks</h1>
                <div className="task-grid">
                    <TaskEditButton onClick={toggleEditMode} />
                    <AddTaskBanner onClick={() => setShowAddModal(true)} />
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
                            onDelete={(task) => setTaskToDelete(task)}
                            onReorder={reorderTasks}
                            tasks={tasks}
                        />
                    ))}
                </AnimatePresence>
                {editMode && (
                    <>
                        <AddTaskBanner onClick={() => setShowAddModal(true)} />
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
            <ConfirmModal
                isOpen={!!taskToDelete}
                task={taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={() => {
                    deleteTask(taskToDelete);
                    setTaskToDelete(null);
                }}
            />
        </>
    );
}
