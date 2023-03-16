import React, { Suspense } from 'react'
import Router from './router'

import TopNavigation from './components/TopNavigation/TopNavigation'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

const App = () => {
  return (
    <div className="app-container">
      <Suspense fallback={null}>
        <TopNavigation />
        <Router />
      </Suspense>
    </div>
  )
}

export default App
