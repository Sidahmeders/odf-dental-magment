import { useState, useMemo, useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { ContextConsumer } from '../../context'
import { FILTER_CHECKBOXES } from '../../config'
import { setPatient } from '../../utils'
import { patientColumns } from './patientColumns'

import DataTable from '../../components/DataTable/DataTable'
import ExpandableComponent from './ExpandableComponent/ExpandableComponent'
import TableHeaderComponent from './TableHeaderComponent/TableHeaderComponent'
import CreateProfileModal from '../../components/modals/CreateProfileModal/CreateProfileModal'
import PhotosProfileModal from '../../components/modals/PhotosProfileModal/PhotosProfileModal'
import EditProfileModal from '../../components/modals/EditProfileModal/EditProfileModal'
import DeletePatientModal from '../../components/modals/DeletePatientModal'
import PatientTimelineModal from '../../components/modals/PatientTimelineModal/PatientTimelineModal'

import './Patients.scss'

export default function Patients() {
  const [filterText, setFilterText] = useState('')
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false)
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showPhotosModal, setShowPhotosModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [filterCheckboxes, setFilterCheckboxes] = useState(FILTER_CHECKBOXES)
  const [isLoading, setIsLoading] = useState(false)

  const { db } = useContext(ContextConsumer)

  const patientsData = useLiveQuery(
    async () => {
      setIsLoading(true)
      const patientsData = await db.patients.toArray()
      setIsLoading(false)
      return patientsData
    },
    [],
    [],
  )

  const filteredItems = patientsData.filter((patient) => {
    const { fullName, status, isUrgent } = patient

    const textFiltered = fullName && fullName?.toLowerCase()?.includes(filterText?.toLowerCase())

    const { isChecked: isStatusChecked } =
      filterCheckboxes?.find(({ label: filterLabel, isChecked }) => {
        const isFound = status?.find((item) => filterLabel === item) && isChecked
        return isUrgent || isFound
      }) || {}

    return isStatusChecked && textFiltered ? patient : false
  })

  const subHeaderComponent = useMemo(() => {
    const handleFilter = (e) => setFilterText(e.target.value)

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    return (
      <TableHeaderComponent
        onFilter={handleFilter}
        onClear={handleClear}
        filterText={filterText}
        filterCheckboxes={filterCheckboxes}
        setFilterCheckboxes={setFilterCheckboxes}
        handleShow={() => setShowCreateProfileModal(true)}
      />
    )
  }, [filterText, resetPaginationToggle, filterCheckboxes])

  return (
    <div className="patient-page-container">
      <CreateProfileModal showModal={showCreateProfileModal} handleClose={() => setShowCreateProfileModal(false)} />

      <PhotosProfileModal showModal={showPhotosModal} handleClose={() => setShowPhotosModal(false)} />

      <EditProfileModal showModal={showEditModal} handleClose={() => setShowEditModal(false)} />

      <DeletePatientModal showModal={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />

      <PatientTimelineModal showModal={showTimelineModal} handleClose={() => setShowTimelineModal(false)} />

      <DataTable
        loading={isLoading}
        data={filteredItems}
        columns={patientColumns({ setShowPhotosModal, setShowEditModal, setShowDeleteModal })}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeaderComponent={subHeaderComponent}
        expandableRowsComponent={ExpandableComponent}
        onRowDoubleClicked={(row) => {
          setShowTimelineModal(true)
          setPatient(row)
        }}
      />
    </div>
  )
}
