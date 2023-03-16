import { useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'

import { DATABSE_COLLECTIONS_CHECKBOXES } from '../../../config'
import { ContextConsumer } from '../../../context'

import InlineCheckboxes from '../../form/Checkboxes/InlineCheckboxes'

export default function SaveModalBoday({ handleClose }) {
  const { db } = useContext(ContextConsumer)
  const [checkboxes, setCheckboxes] = useState(DATABSE_COLLECTIONS_CHECKBOXES)

  const saveIndexedDB = () => {
    checkboxes.forEach(async ({ name, isChecked }) => {
      if (isChecked) {
        const fileName = `${name}-${format(new Date(), 'yyyy.MM.dd.hh:mm')}.json`
        const collection = await db?.[name].toArray()

        const fileToSave = new Blob([JSON.stringify({ [name]: collection })], {
          type: 'application/json',
        })

        saveAs(fileToSave, fileName)
      }
    })
  }

  return (
    <>
      <Modal.Body>
        <h6>veuillez sélectionner le entités que vous souhaitez enregistrer:</h6>
        <br />
        <InlineCheckboxes checkboxes={checkboxes} setCheckboxes={setCheckboxes} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="warning" onClick={saveIndexedDB}>
          Sauvegardez vos données
        </Button>
      </Modal.Footer>
    </>
  )
}
