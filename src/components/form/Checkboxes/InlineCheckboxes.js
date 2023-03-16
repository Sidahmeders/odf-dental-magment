import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

export default function InlineCheckboxes({ checkboxes, setCheckboxes, className }) {
  const handleCheckboxChange = (e) => {
    const { name: targetName } = e.target

    const newCheckboxes = checkboxes.map((item) =>
      item.name === targetName
        ? {
            ...item,
            isChecked: !item.isChecked,
          }
        : item,
    )

    setCheckboxes(newCheckboxes)
  }

  return (
    <div key="inline-radio" className={className}>
      {checkboxes.map(({ name, label, isChecked }) => (
        <Form.Check
          inline
          label={label}
          name={name}
          key={name}
          id={name}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      ))}
    </div>
  )
}

InlineCheckboxes.propTypes = {
  checkboxes: PropTypes.arrayOf(PropTypes.any),
  setCheckboxes: PropTypes.func,
  className: PropTypes.string,
}

InlineCheckboxes.defaultProps = {
  checkboxes: [],
  setCheckboxes: () => {},
  className: 'radio-group',
}
