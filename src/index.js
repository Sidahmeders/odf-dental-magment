import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import App from './App'
import * as serviceWorker from './serviceWorkerRegistration'
import { ContextProvider } from './context'

const container = document.getElementById('root')
const root = createRoot(container)

const isTouchDevice = () => 'ontouchstart' in window
const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend

root.render(
  <ContextProvider>
    <BrowserRouter>
      <DndProvider backend={backendForDND}>
        <App />
      </DndProvider>
    </BrowserRouter>
  </ContextProvider>,
)

serviceWorker.register()
