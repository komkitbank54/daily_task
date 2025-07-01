import { motion } from "framer-motion";
import { useState, useRef } from "react";
import DragHandle from "./DragHandle";
import "../css/Task.css";

export default function TaskItem({ 
    task, 
    index, 
    onToggle, 
    isSettings, 
    onDelete, 
    onReorder
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [touchOffset, setTouchOffset] = useState(0);
    const dragElementRef = useRef(null);
    const isChecked = isSettings ? false : task.todayCompleted;

    const handleDragStart = (e) => {
        if (!isSettings) return;
        setIsDragging(true);
        e.dataTransfer.setData("text/plain", index.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDragOverIndex(null);
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
        if (draggedIndex !== index) {
            onReorder(draggedIndex, index);
        }
        
        setDragOverIndex(null);
        setIsDragging(false);
    };

    // Mobile touch handlers
    const handleTouchStart = (e) => {
        if (!isSettings) return;
        
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        setTouchOffset(touch.clientY - rect.top);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isSettings || !isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const taskElement = elements.find(el => el.classList.contains('tag-banner'));
        
        if (taskElement && taskElement !== e.currentTarget) {
            const allTasks = document.querySelectorAll('.tag-banner');
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
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const taskElement = elements.find(el => 
            el.classList.contains('tag-banner') && el !== e.currentTarget
        );
        
        if (taskElement) {
            const allTasks = document.querySelectorAll('.tag-banner');
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
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
                opacity: isDragging ? 0.7 : 1,
                y: 0,
                scale: isDragging ? 1.02 : 1
            }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: isDragging ? 0 : 0.3 }}
            className={`tag-banner${isChecked ? " tag-banner-active" : ""}${
                dragOverIndex === index ? " drag-over" : ""
            }${isDragging ? " dragging" : ""}`}
            draggable={isSettings}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={handleDrop}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleTaskClick}
            style={{
                cursor: isSettings ? 'grab' : 'pointer',
                touchAction: isSettings ? 'none' : 'auto',
                userSelect: 'none'
            }}
        >
            <input
                className="checkbox-wrapper"
                type="checkbox"
                checked={isChecked}
                disabled={isSettings}
                onChange={handleCheckboxChange}
            />
            <label className="tag-label" style={{ pointerEvents: isSettings ? 'none' : 'auto' }}>
                {task.title}
            </label>
            {isSettings && (
                <div className="edit-buttons">
                    <DragHandle
    onTouchStart={handleTouchStart}
    onMouseDown={handleDragStart}
/>
<button 
    className="delete-button"
    onClick={(e) => {
        e.stopPropagation();
        onDelete(index);
    }}
    onTouchStart={(e) => e.stopPropagation()} // เพิ่ม
    onTouchEnd={(e) => e.stopPropagation()}   // เพิ่ม
    aria-label="Delete task"
>
    ❌
</button>

                </div>
            )}
        </motion.div>
    );
}