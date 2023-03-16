import propTypes from 'prop-types'

import './InputElement.scss'

export default function InputElement({ required, type, label, value, onChange, style }) {
  const isEmptyValue = !value?.trim().length && required

  return (
    <div className="input-element-container">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label ? label : 'text-input-element'}
        className={isEmptyValue ? 'empty' : ''}
        min={0}
        spellCheck="false"
        style={style}
      />
    </div>
  )
}

InputElement.propTypes = {
  required: propTypes.bool,
  type: propTypes.string,
  label: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func,
}

InputElement.defaultProps = {
  required: false,
  type: 'text',
  label: '',
  value: '',
  onChange: () => {},
}
