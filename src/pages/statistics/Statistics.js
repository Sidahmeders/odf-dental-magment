import { useContext, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import RangeDatePicker from '../../components/form/DatePicker/RangeDatePicker'
import { subDays, differenceInCalendarYears } from 'date-fns'

import { FOLLOWUPS, CREATE_PROFILE_NAMES, MILLISECONDS } from '../../config'
import { ContextConsumer } from '../../context'

import { PieChart, DoughChart, PolarAreaChart } from '../../components/charts'
import Percentage from '../../components/charts/Percentage'
import Title from '../../components/charts/Title'
import OverlayPopover from '../../components/OverlayPopover/OverlayPopover'

import './Statistics.scss'

export default function Statistics() {
  const { db } = useContext(ContextConsumer)
  const [dateRangeValue, setDateRangeValue] = useState([subDays(new Date(), 30), new Date()])
  const [startDate, endDate] = dateRangeValue.map((date) => new Date(date).getTime())

  const followups = useLiveQuery(
    async () =>
      await db.followups
        .where(FOLLOWUPS.CREATION_DATE)
        .between(startDate, endDate + MILLISECONDS.DAY)
        .toArray(),
    [dateRangeValue],
    [],
  )
  const patients = useLiveQuery(
    async () =>
      await db.patients
        .where(CREATE_PROFILE_NAMES.CREATION_DATE)
        .between(startDate, endDate + MILLISECONDS.DAY)
        .toArray(),
    [dateRangeValue],
    [],
  )

  const totalAmount = patients.reduce((prev, { totalPrice }) => parseInt(prev || 0) + parseInt(totalPrice || 0), 0)
  const totalPayments = followups.reduce((prev, { payment }) => parseInt(prev || 0, 10) + parseInt(payment || 0, 10), 0)
  const unPaidAmmount = totalAmount - totalPayments

  const paymentsData = {
    labels: ['paiement reste', 'paiement reçu'],
    datasets: [
      {
        backgroundColor: ['#928', '#448'],
        data: [unPaidAmmount, totalPayments],
      },
    ],
  }

  const patientsKeyValues = patients.reduce(
    (prev, { birthDate }) => {
      const patientAge = differenceInCalendarYears(new Date(), birthDate)
      if (patientAge < 18) {
        return { ...prev, teen: prev.teen + 1 }
      } else if (patientAge >= 18 && patientAge < 28) {
        return { ...prev, adult: prev.adult + 1 }
      } else if (patientAge >= 28 && patientAge < 40) {
        return { ...prev, mature: prev.mature + 1 }
      }
      return { ...prev, older: prev.older + 1 }
    },
    { teen: 0, adult: 0, mature: 0, older: 0 },
  )
  const patientsData = {
    labels: ['10-18', '18-28', '28-40', '40++'],
    datasets: [
      {
        backgroundColor: ['#08f', '#04d', '#456', '#012'],
        data: Object.values(patientsKeyValues),
      },
    ],
  }

  const urgentPatientsCount = patients.reduce((prev, { isUrgent }) => (isUrgent ? prev + 1 : prev), 0)
  const statusKeyValues = patients.reduce(
    (prev, { status }) => {
      status.forEach((key) => {
        if (prev[key]) {
          prev[key]++
        } else {
          prev[key] = 1
        }
      })
      return prev
    },
    { Collage: 0, EnCours: 0, Debr: 0, Fini: 0, Urgent: urgentPatientsCount },
  )
  const statusesData = {
    labels: Object.keys(statusKeyValues),
    datasets: [
      {
        backgroundColor: ['#fc272799', '#7b30f399', '#ceb23799', '#007a5299', '#f00'],
        data: Object.values(statusKeyValues),
      },
    ],
  }

  return (
    <div className="statistics-container">
      <RangeDatePicker rangeValue={dateRangeValue} onChange={(newValue) => setDateRangeValue(newValue)} />
      <div className="statistics-charts">
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '45%', left: '30%' }}>
            total: <span style={{ color: '#26d', fontWeight: 'bold' }}>{totalAmount}</span>
          </div>
          <DoughChart data={paymentsData} />
          <OverlayPopover
            placement="top"
            OverlayBody={<Title label="Paiements" />}
            PopoverBody={<Percentage labels={paymentsData.labels} data={paymentsData.datasets[0].data} />}
          />
        </div>

        <div>
          <PolarAreaChart data={statusesData} />
          <OverlayPopover
            placement="top"
            OverlayBody={<Title label="Status" />}
            PopoverBody={<Percentage labels={statusesData.labels} data={statusesData.datasets[0].data} />}
          />
        </div>

        <div>
          <PieChart data={patientsData} />
          <OverlayPopover
            placement="top"
            OverlayBody={<Title label="Patients âge" />}
            PopoverBody={<Percentage labels={patientsData.labels} data={patientsData.datasets[0].data} />}
          />
        </div>
      </div>
    </div>
  )
}
