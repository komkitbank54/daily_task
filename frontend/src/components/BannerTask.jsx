import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useEffect } from "react";

export default function TaskItem({
    task,
    index,
    onToggle,
    isSettings,
    onDelete,
    onReorder,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [touchOffset, setTouchOffset] = useState(0);
    const dragElementRef = useRef(null);
    const isChecked = isSettings ? false : task.todayCompleted;

    useEffect(() => {
        if (!isSettings || !dragElementRef.current) return;

        const el = dragElementRef.current;

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const touch = e.touches[0];
            const elements = document.elementsFromPoint(
                touch.clientX,
                touch.clientY
            );
            const taskElement = elements.find((el) =>
                el.classList.contains("task-banner")
            );

            if (taskElement && taskElement !== el) {
                const allTasks = document.querySelectorAll(".task-banner");
                const hoveredIndex = Array.from(allTasks).indexOf(taskElement);
                if (hoveredIndex !== -1) {
                    setDragOverIndex(hoveredIndex);
                }
            }
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            const taskElement = elements.find((el) =>
                el.classList.contains("task-banner")
            );

            if (taskElement && taskElement !== el) {
                const allTasks = document.querySelectorAll(".task-banner");
                const hoveredIndex = Array.from(allTasks).indexOf(taskElement);
                if (hoveredIndex !== -1) {
                    setDragOverIndex(hoveredIndex);
                }
            }
        };

        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            el.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isSettings, isDragging]);

    const handleDragStart = (e) => {
        if (!isSettings) return;
        setIsDragging(true);
        e.dataTransfer.setData("text/plain", index.toString());
        e.dataTransfer.effectAllowed = "move";
        
        // เพิ่ม ghost image ที่ใส
        const ghost = document.createElement("div");
        ghost.style.opacity = "0.5";
        ghost.style.transform = "scale(0.8)";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const handleDragOver = (e) => {
        if (!isSettings) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverIndex(index);
    };

    const handleDrop = (e) => {
        if (!isSettings) return;
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
        if (draggedIndex !== index && !isNaN(draggedIndex)) {
            onReorder(draggedIndex, index);
        }
        setDragOverIndex(null);
        setIsDragging(false);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragOverIndex(null);
    };

    const handleTouchStart = (e) => {
        if (!isSettings) return;
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        setTouchOffset(touch.clientY - rect.top);
        setIsDragging(true);
    };

    const handleTouchEnd = (e) => {
        if (!isSettings || !isDragging) return;
        e.preventDefault();

        const touch = e.changedTouches[0];
        const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
        );
        const taskElement = elements.find(
            (el) =>
                el.classList.contains("task-banner") &&
                el !== dragElementRef.current
        );

        if (taskElement) {
            const allTasks = document.querySelectorAll(".task-banner");
            const droppedIndex = Array.from(allTasks).indexOf(taskElement);

            if (droppedIndex !== -1) {
                onReorder(index, droppedIndex);
            }
        }

        setIsDragging(false);
        setDragOverIndex(null);
        setTouchOffset(0);
    };

    const handleTaskClick = () => {
        if (!isSettings && !isDragging) {
            onToggle(index);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        if (!isSettings && !isDragging) {
            onToggle(index);
        }
    };

    return (
        <motion.div
            ref={dragElementRef}
            key={task._id}
            layout
            draggable={isSettings}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={handleDrop}
            onClick={handleTaskClick}
            initial={{ opacity: 0, y: 0 }}
            animate={{
                opacity: isDragging ? 0.7 : 1,
                y: 0,
                scale: isDragging ? 1.02 : 1,
            }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: isDragging ? 0 : 0.3 }}
            className={`task-banner${isChecked ? " task-banner-active" : ""}${
                dragOverIndex === index ? " drag-over" : ""
            }${isDragging ? " dragging" : ""} ${
                isSettings ? "drag-enabled" : ""
            }`}
            style={{
                touchAction: isSettings ? "none" : "auto",
                userSelect: "none",
                WebkitUserDrag: isSettings ? "element" : "none",
                cursor: isSettings ? "grab" : "default",
            }}
        >
            {!isSettings && (
                <input
                    className="checkbox-wrapper"
                    type="checkbox"
                    checked={isChecked}
                    disabled={isSettings}
                    onChange={handleCheckboxChange}
                />
            )}
            <label
                className="task-label"
                style={{ 
                    pointerEvents: isSettings ? "none" : "auto",
                    cursor: isSettings ? "grab" : "default"
                }}
            >
                {task.title}
            </label>

            {isSettings && (
                <div className="edit-buttons">
                    <button
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(index);
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        aria-label="Delete task"
                    >
                        ❌
                    </button>
                </div>
            )}
        </motion.div>
    );
}