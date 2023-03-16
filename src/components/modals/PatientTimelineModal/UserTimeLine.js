import { useState } from 'react'
import { Image, GitMerge, XCircle } from 'react-feather'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import EditableLabel from 'react-editable-label'
import { format } from 'date-fns'

import { guid } from '../../../utils'

import 'react-vertical-timeline-component/style.min.css'
import './PatientTimelineModal.scss'

const ORIGINAL_ICON_STYLES = { color: '#fff', background: '#474' }
const ORIGINAL_ARROW_STYLES = { borderRight: '7px solid #474' }
const ORIGINAL_CONTENT_STYLES = { color: '#fff', background: '#474' }

const BLUE_ICON_STYLES = { color: '#fff', background: '#234' }
const BLUE_ARROW_STYLES = { borderRight: '7px solid #234' }
const BLUE_CONTENT_STYLES = { color: '#fff', background: '#234' }

export default function UserTimeLine({ visits, setVisits, keysToDelete, setKeysToDelete }) {
  const [showImages, setShowImages] = useState(visits.reduce((prev, { id }) => ({ ...prev, [id]: false }), {}))

  const updateVisitDescription = (visitId, newValue) => {
    const updatedVisits = visits.map((visit) =>
      visit.id === visitId ? { ...visit, id: guid(), description: newValue } : visit,
    )
    setVisits(updatedVisits)
    setKeysToDelete([...keysToDelete, visitId])
  }

  return (
    <VerticalTimeline>
      {visits.map(({ id, description, payment, lastPayments, creationDate, image }) => {
        return (
          <VerticalTimelineElement
            key={id}
            className="vertical-timeline-element--work"
            contentStyle={image ? ORIGINAL_CONTENT_STYLES : BLUE_CONTENT_STYLES}
            contentArrowStyle={image ? ORIGINAL_ARROW_STYLES : BLUE_ARROW_STYLES}
            iconStyle={image ? ORIGINAL_ICON_STYLES : BLUE_ICON_STYLES}
            icon={showImages[id] && image ? <Image /> : <GitMerge />}
            iconOnClick={() =>
              setShowImages({
                ...showImages,
                [id]: !showImages[id],
              })
            }>
            <span style={{ position: 'absolute', right: '5px', top: '5px', zIndex: '99', cursor: 'pointer' }}>
              <XCircle
                height="2rem"
                width="2rem"
                onClick={() => {
                  setVisits(visits.filter((visit) => visit.id !== id))
                  setKeysToDelete([...keysToDelete, id])
                }}
              />
            </span>

            {showImages[id] && image ? (
              <img width="100%" src={image} alt="progressPhoto" />
            ) : (
              <>
                <p className="creationDate">{format(creationDate, 'yyyy MM dd / hh:mm')}</p>
                <h5>
                  <EditableLabel
                    inputClass="description"
                    initialValue={description || '### ### ###'}
                    save={(newValue) => updateVisitDescription(id, newValue)}
                  />
                </h5>
                <p className="payment">
                  Versment: <span>{payment || '0.00'} DZD</span>
                </p>
                <p className="total-payment">
                  Paiement total: <span>{lastPayments || payment || '0.00'} DZD</span>
                </p>
              </>
            )}
          </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}
