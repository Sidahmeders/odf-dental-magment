import propTypes from 'prop-types'
import { Form } from 'react-bootstrap'

export default function TextArea({ value, onChange, placeholder }) {
  return (
    <Form.Group controlId="exampleForm.ControlTextarea1">
      <Form.Control value={value} onChange={onChange} placeholder={placeholder} as="textarea" rows={3} />
    </Form.Group>
  )
}

TextArea.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
  placeholder: propTypes.string,
}

TextArea.defaultProps = {
  value: '',
  onChange: () => {},
  placeholder: 'placeholder...',
}
