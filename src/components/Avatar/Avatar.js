import { useRef, useState } from 'react'
import propTypes from 'prop-types'
import { Form, Image } from 'react-bootstrap'
import { Maximize2, DownloadCloud } from 'react-feather'
import { format } from 'date-fns'

import EmptyProfile from '../../assets/empty-profile.png'
import { triggerBase64Download } from '../../utils'

import FilesPreviewModal from '../form/PickAvatarControl/FilesPreviewModal'

import './Avatar.scss'

export default function Avatar({ src, accept, updateImage }) {
  const fileRef = useRef()
  const focusFileInput = () => fileRef.current.click()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="avatar-container">
      <Image onClick={focusFileInput} fluid roundedCircle thumbnail src={src} alt="profile" />
      <Form.Control ref={fileRef} onChange={updateImage} type="file" accept={accept} />
      <div className="actions-buttons">
        <FilesPreviewModal
          isImage
          src={src}
          title="Profile Image"
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
        <Maximize2 color="#474aff" onClick={() => setShowModal(true)} />
        <DownloadCloud
          color="orange"
          onClick={() => triggerBase64Download(src, format(new Date(), 'yy-MM-dd-hh-mm-ss'))}
        />
      </div>
    </div>
  )
}

Avatar.propTypes = {
  src: propTypes.string.isRequired,
  accept: propTypes.string,
  updateImage: propTypes.func,
}

Avatar.defaultProps = {
  src: EmptyProfile,
  accept: 'image/*',
  updateImage: () => {},
}
