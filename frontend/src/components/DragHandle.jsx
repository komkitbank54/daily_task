export default function DragHandle({ onMouseDown, onTouchStart }) {
    return (
        <button 
            className="drag-handle"
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(e); // เรียกของ parent
            }}
            onTouchStart={(e) => {
                e.stopPropagation();
                onTouchStart?.(e); // เรียกของ parent
            }}
            aria-label="Drag to reorder"
        >
            ⋮⋮
        </button>
    );
}
