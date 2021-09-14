import React from 'react';

import { ValueType } from '../../../../types';
import { monthNum } from '../../../../utils/date-helper';
import DropDown from '../Dropdown';

type MProp = {
  year: number;
  value: number;
  onChange: (_e: ValueType) => void;
  defaultValue?: string;
  numeric?: boolean;
  short?: boolean;
  caps?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name: string;
  className?: string;
};

const MonthSelect = (mprops: MProp) => {
  const renderMonthOptions = () => {
    let months = [];
    let month = 12;
    if (mprops.numeric) {
      for (let i = 1; i <= month; ++i) {
        months.push(i.toString());
      }
    } else {
      for (let i = 1; i <= month; ++i) {
        months.push(monthNum[i]);
      }
      if (mprops.caps) {
        months = months.map((month) => {
          return month.toUpperCase();
        });
      }
      if (mprops.short) {
        months = months.map((month) => {
          return month.substring(0, 3);
        });
      }
    }
    const monthOptions: { value: number; label: string }[] = [];
    months.forEach((month, index) => {
      monthOptions.push({ value: index, label: month });
    });
    return monthOptions;
  };

  return (
    <DropDown
      name={mprops.name}
      className={mprops.className}
      options={renderMonthOptions()}
      onChange={(e: ValueType) => mprops.onChange(e)}
    />
  );
};

export default MonthSelect;
