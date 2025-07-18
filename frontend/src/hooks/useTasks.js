import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api/tasks";
const USER_ID = "komkit";

export function useTasks(editMode = false) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        resortTasks();
    }, [editMode]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}?user=${USER_ID}`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid data format: expected an array.");
            }

            setTasks(sortTasks(data));
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const sortTasks = (taskList) => {
        return [...taskList].sort((a, b) => {
            if (a.todayCompleted !== b.todayCompleted && !editMode) {
                return a.todayCompleted ? 1 : -1;
            }
            return a.priority - b.priority;
        });
    };

    const resortTasks = () => {
        setTasks((prevTasks) => sortTasks(prevTasks));
    };

    const toggleTaskCompletion = async (index) => {
        const updatedTasks = [...tasks];
        const task = updatedTasks[index];
        const newValue = !task.todayCompleted;

        task.todayCompleted = newValue;
        setTasks(sortTasks(updatedTasks));

        try {
            await fetch(`${API_BASE_URL}/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todayCompleted: newValue }),
            });
        } catch (err) {
            console.error("Failed to update task:", err);
            // Revert on error
            task.todayCompleted = !newValue;
            setTasks(sortTasks([...updatedTasks]));
        }
    };

    const deleteTask = async (task) => {
        console.log(task._id)
        try {
            await fetch(`${API_BASE_URL}/${task._id}`, {
                method: "DELETE",
            });
            await fetchTasks();
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    const reorderTasks = (fromIndex, toIndex) => {
        setTasks((prevTasks) => {
            const newTasks = [...prevTasks];
            const [draggedTask] = newTasks.splice(fromIndex, 1);
            newTasks.splice(toIndex, 0, draggedTask);
            return newTasks;
        });
    };

    const hasUpdated = () => {
        const boolean = tasks.some((task, index) => task.priority !== index);
        // console.log(boolean)
        return boolean;
    };

    const addTask = async (newTask) => {
        console.log(JSON.stringify(newTask))
        try {
            const res = await fetch(`${API_BASE_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!res.ok) {
                throw new Error(`Failed to add task: ${res.status}`);
            }

            await fetchTasks();
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    const saveAllTasks = async (exitEditMode) => {
        console.log("tasks:", tasks);
        if (!hasUpdated()) {
            console.warn("There is no tasks updated.");
            return;
        }
        try {
            const updatePromises = tasks
                .map((task, index) => {
                    if (task.priority !== index) {
                        return fetch(`${API_BASE_URL}/${task._id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ priority: index }),
                        });
                    } else {
                        return null;
                    }
                })
                .filter(Boolean);

            await Promise.all(updatePromises);
            await fetchTasks();

            if (exitEditMode) exitEditMode();
        } catch (err) {
            console.error("💥 เซฟ priority ล้มเหลว:", err);
        }
    };

    return {
        tasks,
        reorderTasks,
        toggleTaskCompletion,
        deleteTask,
        hasUpdated,
        addTask,
        saveAllTasks,
        loading,
    };
}
