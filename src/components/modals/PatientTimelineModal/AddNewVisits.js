import { useState, useContext, useRef } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print'

import { getBase64, guid } from '../../../utils'
import { FOLLOWUPS } from '../../../config'
import { ContextConsumer } from '../../../context'

import InputElement from '../../form/InputElement/InputElement'
import RadioInputElement from '../../form/RadioInputElement/RadioInputElement'
import TextArea from '../../form/Textarea/Textarea'
import ComponentToPrint from './ComponentToPrint/ComponentToPrint'

const resolveTemplateButtonOptions = (templateButtons) =>
  templateButtons.map(({ name }) => ({ label: name, value: name }))

export default function AddNewVisits({
  selectedPatient,
  visits,
  keysToDelete,
  setVisits,
  templateButtons,
  setIsLoading,
  handleClose,
}) {
  const { db } = useContext(ContextConsumer)
  const { id: patientId } = selectedPatient

  const [newVisist, setNewVisist] = useState({})

  const addNewVisit = () => {
    const [lastVisit] = visits
    const lastPayments = parseInt(lastVisit?.lastPayments || 0) + parseInt(newVisist?.payment || 0)

    setVisits([
      {
        id: guid(),
        [FOLLOWUPS.PATIENT_ID]: patientId,
        [FOLLOWUPS.CREATION_DATE]: Date.now(),
        [FOLLOWUPS.LAST_PAYMENTS]: lastPayments,
        ...newVisist,
      },
      ...visits,
    ])

    setNewVisist({})
  }

  const saveAddedVisits = async () => {
    setIsLoading(true)
    try {
      await db.followups.bulkDelete(keysToDelete)
      await db.followups.bulkAdd(visits)
    } catch (err) {
      console.error(err.message)
    }
    setIsLoading(false)
    handleClose()
    setVisits([])
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <>
      <Row style={{ alignItems: 'center' }}>
        <Col>
          <InputElement
            label="Payment"
            type="number"
            value={newVisist.payment}
            onChange={(e) => {
              setNewVisist({ ...newVisist, [FOLLOWUPS.PAYMENT]: e.target.value })
            }}
            style={{ padding: '9px 15px' }}
          />
        </Col>

        <Col>
          <Form.Group controlId="formFileSm">
            <Form.Control
              type="file"
              size="md"
              onChange={async (e) => {
                const [imageFile] = e.target.files || []
                const base64Image = await getBase64(imageFile)

                setNewVisist({ ...newVisist, [FOLLOWUPS.IMAGE]: base64Image })
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <TextArea
            placeholder="description..."
            value={newVisist.description}
            onChange={(e) => {
              setNewVisist({ ...newVisist, [FOLLOWUPS.DESCRIPTION]: e.target.value })
            }}
          />
        </Col>
      </Row>

      <Row>
        <RadioInputElement
          name="prefill-description"
          options={resolveTemplateButtonOptions(templateButtons)}
          onChange={(value) => setNewVisist({ ...newVisist, [FOLLOWUPS.DESCRIPTION]: value })}
        />
      </Row>

      <div style={{ display: 'none' }}>
        <ComponentToPrint ref={componentRef} selectedPatient={selectedPatient} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '10px' }}>
        <Button variant="outline-primary" onClick={addNewVisit}>
          Ajouter visite
        </Button>
        <Button variant="primary" onClick={saveAddedVisits}>
          Sauvegarder
        </Button>
        <Button variant="dark" onClick={handlePrint}>
          Imprimer
        </Button>
      </div>
    </>
  )
}
