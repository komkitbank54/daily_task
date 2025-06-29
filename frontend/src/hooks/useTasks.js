import { useEffect, useState } from "react";

export function useTasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/tasks?user=komkit"
            );
            const data = await res.json();
            setTasks(sortTasks(data));
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    const sortTasks = (taskList) => {
        return [...taskList].sort((a, b) => {
            if (a.todayCompleted !== b.todayCompleted) {
                return a.todayCompleted ? 1 : -1;
            }
            return b.priority - a.priority;
        });
    };

    const toggleTaskCompletion = async (index) => {
        const updatedTasks = [...tasks];
        const task = updatedTasks[index];
        const newValue = !task.todayCompleted;

        task.todayCompleted = newValue;
        setTasks(sortTasks(updatedTasks));

        try {
            await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todayCompleted: newValue }),
            });
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    const deleteTask = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    const moveTaskUp = (index) => {
        if (index <= 0) return;
        const newTasks = [...tasks];
        [newTasks[index - 1], newTasks[index]] = [
            newTasks[index],
            newTasks[index - 1],
        ];
        setTasks(newTasks);
    };

    const moveTaskDown = (index) => {
        if (index >= tasks.length - 1) return;
        const newTasks = [...tasks];
        [newTasks[index], newTasks[index + 1]] = [
            newTasks[index + 1],
            newTasks[index],
        ];
        setTasks(newTasks);
    };

    return {
        tasks,
        toggleTaskCompletion,
        deleteTask,
        moveTaskUp,
        moveTaskDown,
    };
}
