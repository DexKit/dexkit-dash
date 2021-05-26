import { useState } from 'react';

function usePagination() {

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10, 20, 30]);
  const [skipRows, setSkipRows] = useState(0);

  const onChangePage = (page: number) => {
    const current = Math.max(page, 0);
    setCurrentPage(current);
    setSkipRows(current * rowsPerPage);
    console.log('setCurrentPage', current);
    console.log('setSkipRows', (current * rowsPerPage));
  }

  const onChangeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setSkipRows(currentPage * rows);
    console.log('setRowsPerPage', rows);
    console.log('setSkipRows', (currentPage * rowsPerPage));
  }

  return { currentPage, rowsPerPage, skipRows, rowsPerPageOptions, onChangePage, onChangeRowsPerPage };
}

export default usePagination;