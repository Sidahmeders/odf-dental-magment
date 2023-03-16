import { useState } from 'react'
import propTypes from 'prop-types'
import ReactDataTableComponent from 'react-data-table-component'
import { PropagateLoader } from 'react-spinners'
import { ChevronDown } from 'react-feather'

import './DataTable.scss'

const defaultStyles = {
  progress: {
    style: {
      transform: 'translateY(12rem)',
      zIndex: '9',
    },
  },
}

export default function DataTable({
  columns,
  data,
  loading,
  onRowDoubleClicked,
  expandableRowsComponent,
  subHeaderComponent,
  paginationResetDefaultPage,
}) {
  const PAGINATION_ROWS_PER_PAGE_OPTIONS = [50, 75, 100, 150, 200, 500, 1000]
  const [currentRow, setCurrentRow] = useState(null)
  const [paginationPerPage, setPaginationPerPage] = useState(PAGINATION_ROWS_PER_PAGE_OPTIONS[0])

  return (
    <div className="data-table-container">
      <ReactDataTableComponent
        pagination
        striped
        highlightOnHover
        pointerOnHover
        subHeader
        expandableRows
        className="data-table"
        customStyles={defaultStyles}
        progressPending={loading}
        progressComponent={<PropagateLoader color="#474aff" />}
        data={data}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
        onChangeRowsPerPage={(currentRowsPerPage) => setPaginationPerPage(currentRowsPerPage)}
        columns={columns}
        paginationResetDefaultPage={paginationResetDefaultPage}
        subHeaderComponent={subHeaderComponent}
        sortIcon={<ChevronDown />}
        expandableRowExpanded={(row) => row === currentRow}
        onRowExpandToggled={(_, row) => setCurrentRow(row)}
        expandableRowsComponent={expandableRowsComponent}
        onRowDoubleClicked={onRowDoubleClicked}
      />
      <span className="data-table-counter">{data.length}</span>
    </div>
  )
}

DataTable.propTypes = {
  columns: propTypes.arrayOf(propTypes.any).isRequired,
  data: propTypes.arrayOf(propTypes.any).isRequired,
  subHeaderComponent: propTypes.node.isRequired,
  loading: propTypes.bool,
  paginationResetDefaultPage: propTypes.bool,
  onRowDoubleClicked: propTypes.func,
  expandableRowsComponent: propTypes.func,
}

DataTable.defaultProps = {
  loading: false,
  paginationResetDefaultPage: false,
  onRowDoubleClicked: () => {},
  expandableRowsComponent: () => {},
}
