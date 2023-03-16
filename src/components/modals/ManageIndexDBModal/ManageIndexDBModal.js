import { Modal, Tabs, Tab } from 'react-bootstrap'

import ImportModalBody from './ImportModalBody'
import SaveModalBoday from './SaveModalBoday'

export default function ManageIndexDBModal({ showModal, handleClose }) {
  return (
    <Modal className="modal-md" show={showModal} onHide={handleClose}>
      <Tabs defaultActiveKey="save" className="mb-3">
        <Tab eventKey="save" title="Sauvegarder">
          <SaveModalBoday handleClose={handleClose} />
        </Tab>
        <Tab eventKey="import" title="Importer">
          <ImportModalBody handleClose={handleClose} />
        </Tab>
      </Tabs>
    </Modal>
  )
}
