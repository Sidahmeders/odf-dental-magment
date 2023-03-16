import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Table, Calendar, PieChart, Save } from 'react-feather'

import { APP_ROUTES } from '../../config'
import { getPageRoute, setPageRoute } from '../../utils'

import ManageIndexDBModal from '../modals/ManageIndexDBModal/ManageIndexDBModal'

import './TopNavigation.scss'

export default function TopNavigation() {
  const location = useLocation()
  const [selectedRoute, setSelectedRoute] = useState(getPageRoute())
  const [showSaveIndexDBModal, setShowSaveIndexDBModal] = useState(false)

  useEffect(() => {
    setSelectedRoute(getPageRoute())
  }, [location.pathname])

  return (
    <div className="top-navigation-container">
      <Link
        className={`${selectedRoute === APP_ROUTES.PATIENT_LIST ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.PATIENT_LIST)}
        to={APP_ROUTES.PATIENT_LIST}>
        <Table />
      </Link>

      <Link
        className={`${selectedRoute === APP_ROUTES.CALENDAR ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.CALENDAR)}
        to={APP_ROUTES.CALENDAR}>
        <Calendar />
      </Link>

      <Link
        className={`${selectedRoute === APP_ROUTES.STATISTICS ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.STATISTICS)}
        to={APP_ROUTES.STATISTICS}>
        <PieChart />
      </Link>
      <div className="save-icon">
        <Save color="orange" onClick={() => setShowSaveIndexDBModal(true)} />
      </div>

      <ManageIndexDBModal showModal={showSaveIndexDBModal} handleClose={() => setShowSaveIndexDBModal(false)} />
    </div>
  )
}
