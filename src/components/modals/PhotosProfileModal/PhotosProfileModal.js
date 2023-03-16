import { useContext, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Modal, Carousel } from 'react-bootstrap'
import { format, parseISO } from 'date-fns'
import { Share2, DownloadCloud } from 'react-feather'
import { shareOnMobile } from 'react-mobile-share'

import { FOLLOWUPS } from '../../../config'
import { getPatient, triggerBase64Download } from '../../../utils'
import { ContextConsumer } from '../../../context'

import Loader from '../../Loader/Loader'

import './PhotosProfileModal.scss'

export default function PhotosProfileModal({ showModal, handleClose }) {
  const { db } = useContext(ContextConsumer)
  const { id, fullName, birthDate } = getPatient()
  const [isLoading, setIsLoading] = useState(true)

  const followupImages = useLiveQuery(
    async () => {
      setIsLoading(true)
      const followups = await db.followups.where({ patientId: id || 0 }).sortBy(FOLLOWUPS.CREATION_DATE)
      const imagesData = followups.reduce((prev, item) => (item.image ? [...prev, item] : prev), [])
      setIsLoading(false)
      return imagesData
    },
    [showModal, handleClose],
    [],
  )

  return (
    <Modal backdrop="static" className="modal-xl" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {fullName} ({birthDate && format(parseISO(birthDate), 'yyyy-MM-dd')})
        </Modal.Title>
      </Modal.Header>
      <Loader loading={isLoading}>
        <Modal.Body style={{ minHeight: '5rem' }}>
          <Carousel fade>
            {followupImages.map(({ id, image, description, creationDate }) => (
              <Carousel.Item key={id}>
                <img className="d-block w-100" src={image} alt="followup" />
                <Carousel.Caption>
                  <h5>{format(creationDate, 'yyyy-MM-dd')}</h5>
                  <button className="share-btn" onClick={() => shareOnMobile({ title: description, images: [image] })}>
                    <Share2 width="2rem" height="2rem" color="#474aff" />
                  </button>
                  <button
                    className="download-btn"
                    onClick={() => triggerBase64Download(image, format(new Date(), 'yy-MM-dd-hh-mm-ss'))}>
                    <DownloadCloud width="2rem" height="2rem" color="orange" />
                  </button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Loader>
    </Modal>
  )
}
