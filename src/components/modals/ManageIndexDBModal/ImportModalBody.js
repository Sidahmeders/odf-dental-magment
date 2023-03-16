import { useContext, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

import { parseJsonFile } from '../../../utils'
import { ContextConsumer } from '../../../context'

import Loader from '../../Loader/Loader'

export default function ImportModalBody({ handleClose }) {
  const { db } = useContext(ContextConsumer)
  const [dbFiles, setDbFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const importIndexedDB = async () => {
    setIsLoading(true)

    await Array.from(dbFiles).reduce(async (promise, file) => {
      await promise
      const [fileName] = file.name.split('-')
      const jsonData = await parseJsonFile(file)
      await db?.[fileName].bulkPut(jsonData[fileName])
    }, Promise.resolve())

    setIsLoading(false)
    handleClose()
  }

  const handleFilesChange = (e) => {
    const { files } = e.target
    setDbFiles(files)
  }

  return (
    <Loader loading={isLoading}>
      <Modal.Body>
        <h6>veuillez sélectionner les données que vous souhaitez importer dans votre base de données:</h6>
        <br />
        <Form.Control multiple type="file" accept=".json" onChange={handleFilesChange} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="danger" onClick={importIndexedDB}>
          Importer vos données
        </Button>
      </Modal.Footer>
    </Loader>
  )
}
