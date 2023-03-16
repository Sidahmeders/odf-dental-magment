import { useState } from 'react'
import { useController } from 'react-hook-form'
import { Form } from 'react-bootstrap'

export default function Checkboxes({ options, initialValue, name, control, className }) {
  const { field } = useController({ name, control })
  const [checkboxValue, setCheckboxValue] = useState(initialValue)

  const changeHandler = (e) => {
    const { value, checked } = e.target
    let checkboxValueCopy = [...checkboxValue]

    if (checked && !checkboxValueCopy?.includes(value)) {
      checkboxValueCopy = [...checkboxValueCopy, value]
    } else {
      checkboxValueCopy = checkboxValueCopy.filter((item) => item !== value)
    }

    field.onChange(checkboxValueCopy)
    setCheckboxValue(checkboxValueCopy)
  }

  return (
    <div key="inline-radio" className={className}>
      {options.map(({ label, name: optionName }) => (
        <Form.Check
          inline
          key={optionName}
          id={optionName}
          label={label}
          checked={field?.value?.includes(optionName)}
          onChange={changeHandler}
          type="checkbox"
          value={optionName}
        />
      ))}
    </div>
  )
}
