export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    txtHeader = "คุณยืนยันหรือไม่",
    txtDetail = "",
    txtConfirm = "ยืนยัน",
    txtCancel = "ยกเลิก",
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{txtHeader}</h2>
                <p>{txtDetail}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm}>{txtConfirm}</button>
                    <button onClick={onClose}>{txtCancel}</button>
                </div>
            </div>
        </div>
    );
}
