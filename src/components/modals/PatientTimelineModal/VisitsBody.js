import { Modal, Button } from 'react-bootstrap'
import { format, parseISO } from 'date-fns'

import AddNewVisits from './AddNewVisits'
import UserTimeLine from './UserTimeLine'

export default function VisitsBody({
  visits,
  setVisits,
  selectedPatient,
  keysToDelete,
  setKeysToDelete,
  templateButtons,
  handleClose,
  setIsLoading,
}) {
  const { fullName, birthDate, totalPrice } = selectedPatient

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {fullName} ({format(parseISO(birthDate), 'yyyy-MM-dd')}) - Prix total:
          <span style={{ color: '#474aff' }}> {totalPrice || '???'} DZD </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddNewVisits
          selectedPatient={selectedPatient}
          visits={visits}
          keysToDelete={keysToDelete}
          setVisits={setVisits}
          templateButtons={templateButtons}
          setIsLoading={setIsLoading}
          handleClose={handleClose}
        />
        <UserTimeLine
          visits={visits}
          setVisits={setVisits}
          keysToDelete={keysToDelete}
          setKeysToDelete={setKeysToDelete}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Annuler
        </Button>
      </Modal.Footer>
    </>
  )
}
