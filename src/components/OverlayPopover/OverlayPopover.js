import propTypes from 'prop-types'
import { OverlayTrigger, Popover, Button } from 'react-bootstrap'

export default function OverlayPopover({ placement, PopoverBody, OverlayBody }) {
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      key={placement}
      placement={placement}
      overlay={
        <Popover id={`popover-positioned-${placement}`}>
          <Popover.Body>{PopoverBody}</Popover.Body>
        </Popover>
      }>
      <Button style={{ textDecoration: 'none' }} variant="link">
        {OverlayBody}
      </Button>
    </OverlayTrigger>
  )
}

OverlayPopover.propTypes = {
  PopoverBody: propTypes.node.isRequired,
  OverlayBody: propTypes.node.isRequired,
  placement: propTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

OverlayPopover.defaultProps = {
  placement: 'top',
}
