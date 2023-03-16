import propTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import './DatePicker.scss'

export default function DatePicker({ label, value, onChange, inputFormat, views, className }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        className={className}
        inputFormat={inputFormat}
        views={views}
        label={label}
        value={value}
        onChange={(newValue) => {
          if (onChange) {
            onChange(newValue)
          }
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}

DatePicker.propTypes = {
  value: propTypes.instanceOf(Date),
  label: propTypes.string,
  onChange: propTypes.func,
  inputFormat: propTypes.string,
  views: propTypes.arrayOf(propTypes.string),
  className: propTypes.string,
}

DatePicker.defaultProps = {
  value: new Date(),
  label: '',
  onChange: () => {},
  inputFormat: 'yyyy/MM/dd',
  views: ['year', 'month', 'day'],
  className: 'desktop-date-picker',
}
