import propTypes from 'prop-types'

import './RadioInputElement.scss'

export default function RadioInputElement({ name, options, onChange }) {
  return (
    <div className="radio-input-container">
      <div className="options">
        {options.map(({ label, value }, index) => (
          <div className="option" key={index}>
            <input
              type="radio"
              id={value}
              name={name}
              value={value}
              onClick={(e) => {
                onChange(e.target.value)
              }}
            />
            <label htmlFor={value}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

RadioInputElement.propTypes = {
  name: propTypes.string.isRequired,
  options: propTypes.arrayOf(propTypes.objectOf(propTypes.any)),
  onChange: propTypes.func,
}

RadioInputElement.defaultProps = {
  options: [{}],
  onChange: () => {},
}
