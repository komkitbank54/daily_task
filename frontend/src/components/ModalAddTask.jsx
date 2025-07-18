import { useState } from "react";

export default function AddTaskModal({ isOpen, onClose, onSave }) {
  const [user, setUser] = useState("");
  const [grid, setGrid] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useState(() => {
    setUser("komkit");
    setGrid("Hi");
  }, []);

  const handleSave = () => {
    if (!user || !title) {
      alert("User & Title are required!");
      return;
    }

    const newTask = { user, grid, title, description };
    onSave(newTask);

    setUser("komkit");
    setGrid("Hi");
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
          <input
            type="text"
            value={grid}
            onChange={(e) => setUser(e.target.value)}
            disabled
          />
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
