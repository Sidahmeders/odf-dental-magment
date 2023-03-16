import { useState } from 'react'
import { Modal, Tabs, Tab } from 'react-bootstrap'

import { getEventTemplateButtons, addEventTemplateButtons, dropEventTemplateButton } from '../../../utils'

import AddEventBody from './AddEventBody'
import EditableButtons from '../../EditableButtons/EditableButtons'

import './AddEventModal.scss'

export default function AddEventModal({ selectedSlotInfo, showModal, handleClose }) {
  const [templateButtons, setTemplateButtons] = useState(getEventTemplateButtons())
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Tabs
        defaultActiveKey="add-event"
        className="mb-3"
        onSelect={() => setTemplateButtons(getEventTemplateButtons())}>
        <Tab eventKey="add-event" title="Ajouter évènement">
          <AddEventBody
            selectedSlotInfo={selectedSlotInfo}
            templateButtons={templateButtons}
            handleClose={handleClose}
          />
        </Tab>
        <Tab eventKey="modify-buttons" title="modifier boutons">
          <EditableButtons
            label="Mettre événement (btn modifiable)"
            handleClose={handleClose}
            getTemplateButtons={getEventTemplateButtons}
            addTemplateButtons={addEventTemplateButtons}
            dropTemplateButton={dropEventTemplateButton}
          />
        </Tab>
      </Tabs>
    </Modal>
  )
}
