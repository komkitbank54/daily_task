export default function SaveButton({ onClick }) {
  return (
    <div className="save-button-container">
      <button className="save-button" onClick={onClick}>
        💾 Save Order
      </button>
    </div>
  );
}