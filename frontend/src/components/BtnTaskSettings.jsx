import settingsIcon from "../css/icons/white_settings.png";

export default function TaskEditButton({ onClick }) {
    return (
        <button className="task-settings" onClick={() => onClick()}>
            <img src={settingsIcon} alt="Settings" />
        </button>
    );
}
