import "../css/components/banner-add-task.css";

export default function AddTaskBanner({ onClick }) {
    return (
        <div className="add-task-banner" onClick={onClick}>
            <label className="add-task-icon-text">+</label>
            <label className="add-task-text">เพิ่ม Task ใหม่</label>
        </div>
    );
}
