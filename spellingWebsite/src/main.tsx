import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home'
import About from './pages/About'

const page = document.documentElement.dataset.page

const PageComponent = page === 'about' ? About : Home

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageComponent />
  </React.StrictMode>
)