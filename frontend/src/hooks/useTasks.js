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
            const data = await res.json();
            setTasks(sortTasks(data));
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const sortTasks = (taskList) => {
        return [...taskList].sort((a, b) => {
            // ใน edit mode ไม่เรียงตาม completion status
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

    const deleteTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    };

    const reorderTasks = (fromIndex, toIndex) => {
        setTasks(prevTasks => {
            const newTasks = [...prevTasks];
            const [draggedTask] = newTasks.splice(fromIndex, 1);
            newTasks.splice(toIndex, 0, draggedTask);
            return newTasks;
        });
    };

    const saveAllTasks = async () => {
        try {
            const updatePromises = tasks.map((task, index) =>
                fetch(`${API_BASE_URL}/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ priority: tasks.length - index }),
                })
            );
            await Promise.all(updatePromises);
            await fetchTasks();
        } catch (err) {
            console.error("Failed to save all tasks:", err);
        }
    };

    return {
        tasks,
        reorderTasks,
        toggleTaskCompletion,
        deleteTask,
        saveAllTasks,
        loading,
    };
}