import { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { format, parseISO } from 'date-fns'

import { getPatient } from '../../utils'
import { ContextConsumer } from '../../context'

export default function DeletePatientModal({ showModal, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const selectedPatient = getPatient()
  const { id: patientId, fullName, birthDate } = selectedPatient

  const handleDeleteUser = () => {
    db.patients.delete(patientId)
    handleClose()
  }

  return (
    <Modal className="modal-md" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {fullName} ({birthDate && format(parseISO(birthDate), 'yyyy-MM-dd')})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>êtes-vous sûr de vouloir supprimer ce patient</h6>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleDeleteUser}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
