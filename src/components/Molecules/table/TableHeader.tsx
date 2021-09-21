import React from 'react';

import { ValueType } from '../../../types';
import Badge from '../../Atoms/custom/Badge';
import Icon from '../../Atoms/custom/Icon';
import Heading from '../../Atoms/Text/Heading';
import SearchMolecule from '../input/SearchMolecule';

type ITableHeader = {
  title: string;
  totalItems: number;
  children: React.ReactNode;
  handleSearch: (_e: ValueType) => void;
};

export default function TableHeader({
  title,
  totalItems,
  handleSearch,
  children,
}: ITableHeader) {
  const handleChange = (e: ValueType) => {
    handleSearch(e);
  };

  return (
    <div className="mt-11 pb-6">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex gap-2 items-center">
          <Heading className="capitalize" fontSize="2xl" fontWeight="bold">
            {title}
          </Heading>
          <Badge
            badgetxtcolor="main"
            badgecolor="primary"
            fontWeight="normal"
            className="h-6 w-9 flex justify-center items-center">
            {totalItems}
          </Badge>
        </div>
        <div className="flex flex-wrap justify-start items-center">
          <SearchMolecule handleChange={handleChange} />
          <button className="border p-0 rounded-md mx-2">
            <Icon name="filter" />
          </button>
        </div>
        <div className="flex gap-3">{children}</div>
      </div>
    </div>
  );
}