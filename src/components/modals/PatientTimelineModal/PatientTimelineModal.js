import { useState, useEffect, useContext } from 'react'
import { Modal, Tabs, Tab } from 'react-bootstrap'

import { FOLLOWUPS } from '../../../config'
import { getPatient, getVistTemplateButtons, addVisitTemplateButtons, dropVisitTemplateButton } from '../../../utils'
import { ContextConsumer } from '../../../context'

import Loader from '../../Loader/Loader'
import EditableButtons from '../../EditableButtons/EditableButtons'
import VisitsBody from './VisitsBody'

export default function PatientTimelineModal({ showModal, handleClose }) {
  const [visits, setVisits] = useState([])
  const [keysToDelete, setKeysToDelete] = useState([])
  const [templateButtons, setTemplateButtons] = useState(getVistTemplateButtons())
  const [isLoading, setIsLoading] = useState(false)

  const { db } = useContext(ContextConsumer)

  const selectedPatient = getPatient()
  const { id } = selectedPatient

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const followups = await db.followups.where({ patientId: id || 0 }).sortBy(FOLLOWUPS.CREATION_DATE)
      setVisits(followups.reverse())

      setIsLoading(false)
    })()
  }, [id, db, showModal])

  return (
    <Modal backdrop="static" className="modal-xl" show={showModal} onHide={handleClose}>
      <Loader loading={isLoading}>
        <Tabs
          defaultActiveKey="add-visit"
          className="mb-3"
          onSelect={() => setTemplateButtons(getVistTemplateButtons())}>
          <Tab eventKey="add-visit" title="Ajouter visite">
            <VisitsBody
              visits={visits}
              setVisits={setVisits}
              selectedPatient={selectedPatient}
              keysToDelete={keysToDelete}
              setKeysToDelete={setKeysToDelete}
              templateButtons={templateButtons}
              handleClose={handleClose}
              setIsLoading={setIsLoading}
            />
          </Tab>
          <Tab eventKey="edit-buttons" title="modifier boutons">
            <EditableButtons
              label="Description (btn modifiable)"
              handleClose={handleClose}
              getTemplateButtons={getVistTemplateButtons}
              addTemplateButtons={addVisitTemplateButtons}
              dropTemplateButton={dropVisitTemplateButton}
            />
          </Tab>
        </Tabs>
      </Loader>
    </Modal>
  )
}
