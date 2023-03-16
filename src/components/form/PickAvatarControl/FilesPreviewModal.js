import { Modal } from 'react-bootstrap'
import { StlViewer } from 'react-stl-viewer'

export default function FilesPreviewModal({ showModal, handleClose, title, src, showPreview, isImage, isSTL }) {
  return (
    <>
      <Modal style={{ zIndex: '9999' }} show={showModal} fullscreen onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isImage && <img width="100%" height="100%" style={{ objectFit: 'contain' }} src={src} alt={title} />}

          {isSTL && (
            <StlViewer
              shadows
              orbitControls
              style={{ border: '1px solid #ddd', width: '100%', height: '70vh' }}
              url={src}
            />
          )}
        </Modal.Body>
      </Modal>
      {showPreview && isImage && <img src={src} alt={title} />}

      {showPreview && isSTL && (
        <StlViewer
          shadows
          orbitControls
          className="stl-viewer"
          url={src}
          modelProps={{
            scale: 2,
            rotationX: 1,
            rotationZ: 3,
          }}
        />
      )}
    </>
  )
}
