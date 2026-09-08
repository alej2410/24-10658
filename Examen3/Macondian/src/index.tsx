///
/// index.tsx
///

// import React from 'react'
import ReactDOM from 'react-dom/client'
import Macondian from './Macondian'

import './index.css'

const element = document.getElementById('root');

if (element) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <Macondian />
  )
}
