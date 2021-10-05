import React from 'react';

import { SelectData, ValueType } from '../../../../types';
import DropDown from '../Dropdown';

interface YProp extends YOptProp {
  value: number;
  onChange: Function;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  reverse?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  padding?: number;
}

interface YOptProp {
  start?: number;
  end?: number;
  defaultValue?: string;
}

const YearSelect = (props: YProp) => {
  const renderYearOptions = ({
    start = 1910,
    end = new Date().getFullYear(),
  }: YOptProp) => {
    let years = [];
    if (start <= end) {
      for (let i = start; i <= end; ++i) {
        years.push(i);
      }
    } else {
      for (let i = end; i >= start; --i) {
        years.push(i);
      }
    }
    if (props.reverse) {
      years.reverse();
    }
    const yearOptions: SelectData[] = [];
    years.forEach((year) => {
      yearOptions.push({ value: year + '', label: year + '' });
    });
    return yearOptions;
  };

  let years = renderYearOptions({
    start: props.start,
    end: props.end,
  });

  let newDefaultValue = years.find((year) => year.label === props.defaultValue);

  return (
    <DropDown
      disabled={props.disabled}
      name={props.name}
      placeholder={props.placeholder}
      className={props.className}
      options={years}
      padding={props.padding}
      defaultValue={newDefaultValue}
      width={props.width}
      handleChange={(e: ValueType) => props.onChange(e)}
    />
  );
};

export default YearSelect;
