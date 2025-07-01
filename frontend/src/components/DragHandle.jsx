export default function DragHandle({ onDragStart, onDragEnd, onTouchStart, ...rest }) {
    return (
        <div
            className="drag-handle"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTouchStart={onTouchStart}
            {...rest}
        >
            ☰
        </div>
    );
}
