import { createContext, useState } from 'react'
import Dexie from 'dexie'

import { CREATE_PROFILE_NAMES, ADD_EVENT_NAMES, PATIENT_IMAGE_NAMES, FOLLOWUPS } from './config'

const Context = createContext()

const getKeysFromNames = (names) => Object.values(names).join(', ')

function ContextProvider(props) {
  const db = new Dexie('dentalDB')

  db.version(1).stores({
    patients: `++id, ${getKeysFromNames(CREATE_PROFILE_NAMES)}`,
    events: `++id, ${getKeysFromNames(ADD_EVENT_NAMES)}`,
    images: `++id, ${getKeysFromNames(PATIENT_IMAGE_NAMES)}`,
    followups: `++id, ${getKeysFromNames(FOLLOWUPS)}`,
  })

  const [cephaloResult, setCephaloResult] = useState(false)

  return (
    <Context.Provider
      value={{
        db,
        cephaloResult,
        setCephaloResult,
      }}>
      {props.children}
    </Context.Provider>
  )
}

const ContextConsumer = Context

export { ContextProvider, ContextConsumer }
