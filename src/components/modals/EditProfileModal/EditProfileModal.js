import { useContext, useEffect, useState } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useLiveQuery } from 'dexie-react-hooks'
import { pickBy, identity } from 'lodash'

import { ContextConsumer } from '../../../context'
import {
  EDIT_PROFILE_NAMES,
  PATIENT_IMAGE_NAMES,
  EDIT_PROFILE_CHECKBOXES,
  ACCEPTED_IMAGE_EXTENTIONS,
} from '../../../config'
import { getPatient, getBase64 } from '../../../utils'

import Loader from '../../Loader/Loader'
import DatePicker from '../../form/DatePicker/DatePicker'
import InputElement from '../../form/InputElement/InputElement'
import Textarea from '../../form/Textarea/Textarea'
import Checkboxes from '../../form/Checkboxes/Checkboxes'
import PickAvatarControl from '../../form/PickAvatarControl/PickAvatarControl'

import '../ProfileModal.scss'

export default function EditProfileModal({ showModal, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const selectedPatient = getPatient()

  const [isLoading, setIsLoading] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: selectedPatient,
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    const {
      id,
      imagesId,
      birthDate,
      prePhoto = [],
      postPhoto = [],
      preRadio = [],
      postRadio = [],
      preScan = [],
      postScan = [],
    } = data

    const prePhotoBase64 = await getBase64(prePhoto[0])
    const preRadioBase64 = await getBase64(preRadio[0])
    const preSacnBase64 = await getBase64(preScan[0])
    const postPhotoBase64 = await getBase64(postPhoto[0])
    const postRadioBase64 = await getBase64(postRadio[0])
    const postScanBase64 = await getBase64(postScan[0])

    const imagesData = {
      [PATIENT_IMAGE_NAMES.PRE_PHOTO]: prePhotoBase64,
      [PATIENT_IMAGE_NAMES.PRE_RADIO]: preRadioBase64,
      [PATIENT_IMAGE_NAMES.PRE_SCAN]: preSacnBase64,
      [PATIENT_IMAGE_NAMES.POST_PHOTO]: postPhotoBase64,
      [PATIENT_IMAGE_NAMES.POST_RADIO]: postRadioBase64,
      [PATIENT_IMAGE_NAMES.POST_SCAN]: postScanBase64,
    }

    const newImagesId = imagesId
      ? await db.images.update(imagesId, {
          ...pickBy(imagesData, identity),
        })
      : await db.images.add(imagesData)

    db.patients.update(id, {
      ...data,
      birthDate: new Date(birthDate),
      isUrgent,
      imagesId: imagesId || newImagesId,
    })

    setIsLoading(false)
    handleClose()
  }

  const followupImages =
    useLiveQuery(
      async () => {
        setIsLoading(true)
        const patientImages = await db.images.get(selectedPatient.imagesId || 0)
        setIsLoading(false)
        return patientImages
      },
      [showModal, handleClose],
      {},
    ) || {}

  useEffect(() => {
    reset(selectedPatient)
    setIsUrgent(selectedPatient.isUrgent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal])

  return (
    <div className="edit-profile-container">
      <Modal backdrop="static" className="modal-lg" show={showModal} onHide={handleClose}>
        <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier le profil</Modal.Title>
          </Modal.Header>
          <Loader loading={isLoading}>
            <Modal.Body>
              <Row>
                <Controller
                  control={control}
                  name={EDIT_PROFILE_NAMES.FULL_NAME}
                  rules={{ required: true }}
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
                    name={EDIT_PROFILE_NAMES.BIRTH_DATE}
                    rules={{ required: true }}
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
                    name={EDIT_PROFILE_NAMES.TOTAL_PRICE}
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
                    name={EDIT_PROFILE_NAMES.PHONE_NUMBER_ONE}
                    rules={{ required: true }}
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
                    name={EDIT_PROFILE_NAMES.PHONE_NUMBER_TWO}
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
                  name={EDIT_PROFILE_NAMES.TREATMENT_PLAN}
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
                <Controller
                  control={control}
                  name={EDIT_PROFILE_NAMES.DIAGNOSTIC}
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
                <Col>
                  <Form.Switch
                    checked={isUrgent}
                    onChange={() => setIsUrgent(!isUrgent)}
                    className="urgent-switch"
                    label="Urgent"
                  />
                </Col>
              </Row>

              <Row>
                <Checkboxes
                  className="radio-group-status"
                  options={EDIT_PROFILE_CHECKBOXES}
                  name="status"
                  control={control}
                  initialValue={selectedPatient.status}
                />
              </Row>

              <Row>
                <Col>
                  <PickAvatarControl
                    accept={ACCEPTED_IMAGE_EXTENTIONS}
                    src={followupImages[PATIENT_IMAGE_NAMES.PRE_PHOTO]}
                    label="photo avant"
                    name={PATIENT_IMAGE_NAMES.PRE_PHOTO}
                    errors={errors}
                    control={control}
                  />
                </Col>

                <Col>
                  <PickAvatarControl
                    accept={ACCEPTED_IMAGE_EXTENTIONS}
                    src={followupImages[PATIENT_IMAGE_NAMES.POST_PHOTO]}
                    label="photo apres"
                    name={PATIENT_IMAGE_NAMES.POST_PHOTO}
                    errors={errors}
                    control={control}
                  />
                </Col>

                <Col>
                  <PickAvatarControl
                    accept=".stl"
                    src={followupImages[PATIENT_IMAGE_NAMES.PRE_RADIO]}
                    label="radio avant"
                    name={PATIENT_IMAGE_NAMES.PRE_RADIO}
                    errors={errors}
                    control={control}
                  />
                </Col>

                <Col>
                  <PickAvatarControl
                    accept=".stl"
                    src={followupImages[PATIENT_IMAGE_NAMES.POST_RADIO]}
                    label="radio apres"
                    name={PATIENT_IMAGE_NAMES.POST_RADIO}
                    errors={errors}
                    control={control}
                  />
                </Col>

                <Col>
                  <PickAvatarControl
                    accept=".ply"
                    src={followupImages[PATIENT_IMAGE_NAMES.PRE_SCAN]}
                    label="scan avant"
                    name={PATIENT_IMAGE_NAMES.PRE_SCAN}
                    errors={errors}
                    control={control}
                  />
                </Col>

                <Col>
                  <PickAvatarControl
                    accept=".ply"
                    src={followupImages[PATIENT_IMAGE_NAMES.POST_SCAN]}
                    label="scan apres"
                    name={PATIENT_IMAGE_NAMES.POST_SCAN}
                    errors={errors}
                    control={control}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Sauvegarder les modifi..
              </Button>
            </Modal.Footer>
          </Loader>
        </form>
      </Modal>
    </div>
  )
}
