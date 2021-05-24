import { useMemo, useState } from 'react';

function usePagination() {

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10,15,20])
  
  const [skipRows, setSkipRows] = useState(0);


  const onNext = () => {
    const current = currentPage + 1;
    setCurrentPage(current + 1);
    setSkipRows(current * rowsPerPage);

    console.log('currentPage', current);
    console.log('skipRows', (current * rowsPerPage));
    console.log('rowsPerPage', rowsPerPage);
  }

  const onPrev = () => {
    const current = Math.max(currentPage - 1, 0);
    setCurrentPage(current);
    setSkipRows(current * rowsPerPage);

    console.log('currentPage', current);
    console.log('skipRows', (current * rowsPerPage));
    console.log('rowsPerPage', rowsPerPage);
  }

  const onChangePage = (newPage: number) => {
    console.log('ir para', newPage);
    (newPage > currentPage) ? onNext() : onPrev();
  }

  const onChangePerPage = (perPage: number) => {
    setRowsPerPage(perPage);
    setSkipRows((currentPage) * perPage);
  }

  return { currentPage, rowsPerPage, rowsPerPageOptions, skipRows, onNext, onPrev, onChangePage, onChangePerPage };

  // const pageCount = useMemo(() => {
  //   return Math.ceil(count / rowsPerPage);
  // }, [count, rowsPerPage]);

  // const pages = useMemo(() => {
  //   const value = Array.from(new Array(pageCount), (_, k) => k + 1);

  //   if (page < 3) {
  //     return value.slice(0, 5);
  //   }

  //   if (pageCount - page < 3) {
  //     return value.slice(-5);
  //   }

  //   return value.slice(page - 3, page + 2);
  // }, [page, pageCount]);

  // const showFirst = useMemo(() => {
  //   return page > 3;
  // }, [page]);

  // const showNext = useMemo(() => {
  //   return pageCount - page > 0;
  // }, [page, pageCount]);

  // const showLast = useMemo(() => {
  //   return pageCount - page > 2;
  // }, [page, pageCount]);

  // const showPages = useMemo(() => {
  //   return pages.length !== 1;
  // }, [pages.length]);

  // const showPagination = useMemo(() => {
  //   return count >= Math.min(...rowsPerPageOptions);
  // }, [count, rowsPerPageOptions]);

  // const showPrevious = useMemo(() => {
  //   return page > 1;
  // }, [page]);

  // return {
  //   pages,
  //   showFirst,
  //   showNext,
  //   showLast,
  //   showPages,
  //   showPagination,
  //   showPrevious
  // };
}

export default usePagination;