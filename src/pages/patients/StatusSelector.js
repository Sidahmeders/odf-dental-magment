import { AlertCircle } from 'react-feather'

import OverlayPopover from '../../components/OverlayPopover/OverlayPopover'

export default function StatusSelector({ status, isUrgent }) {
  const PopoverBody = status.map((item) => (
    <div key={item} className={item?.toLowerCase()}>
      {item}
    </div>
  ))

  const OverlayBody = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {status.map((item) => (
        <span key={item} className={`${item?.toLowerCase()}-circle`}></span>
      ))}
      {isUrgent && (
        <div style={{ marginLeft: '6px' }}>
          <AlertCircle color="red" />
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <OverlayPopover placement="top" PopoverBody={PopoverBody} OverlayBody={OverlayBody} />
    </div>
  )
}
