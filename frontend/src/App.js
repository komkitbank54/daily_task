import { useState } from 'react';

import './css/main.css';
import './css/button.css'

function App() {
  const [active, setActive] = useState(null);

  return (
    <div className="main">
        Halo
        <div className='div-button-swipe'>
          <button className="btn btn-left">DONE</button>
          <button className="btn btn-right">LAZY</button>
        </div>
    </div>
  );
}

export default App;
