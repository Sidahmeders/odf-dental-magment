import { useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { format } from 'date-fns'

import { ContextConsumer } from '../../context'

export default function DisplayEventModal({ selectedEvent, showModal, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const { id, start, fullName, eventName } = selectedEvent

  const [canDeleteEvent, setCanDeleteEvent] = useState(false)

  const onDeleteEventIntent = () => {
    setCanDeleteEvent(true)
  }

  const deleteEvent = async () => {
    await db.events.delete(id)
    setCanDeleteEvent(false)
    handleClose()
  }

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setCanDeleteEvent(false)
        handleClose()
      }}>
      <Modal.Body>
        <h5>
          Date: <span style={{ color: '#474aff' }}>{start && format(start, 'yyyy-MM-dd')}</span>
        </h5>
        <h5>
          Nom: <span style={{ color: '#474aff' }}>{fullName}</span>{' '}
        </h5>
        <h5>
          Évén: <span style={{ color: '#474aff' }}>{eventName}</span>{' '}
        </h5>
      </Modal.Body>
      <Modal.Footer>
        {!canDeleteEvent && (
          <>
            <Button variant="outline-secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button variant="warning" onClick={onDeleteEventIntent}>
              Supprimer
            </Button>
          </>
        )}
        <div style={{ display: `${canDeleteEvent ? 'block' : 'none'}` }}>
          <Button style={{ marginRight: '6px' }} variant="outline-secondary" onClick={() => setCanDeleteEvent(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteEvent}>
            Confirmer
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
