export default function ConfirmModal({ isOpen, onClose, onConfirm, task, textHeader = "คุณยืนยันหรือไม่", textDetail = "", textConfirm = "ยืนยัน", textCancel = "ยกเลิก"}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{textHeader}</h2>
        <p>{textDetail}</p>
        <p><strong>{task?.title}</strong></p>
        <div className="modal-actions">
          <button onClick={onConfirm}>{textConfirm}</button>
          <button onClick={onClose}>{textCancel}</button>
        </div>
      </div>
    </div>
  );
}
