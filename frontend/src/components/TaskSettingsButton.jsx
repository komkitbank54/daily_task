import "../css/Task.css";
import settingsIcon from "../css/icons/settings.png";

export default function TaskEditButton({ onClick }) {
    return (
        <button className="tag-settings" onClick={() => onClick()}>
            <img src={settingsIcon} alt="Settings" />
        </button>
    );
}
