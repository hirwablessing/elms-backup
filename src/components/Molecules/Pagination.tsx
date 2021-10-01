import React from 'react';

import Icon from '../Atoms/custom/Icon';
import Indicator from '../Atoms/custom/Indicator';

type PaginationProps = {
  rowsPerPage: number;
  totalRows: number;
  paginate: (_pnber: number) => void;
  currentPage: number;
};
const Pagination = ({
  rowsPerPage,
  totalRows,
  paginate,
  currentPage,
}: PaginationProps) => {
  const pageNumbers = [];

  if (totalRows > rowsPerPage) {
    for (let i = 1; i <= Math.ceil(totalRows / rowsPerPage); i++) {
      pageNumbers.push(i);
    }
  }
  const onNext = () => {
    paginate(currentPage + 1);
  };

  const onPrev = () => {
    paginate(currentPage - 1);
  };

  let lastPage = pageNumbers.length;

  return totalRows > rowsPerPage ? (
    <div className="py-2">
      <nav className="my-2 flex justify-end">
        <ul className="flex pl-0 rounded list-none flex-wrap justify-center">
          <button className="mr-3" onClick={onPrev} disabled={currentPage === 1}>
            <Icon name="left-arrow" size={12} stroke="none" />
          </button>
          <li className="space-x-2">
            {pageNumbers.map((number) => (
              <Indicator
                key={number}
                isCircular={false}
                isActive={currentPage === number}
                hasError={false}
                isComplete={false}
                clicked={() => paginate(number)}>
                {number}
              </Indicator>
            ))}
          </li>
          <button className="ml-3" onClick={onNext} disabled={currentPage === lastPage}>
            <Icon name="right-arrow" size={12} stroke="none" />
          </button>
        </ul>
      </nav>
    </div>
  ) : (
    <></>
  );
};
export default Pagination;
