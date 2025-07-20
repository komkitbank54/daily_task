import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { useGrids } from "../hooks/useGrids";
import { useAppContext } from "../context/AppContext";

import {
    TaskEditButton,
    SaveButton,
    AddTaskModal,
    ConfirmModal,
    Loading,
    AddTaskBanner,
    TaskItem,
    GridItem,
} from "../hooks/indexComponents";

import "../css/index.css";

export default function Task() {
    const { editMode, toggleEditMode } = useAppContext();
    const [showAddModal, setShowAddModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [gridNameDisplay, setGridNameDisplay] = useState(null);
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
    const { grids } = useGrids();

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

    if (!grids) {
        return "no grid";
    }

    return (
        <>
            <h1 className="font-bold text-[2rem] text-center">Tasks</h1>
            {grids.map((grid) => (
                <GridItem grid_name={grid.grid_name} key={grid.id}>
                    <TaskEditButton onClick={toggleEditMode} />
                    <AnimatePresence>
                        {tasks
                            .filter((task) => task.grid === grid.grid_name)
                            .map((task, index) => (
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
                        {editMode && (
                            <>
                                <AddTaskBanner
                                    onClick={() => {
                                        setShowAddModal(true);
                                        setGridNameDisplay(grid.grid_name);
                                    }}
                                />
                                <SaveButton
                                    onClick={() => saveAllTasks(toggleEditMode)}
                                    isUpdated={hasUpdated()}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </GridItem>
            ))}
            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={(newTask) => {
                    addTask(newTask);
                    setShowAddModal(false);
                }}
                gridName={gridNameDisplay}
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
