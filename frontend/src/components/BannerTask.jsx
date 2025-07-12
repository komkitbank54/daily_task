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
                el.classList.contains("tag-banner")
            );

            if (taskElement && taskElement !== el) {
                const allTasks = document.querySelectorAll(".tag-banner");
                const hoveredIndex = Array.from(allTasks).indexOf(taskElement);
                if (hoveredIndex !== -1) {
                    setDragOverIndex(hoveredIndex);
                }
            }
        };

        el.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isSettings, isDragging]);

    const handleDragOver = (e) => {
        if (!isSettings) return;
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e) => {
        if (!isSettings) return;
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
        if (draggedIndex !== index) {
            onReorder(draggedIndex, index);
        }
        setDragOverIndex(null);
        setIsDragging(false);
    };

    const handleTouchMove = (e) => {
        if (!isSettings || !isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(
            touch.clientX,
            touch.clientY
        );
        const taskElement = elements.find((el) =>
            el.classList.contains("tag-banner")
        );

        if (taskElement && taskElement !== dragElementRef.current) {
            const allTasks = document.querySelectorAll(".tag-banner");
            const hoveredIndex = Array.from(allTasks).indexOf(taskElement);
            if (hoveredIndex !== -1) {
                setDragOverIndex(hoveredIndex);
            }
        }
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
                el.classList.contains("tag-banner") &&
                el !== dragElementRef.current
        );

        if (taskElement) {
            const allTasks = document.querySelectorAll(".tag-banner");
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
            draggable={isSettings} // <-- สำคัญ
            onDragStart={(e) => {
                if (!isSettings) return;
                setIsDragging(true);
                e.dataTransfer.setData("text/plain", index.toString());
                e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => {
                setIsDragging(false);
                setDragOverIndex(null);
            }}
            onTouchStart={(e) => {
                if (!isSettings) return;
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                setTouchOffset(touch.clientY - rect.top);
                setIsDragging(true);
            }}
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
            className={`tag-banner${isChecked ? " tag-banner-active" : ""}${
                dragOverIndex === index ? " drag-over" : ""
            }${isDragging ? " dragging" : ""} ${
                isSettings ? "drag-enabled" : ""
            }`} // <-- เพิ่มคลาส
            style={{
                touchAction: isSettings ? "none" : "auto",
                userSelect: "none",
                WebkitUserDrag: "none",
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
                className="tag-label"
                style={{ pointerEvents: isSettings ? "none" : "auto" }}
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
