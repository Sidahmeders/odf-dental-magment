import { useContext, useState } from 'react'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'

import { ContextConsumer } from '../../../context'
import { CREATE_PROFILE_NAMES, EDIT_PROFILE_CHECKBOXES } from '../../../config'
import { getBase64 } from '../../../utils'

import DatePicker from '../../form/DatePicker/DatePicker'
import InputElement from '../../form/InputElement/InputElement'
import Textarea from '../../form/Textarea/Textarea'

import '../ProfileModal.scss'

const initialValues = Object.values(CREATE_PROFILE_NAMES).reduce((prev, curr) => ({ ...prev, [curr]: '' }), {})

export default function CreateProfileModal({ showModal, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted },
  } = useForm({ defaultValues: initialValues })

  const [isUrgent, setIsUrgent] = useState(false)

  const onSubmit = async (data) => {
    const { profileImage } = data
    const base64Image = await getBase64(profileImage[0])

    db.patients.add({
      ...data,
      [CREATE_PROFILE_NAMES.CREATION_DATE]: Date.now(),
      [CREATE_PROFILE_NAMES.STATUS]: [EDIT_PROFILE_CHECKBOXES[0].name],
      [CREATE_PROFILE_NAMES.IS_URGENT]: isUrgent,
      [CREATE_PROFILE_NAMES.PROFILE_IMAGE]: base64Image,
    })

    setIsUrgent(false)
    reset(initialValues)
    handleClose()
  }

  return (
    <div className="create-profile-container">
      <Modal backdrop="static" className="modal-lg" show={showModal} onHide={handleClose}>
        <form className="create-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Creer un Profil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Controller
                control={control}
                name={CREATE_PROFILE_NAMES.FULL_NAME}
                rules={{ required: true }}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value, ref } }) => (
                  <InputElement
                    required
                    inputRef={ref}
                    label="Nom & Prenom"
                    value={value}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
            </Row>

            <Row>
              <Col>
                <Controller
                  control={control}
                  name={CREATE_PROFILE_NAMES.BIRTH_DATE}
                  rules={{ required: true }}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value, ref } }) => (
                    <DatePicker
                      inputRef={ref}
                      label="Date de naissance"
                      value={new Date(value)}
                      onChange={(val) => onChange(val)}
                    />
                  )}
                />
              </Col>

              <Col>
                <Controller
                  control={control}
                  name={CREATE_PROFILE_NAMES.TOTAL_PRICE}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputElement
                      inputRef={ref}
                      type="number"
                      label="Somme totale"
                      value={value}
                      onChange={(val) => onChange(val)}
                    />
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Controller
                  control={control}
                  name={CREATE_PROFILE_NAMES.PHONE_NUMBER_ONE}
                  rules={{ required: true }}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputElement
                      required
                      inputRef={ref}
                      type="tel"
                      label="Telephone 1"
                      value={value}
                      onChange={(val) => onChange(val)}
                    />
                  )}
                />
              </Col>

              <Col>
                <Controller
                  control={control}
                  name={CREATE_PROFILE_NAMES.PHONE_NUMBER_TWO}
                  shouldUnregister={isSubmitted}
                  render={({ field: { onChange, value, ref } }) => (
                    <InputElement
                      inputRef={ref}
                      type="tel"
                      label="Telephone 2"
                      value={value}
                      onChange={(val) => onChange(val)}
                    />
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Controller
                control={control}
                name={CREATE_PROFILE_NAMES.DIAGNOSTIC}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value, ref } }) => (
                  <Textarea
                    inputRef={ref}
                    placeholder="Diagnostic..."
                    value={value}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
            </Row>

            <Row>
              <Controller
                control={control}
                name={CREATE_PROFILE_NAMES.TREATMENT_PLAN}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value, ref } }) => (
                  <Textarea
                    inputRef={ref}
                    placeholder="Plan de traitement..."
                    value={value}
                    onChange={(val) => onChange(val)}
                  />
                )}
              />
            </Row>

            <Row>
              <Col>
                <Form.Switch onChange={() => setIsUrgent(!isUrgent)} className="urgent-switch" label="Urgent" />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter ce patient
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
