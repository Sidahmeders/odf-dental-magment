import { useContext, forwardRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Phone, MapPin } from 'react-feather'
import { format, differenceInCalendarYears, parseISO } from 'date-fns'

import { FOLLOWUPS } from '../../../../config'
import { ContextConsumer } from '../../../../context'

import './ComponentToPrint.scss'

const ComponentToPrint = forwardRef((props, ref) => {
  const { db } = useContext(ContextConsumer)
  const { selectedPatient } = props
  const { id: patientId, fullName, birthDate, totalPrice } = selectedPatient

  const followups = useLiveQuery(
    async () => await db.followups.where({ patientId: patientId || 0 }).sortBy(FOLLOWUPS.CREATION_DATE),
    [],
    [],
  )

  const currentDate = format(new Date(), 'dd/MM/yyyy')
  const patientAge = differenceInCalendarYears(new Date(), parseISO(birthDate))
  const totalPayments = followups.reduce(
    (prevPayment, { payment }) => parseInt(prevPayment || 0, 10) + parseInt(payment || 0, 10),
    0,
  )
  const unPaidAmount = totalPrice - totalPayments

  return (
    <div ref={ref} className="component-to-print-container">
      <h2 className="title">Dr. Deghmine M.A</h2>
      <h5>Date: {currentDate}</h5>
      <h5 className="fullName">
        Nom: <span style={{ fontWeight: 'bold' }}>{fullName}</span> Âge:{' '}
        <span style={{ fontWeight: 'bold' }}>{patientAge}</span>
      </h5>

      <div>
        <h5 className="sum">
          <div>Total:</div>
          <div>{totalPrice} DZD</div>
        </h5>

        {totalPayments && (
          <h5 className="sum">
            <div>Reçu:</div>
            <div>{totalPayments} DZD</div>
          </h5>
        )}

        {unPaidAmount && (
          <h5 className="sum">
            <div>Reste:</div>
            <div>{unPaidAmount} DZD</div>
          </h5>
        )}

        <table className="payment-table">
          <tbody>
            <tr>
              <th>date</th>
              <th>description</th>
              <th>montant</th>
            </tr>
            {followups.map(({ id: paymentId, creationDate, payment, description }) => (
              <tr key={paymentId}>
                <td>{format(creationDate, 'yy/MM/dd')}</td>
                <td>{description}</td>
                <td>{payment || '0.00'} DZD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details">
        <h5>
          <Phone /> : +213 661 42 44 43
        </h5>
        <h5>
          <MapPin /> : 587J+4P5, Chlef
        </h5>
      </div>
    </div>
  )
})

ComponentToPrint.displayName = 'ComponentToPrint'

export default ComponentToPrint
