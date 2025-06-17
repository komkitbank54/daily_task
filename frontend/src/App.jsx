import { useState, useEffect } from 'react';
import './css/App.css';
import updownIcon from './css/icons/updown.png';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks?user=komkit');
      const data = await response.json();
      const sortedTasks = data.sort((a, b) => a.priority - b.priority);
      console.log('Fetched tasks:', sortedTasks);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, todayCompleted: !task.todayCompleted } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="tag-grid">
      <img src={updownIcon} alt="Icon" className='h-[1rem] w-[1rem] absolute right-[0.25rem] top-[0.25rem] opacity-50' />
      {tasks.map((task, index) => (
        <div
          key={task._id || index}
          className={`tag-banner${task.todayCompleted ? ' tag-banner-active' : ''}`}
          onClick={() => toggleTaskCompletion(index)}
        >
          <input
            className="checkbox-wrapper"
            type="checkbox"
            checked={task.todayCompleted}
            onChange={(e) => {
              e.stopPropagation();
              toggleTaskCompletion(index);
            }}
          />
          <label className="tag-label">{task.title}</label>
        </div>
      ))}
    </div>
  );
}

export default App;
