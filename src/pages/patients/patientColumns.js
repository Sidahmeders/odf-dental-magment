import { format } from 'date-fns'
import { Trash2, Edit3, Image } from 'react-feather'

import { setPatient } from '../../utils'

import StatusSelector from './StatusSelector'

export const patientColumns = ({ setShowPhotosModal, setShowEditModal, setShowDeleteModal }) => [
  {
    name: 'Nom',
    selector: ({ fullName }) => fullName,
    sortable: true,
    minWidth: '35%',
  },
  {
    name: 'Date de création',
    selector: ({ creationDate }) => format(creationDate, 'yyyy-MM-dd'),
    sortable: true,
    minWidth: '120px',
  },
  {
    name: 'Statut',
    selector: StatusSelector,
    sortable: true,
    sortFunction: ({ status: statusA }, { status: statusB }) => {
      return statusA < statusB
    },
    minWidth: '130px',
  },
  {
    name: 'Actions',
    selector: (row) => {
      const onShowPhotosClick = () => {
        setPatient(row)
        setShowPhotosModal(true)
      }

      const onEditClick = () => {
        setPatient(row)
        setShowEditModal(true)
      }

      const onDeleteClick = () => {
        setPatient(row)
        setShowDeleteModal(true)
      }

      return (
        <div className="actions-cell">
          <Image onClick={onShowPhotosClick} width={20} color="#694" />
          <Edit3 onClick={onEditClick} width={20} color="#474aff" />
          <Trash2 onClick={onDeleteClick} width={20} color="#d00" />
        </div>
      )
    },
    width: '120px',
  },
]
