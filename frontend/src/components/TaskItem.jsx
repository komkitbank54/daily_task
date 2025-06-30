import { motion } from "framer-motion";
import "../css/Task.css";

export default function TaskItem({ task, index, onToggle, isSettings, onMoveUp, onMoveDown, onDelete }) {
    const isChecked = isSettings ? false : task.todayCompleted;

    return (
        <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`tag-banner${isChecked ? " tag-banner-active" : ""}`}
            onClick={() => {
                if (!isSettings) {
                    onToggle(index);
                }
            }}
        >
            <input
                className="checkbox-wrapper"
                type="checkbox"
                checked={isChecked}
                disabled={isSettings}
                onChange={(e) => {
                    e.stopPropagation();
                    if (!isSettings) {
                        onToggle(index);
                    }
                }}
            />

            <label className="tag-label">{task.title}</label>

            <span className="priority-label">{task.priority}</span>
            {isSettings && (
                <div className="edit-buttons">
                    <button onClick={() => onMoveUp(index)}>⬆️</button>
                    <button onClick={() => onMoveDown(index)}>⬇️</button>
                    <button onClick={() => onDelete(index)}>❌</button>
                </div>
            )}
        </motion.div>
    );
}
