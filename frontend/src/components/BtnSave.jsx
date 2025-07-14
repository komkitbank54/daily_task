export default function SaveButton({ onClick, isUpdated }) {
  return (
    <div className="save-button-container">
      <button
        className={`save-button ${!isUpdated ? "dimmed" : ""}`}
        onClick={onClick}
        disabled={!isUpdated}
      >
        Save
      </button>
    </div>
  );
}
