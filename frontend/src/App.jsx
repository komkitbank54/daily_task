import { useState } from 'react'
import './css/App.css'

function App() {

  const [check, setCheck] = useState(false)

  return (
    <>
      <div className='tag-grid'>
        <div className={`tag-banner${check ? ' tag-banner-active' : ''}`} onClick={() => setCheck(prev => !prev)}>
            <input
              className='checkbox-wrapper'
              type="checkbox"
              checked={check}
            />
          <label className='tag-label'>Toggle me!</label> 
        </div>
      </div>
    </>
  )
}

export default App
