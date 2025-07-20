import { useState, useEffect } from "react";

export default function AddTaskModal({ isOpen, onClose, onSave, gridName }) {
    const [user, setUser] = useState("");
    const [grid, setGrid] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setUser("komkit");
        setGrid(gridName); // sync gridName -> grid state
    }, [gridName]);

    const handleSave = () => {
        if (!user || !title) {
            alert("User & Title are required!");
            return;
        }

        const newTask = { user, grid, title, description };
        onSave(newTask);

        setTitle("");
        setDescription("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Add New Task</h2>

                <label>
                    User:
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        disabled
                    />
                </label>

                <label>
                    Grid:
                    <input type="text" value={grid} disabled />
                </label>

                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <div className="modal-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
