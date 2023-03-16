import { Button } from 'react-bootstrap'

import SearchBar from '../../../components/Searchbar/Searchbar'
import InlineCheckboxes from '../../../components/form/Checkboxes/InlineCheckboxes'

import './TableHeaderComponent.scss'

export default function TableHeaderComponent({
  onFilter,
  onClear,
  filterText,
  filterCheckboxes,
  setFilterCheckboxes,
  handleShow,
}) {
  return (
    <div className="table-header">
      <div className="filters-container">
        <InlineCheckboxes checkboxes={filterCheckboxes} setCheckboxes={setFilterCheckboxes} />
      </div>

      <div className="search-create">
        <SearchBar onFilter={onFilter} onClear={onClear} filterText={filterText} />
        <Button className="create-profile-btn" onClick={handleShow}>
          Créer profil
        </Button>
      </div>
    </div>
  )
}
