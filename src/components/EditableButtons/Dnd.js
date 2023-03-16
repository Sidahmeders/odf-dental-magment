import { useDrag, useDrop } from 'react-dnd'

const DND_TYPE = 'BUTTON'

export const DragWrapper = ({ id, children }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: DND_TYPE,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <span ref={dragRef} className={`drag-wrapper ${isDragging ? 'dragging' : ''}`}>
      {children}
    </span>
  )
}

export const DropZone = ({ setTemplateButtons, getTemplateButtons, dropTemplateButton }) => {
  const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
    accept: DND_TYPE,
    drop: ({ id }) => {
      dropTemplateButton(id)
      setTemplateButtons(getTemplateButtons())
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }))

  return (
    <div ref={dropRef} className="drop-zone">
      {canDrop && isOver ? 'relâchez pour supprimer' : 'déposer boutons ici'}
    </div>
  )
}
