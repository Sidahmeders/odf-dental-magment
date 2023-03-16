import { useRoutes } from 'react-router-dom'
import { lazy } from 'react'

import { APP_ROUTES } from '../config'

const Patients = lazy(() => import('../pages/patients/Patients'))
const Calendar = lazy(() => import('../pages/calendar/Calendar'))
const Statistics = lazy(() => import('../pages/statistics/Statistics'))

const allRoutes = [
  {
    path: APP_ROUTES.PATIENT_LIST,
    element: <Patients />,
  },
  {
    path: APP_ROUTES.CALENDAR,
    element: <Calendar />,
  },
  {
    path: APP_ROUTES.STATISTICS,
    element: <Statistics />,
  },
]

const Router = () => useRoutes([...allRoutes])

export default Router
