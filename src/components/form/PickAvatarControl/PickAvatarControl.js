import { useRef, useState } from 'react'
import { useController } from 'react-hook-form'
import { Maximize2, Share2, DownloadCloud } from 'react-feather'
import { shareOnMobile } from 'react-mobile-share'
import { format } from 'date-fns'

import { ACCEPTED_IMAGE_EXTENTIONS } from '../../../config'
import { getBase64, triggerBase64Download } from '../../../utils'

import FilesPreviewModal from './FilesPreviewModal'

import './PickAvatarControl.scss'

export default function PickAvatarControl({ label, name, errors, control, accept, src }) {
  const { field } = useController({ name, control })
  const fileRef = useRef()
  const focusFileInput = () => fileRef.current.click()
  const [showModal, setShowModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState()

  const onAvatarChange = async (e) => {
    const { files } = e.target
    if (files?.[0]) {
      const base64Image = await getBase64(files[0])
      setSelectedFile(base64Image)
      field.onChange(files)
    }
  }

  return (
    <div className="pick-avatar-container">
      <button onClick={focusFileInput} className="file-picker">
        <label>{label}</label>
        <input ref={fileRef} type="file" accept={accept} onChange={onAvatarChange} />
      </button>

      <div className="image-preview">
        {selectedFile || src ? (
          <>
            <FilesPreviewModal
              showPreview
              isImage={accept === ACCEPTED_IMAGE_EXTENTIONS}
              isSTL={accept === '.stl'}
              title={label}
              src={selectedFile || src}
              showModal={showModal}
              handleClose={() => setShowModal(false)}
            />
            <div className="action-buttons">
              <Maximize2 width="2rem" height="2rem" color="#474aff" onClick={() => setShowModal(true)} />
              {accept === ACCEPTED_IMAGE_EXTENTIONS && (
                <Share2
                  width="2rem"
                  height="2rem"
                  color="#474aff"
                  onClick={() =>
                    shareOnMobile({
                      title: label,
                      images: [src],
                    })
                  }
                />
              )}
              <DownloadCloud
                width="2rem"
                height="2rem"
                color="orange"
                onClick={() => {
                  const extension = accept !== ACCEPTED_IMAGE_EXTENTIONS ? accept : undefined
                  triggerBase64Download(src, format(new Date(), 'yy-MM-dd-hh-mm-ss'), extension)
                }}
              />
            </div>
          </>
        ) : (
          <div className="empty-file">aucun fichier</div>
        )}
        <span>{errors[name]?.message}</span>
      </div>
    </div>
  )
}
