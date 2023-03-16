import { useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'

import { CREATE_PROFILE_NAMES, FOLLOWUPS } from '../../../config'
import { getBase64 } from '../../../utils'
import { ContextConsumer } from '../../../context'

import Avatar from '../../../components/Avatar/Avatar'

import './ExpandableComponent.scss'

export default function ExpandableComponent({ data }) {
  const { db } = useContext(ContextConsumer)
  const { id, totalPrice, phoneNumber1, phoneNumber2, birthDate, profileImage, creationDate } = data

  const followups = useLiveQuery(
    async () => await db.followups.where({ patientId: id || 0 }).sortBy(FOLLOWUPS.CREATION_DATE),
    [],
    [],
  )
  const totalPayments = followups.reduce(
    (prevPayment, { payment }) => parseInt(prevPayment || 0, 10) + parseInt(payment || 0, 10),
    0,
  )
  const unpaidAmount = totalPrice - totalPayments || totalPrice

  const updateProfileImage = async ({ target }) => {
    const newProfileImage = await getBase64(target?.files?.[0])
    if (newProfileImage) {
      db.patients.update(id, {
        [CREATE_PROFILE_NAMES.PROFILE_IMAGE]: newProfileImage,
      })
    }
  }

  return (
    <div className="expandable-component-container">
      <div className="patient-info">
        <Avatar src={profileImage} accept=".png, .jpg, .jpeg" updateImage={updateProfileImage} />

        <div className="data-item">
          <div>DDN: {format(birthDate, 'yyyy-MM-dd')}</div>
          <div>DDC: {format(creationDate, 'yyyy-MM-dd')}</div>
        </div>

        <div className="data-item">
          <div>
            Télé: {phoneNumber1 || '----'} / {phoneNumber2 || '----'}
          </div>
          <div>
            <span>Total: {totalPrice ? `${totalPrice} DZD` : 'non spécifié'}</span>
            <span> / Reste: {unpaidAmount ? `${unpaidAmount} DZD` : 'non spécifié'}</span>
          </div>
        </div>
      </div>

      <div className="followup-list">
        {followups.map(({ id, creationDate, payment, description }) => (
          <div key={id} style={{ borderBottom: '1px solid #dddd', padding: '5px' }}>
            📅 {format(creationDate, 'yy/MM/dd')} 💸 {payment} DZD 📝 {description?.slice(0, 30) || '...'}
          </div>
        ))}
      </div>
    </div>
  )
}
