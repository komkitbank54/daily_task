import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function TaskItem({
  task,
  onToggle,
  isSettings,
  onDelete,
  onReorder,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverId, setDragOverId] = useState(null);
  const dragElementRef = useRef(null);

  const isChecked = !isSettings && task.todayCompleted;

  // 👉 สำหรับ mouse drag-over
  useEffect(() => {
    if (!isSettings || !dragElementRef.current) return;

    const el = dragElementRef.current;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const taskElement = elements.find((el) =>
        el.classList.contains("task-banner")
      );

      if (taskElement && taskElement !== el) {
        setDragOverId(taskElement.dataset.id);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isSettings, isDragging]);

  // 👉 Mouse drag events
  const handleDragStart = (e) => {
    if (!isSettings) return;
    setIsDragging(true);

    // ใช้ `_id`
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";

    const ghost = document.createElement("div");
    ghost.style.opacity = "0";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e) => {
    if (!isSettings) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(task._id);
  };

  const handleDrop = (e) => {
    if (!isSettings) return;
    e.preventDefault();

    const fromId = e.dataTransfer.getData("text/plain");
    const toId = task._id;

    if (fromId && toId && fromId !== toId) {
      onReorder(fromId, toId);
    }

    setDragOverId(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverId(null);
  };

  // 👉 Touch drag events
  const handleTouchStart = () => {
    if (!isSettings) return;
    setIsDragging(true);
  };

  const handleTouchEnd = (e) => {
    if (!isSettings || !isDragging) return;
    e.preventDefault();

    const elements = document.elementsFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );

    const targetElement = elements.find(
      (el) =>
        el.classList.contains("task-banner") &&
        el !== dragElementRef.current
    );

    if (targetElement) {
      const fromId = task._id;
      const toId = targetElement.dataset.id;

      if (fromId && toId && fromId !== toId) {
        onReorder(fromId, toId);
      }
    }

    setIsDragging(false);
    setDragOverId(null);
  };

  const handleTaskClick = () => {
    if (!isSettings && !isDragging) {
      onToggle(task._id);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (!isSettings && !isDragging) {
      onToggle(task._id);
    }
  };

  return (
    <motion.div
      ref={dragElementRef}
      data-id={task._id} // ✅ เก็บ id ไว้ใช้ querySelector
      key={task._id}
      layout
      draggable={isSettings}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOverId(null)}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleTaskClick}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isDragging ? 0.7 : 1,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`task-banner${isChecked ? " task-banner-active" : ""}${
        dragOverId === task._id ? " drag-over" : ""
      }${isDragging ? " dragging" : ""} ${
        isSettings ? "drag-enabled" : ""
      }`}
      style={{
        touchAction: isSettings ? "none" : "auto",
        userSelect: "none",
        cursor: isSettings ? "grab" : "pointer",
      }}
    >
      {!isSettings && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox-wrapper"
        />
      )}
      <label
        className="task-label"
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
              onDelete(task);
            }}
            aria-label="Delete task"
          >
            ❌
          </button>
        </div>
      )}
    </motion.div>
  );
}
