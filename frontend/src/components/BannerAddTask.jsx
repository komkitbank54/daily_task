import "../css/components/banner-add-task.css";

export default function AddTaskBanner({ onAdd }) {
    return (
        <div className="add-task-banner" onClick={onAdd}>
            <span className="plus-icon">＋</span>
            <span className="add-text">เพิ่ม Task ใหม่</span>
        </div>
    );
}
