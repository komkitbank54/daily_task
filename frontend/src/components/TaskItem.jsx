import { motion } from "framer-motion";
import "../css/Task.css";

export default function TaskItem({ task, index, onToggle }) {
    return (
        <motion.div
            key={task._id}
            layout
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`tag-banner${
                task.todayCompleted ? " tag-banner-active" : ""
            }`}
            onClick={() => onToggle(index)}
        >
            <input
                className="checkbox-wrapper"
                type="checkbox"
                checked={task.todayCompleted}
                onChange={(e) => {
                    e.stopPropagation();
                    onToggle(index);
                }}
            />
            <label className="tag-label">{task.title}</label>
        </motion.div>
    );
}
