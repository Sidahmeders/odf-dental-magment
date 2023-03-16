import { useState } from 'react'
import { Modal, Row, Badge, Button } from 'react-bootstrap'
import propTypes from 'prop-types'

import { guid } from '../../utils'

import InputElement from '../form/InputElement/InputElement'
import { DragWrapper, DropZone } from './Dnd'

import './EditableButtons.scss'

export default function EditableButtons({
  label,
  handleClose,
  getTemplateButtons,
  addTemplateButtons,
  dropTemplateButton,
}) {
  const [value, setValue] = useState()
  const [templateButtons, setTemplateButtons] = useState(getTemplateButtons())

  const addNewTemplate = () => {
    if (!value?.trim().length) return
    addTemplateButtons({ id: guid(), name: value })
    setValue('')
    setTemplateButtons(getTemplateButtons())
  }

  return (
    <div className="editable-buttons-container">
      <Modal.Body>
        <Row style={{ paddingBottom: '10px' }}>
          <InputElement required label={label} value={value} onChange={(e) => setValue(e.target.value)} />
        </Row>

        <Row>
          <div>
            {templateButtons.length ? (
              templateButtons.map(({ id, name }) => (
                <DragWrapper key={id} id={id}>
                  <Badge bg="secondary" style={{ margin: '2px' }}>
                    {name}
                  </Badge>
                </DragWrapper>
              ))
            ) : (
              <Badge bg="secondary">exemple (ne s'affichera pas)</Badge>
            )}
          </div>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <DropZone
          setTemplateButtons={setTemplateButtons}
          getTemplateButtons={getTemplateButtons}
          dropTemplateButton={dropTemplateButton}
        />
        <Button variant="outline-secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={addNewTemplate}>
          Ajouter bouton
        </Button>
      </Modal.Footer>
    </div>
  )
}

EditableButtons.propTypes = {
  label: propTypes.string,
  handleClose: propTypes.func,
  getTemplateButtons: propTypes.func,
  addTemplateButtons: propTypes.func,
  dropTemplateButton: propTypes.func,
}

EditableButtons.defaultProps = {
  label: '...(btn modifiable)',
  handleClose: () => {},
  getTemplateButtons: () => {},
  addTemplateButtons: () => {},
  dropTemplateButton: () => {},
}
