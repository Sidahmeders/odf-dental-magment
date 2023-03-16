import React, { useCallback, useRef, useState, useEffect, useContext } from 'react'
import { useSwipeable } from 'react-swipeable'
import PropTypes from 'prop-types'
import { Calendar as BigCalendar, DateLocalizer, dateFnsLocalizer } from 'react-big-calendar'
import { useLiveQuery } from 'dexie-react-hooks'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { registerLocale } from 'react-datepicker'
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

import { ContextConsumer } from '../../context'

import AddEventModal from '../../components/modals/AddEventModal/AddEventModal'
import DisplayEventModal from '../../components/modals/DisplayEventModal'
import CustomToolbar from './CustomToolbar'

import './Calendar.scss'

const DnDCalendar = withDragAndDrop(BigCalendar)

const messages = {
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Evenement',
}

const fnslocalizer = dateFnsLocalizer({
  format,
  parse,
  getDay,
  locales: { fr: fr },
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
})

registerLocale(fr)

export default function Calendar({ localizer = fnslocalizer, ...props }) {
  const { db } = useContext(ContextConsumer)
  const events = useLiveQuery(async () => await db.events.toArray(), [], [])
  const patientsData = useLiveQuery(async () => await db.patients.toArray(), [], [])

  const eventsData = events.map((item) => {
    const { fullName } = patientsData.find((patient) => patient.id === item.patientId) || {}
    const title = `${fullName?.slice(0, 6) || '#'} / ${item.title}`
    return { ...item, title, fullName, eventName: item.title }
  })

  const clickRef = useRef(null)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({})

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setSelectedDate(addMonths(selectedDate, 1)),
    onSwipedRight: () => setSelectedDate(subMonths(selectedDate, 1)),
  })

  const showMoreDetails = (message) => {
    const { fullName, eventName } = message
    setSelectedEvent({ ...message, title: `${fullName} / ${eventName} ` })
  }

  const onSelectEvent = useCallback((callEvent) => {
    /**
     * Here we are waiting 250 milliseconds (use what you want) prior to firing
     * our method. Why? Because both 'click' and 'doubleClick'
     * would fire, in the event of a 'doubleClick'. By doing
     * this, the 'click' handler is overridden by the 'doubleClick'
     * action.
     */
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onSelectEvent'), 250)
    setShowEventModal(true)
  }, [])

  const onDoubleClickEvent = useCallback((callEvent) => {
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onDoubleClickEvent'), 250)
    setShowEventModal(true)
  }, [])

  const onSelectSlot = useCallback((slotInfo) => {
    /**
     * Here we are waiting 250 milliseconds (use what you want) prior to firing
     * our method. Why? Because both 'click' and 'doubleClick'
     * would fire, in the event of a 'doubleClick'. By doing
     * this, the 'click' handler is overridden by the 'doubleClick'
     * action.
     */
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => 'TODO', 250)
    setSelectedSlotInfo(slotInfo)
    setShowAddEventModal(true)
  }, [])

  const onEventDrop = ({ event, start, end }) => {
    db.events.update(event.id, { start, end })
  }

  useEffect(() => {
    /**
     * What Is This?
     * This is to prevent a memory leak, in the off chance that you
     * teardown your interface prior to the timed method being called.
     */
    return () => {
      clearTimeout(clickRef?.current)
    }
  }, [])

  const ToolbarComponent = (props) => <CustomToolbar setSelectedDate={setSelectedDate} {...props} />

  return (
    <div {...swipeHandlers} className="calendar-container" {...props}>
      <DisplayEventModal
        selectedEvent={selectedEvent}
        showModal={showEventModal}
        handleClose={() => setShowEventModal(false)}
      />

      <AddEventModal
        selectedSlotInfo={selectedSlotInfo}
        showModal={showAddEventModal}
        handleClose={() => setShowAddEventModal(false)}
      />

      <DnDCalendar
        selectable
        culture="fr"
        localizer={localizer}
        events={eventsData}
        components={{ toolbar: ToolbarComponent }}
        date={selectedDate}
        onNavigate={(date) => setSelectedDate(date)}
        min={new Date(1972, 0, 1, 8, 0, 59)}
        step={30}
        views={['month', 'day', 'agenda']}
        messages={messages}
        onSelectEvent={onSelectEvent}
        onDoubleClickEvent={onDoubleClickEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
      />
    </div>
  )
}

Calendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}
