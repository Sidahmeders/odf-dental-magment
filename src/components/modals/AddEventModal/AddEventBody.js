import { useContext, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Button, Row } from 'react-bootstrap'
import Select from 'react-select'
import { format } from 'date-fns'

import { ContextConsumer } from '../../../context'
import { ADD_EVENT_NAMES } from '../../../config'

import InputElement from '../../form/InputElement/InputElement'
import RadioInputElement from '../../form/RadioInputElement/RadioInputElement'

const resolvePatientOptions = (patients) => {
  return patients.map(({ id, fullName, birthDate = '' }) => ({
    label: `${fullName} (${format(birthDate, 'yyyy-MM-dd')})`,
    value: id,
  }))
}

const resolveTemplateButtonOptions = (templateButtons) =>
  templateButtons.map(({ name }) => ({ label: name, value: name }))

export default function AddEventBody({ selectedSlotInfo, templateButtons, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const { start, end } = selectedSlotInfo
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { isSubmitted },
  } = useForm()

  const patientsData = useLiveQuery(async () => await db.patients.toArray(), [], [])
  const patientOptions = resolvePatientOptions(patientsData)

  const onSubmit = (data) => {
    db.events.add({ start, end, ...data })
    handleClose()
  }

  useEffect(() => {
    reset({})
  }, [isSubmitted, reset])

  return (
    <>
      <h5 className="add-event-header">
        Date sélectionnée: <span className="date">{format(start, 'yyyy-MM-dd')}</span>
      </h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Controller
              control={control}
              name={ADD_EVENT_NAMES.PATIENT_ID}
              rules={{ required: true }}
              shouldUnregister={isSubmitted}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  inputRef={ref}
                  placeholder="Nom du patient..."
                  className="patient-select-box"
                  options={patientOptions}
                  value={patientOptions.find((option) => option.value === value)}
                  onChange={(val) => onChange(val.value)}
                />
              )}
            />
          </Row>

          <Row>
            <Controller
              control={control}
              name={ADD_EVENT_NAMES.TITLE}
              rules={{ required: true }}
              shouldUnregister={isSubmitted}
              render={({ field: { onChange, value, ref } }) => (
                <InputElement
                  required
                  inputRef={ref}
                  label="Mettre événement"
                  value={value}
                  onChange={(val) => onChange(val)}
                />
              )}
            />
          </Row>

          <Row>
            <RadioInputElement
              name="prefill-titles"
              options={resolveTemplateButtonOptions(templateButtons)}
              onChange={(value) => reset(() => ({ ...getValues(), [ADD_EVENT_NAMES.TITLE]: value }))}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer l'événement
          </Button>
        </Modal.Footer>
      </form>
    </>
  )
}
