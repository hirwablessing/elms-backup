import React from 'react';

import { ValueType } from '../../../../types';
import DropDown from '../Dropdown';

type MProp = {
  value: number;
  onChange: (_e: ValueType) => void;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  className?: string;
  padding?: number;
};

const HourSelect = (mprops: MProp) => {
  const renderHourOptions = () => {
    let hr = 24;
    const hrOptions: { value: string; label: string }[] = [];
    for (let i = 0; i < hr; ++i) {
      hrOptions.push({
        value: i < 10 ? '0' + i : '' + i,
        label: i < 10 ? '0' + i : '' + i,
      });
    }
    return hrOptions;
  };

  let hours = renderHourOptions();
  let newDefaultValue = hours.find((hour) => hour.value === mprops.defaultValue);

  return (
    <DropDown
      defaultValue={newDefaultValue}
      disabled={mprops.disabled}
      name={mprops.name}
      placeholder={mprops.placeholder}
      padding={mprops.padding}
      width={mprops.width}
      className={mprops.className}
      options={renderHourOptions()}
      handleChange={(e: ValueType) => mprops.onChange(e)}
    />
  );
};

export default HourSelect;
