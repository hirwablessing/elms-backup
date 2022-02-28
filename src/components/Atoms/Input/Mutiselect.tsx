import React, { useMemo, useRef, useState } from 'react';

import { MultiselectProps, SelectData } from '../../../types';
import { randomString } from '../../../utils/random';
import Icon from '../custom/Icon';

export default function Multiselect({
  handleChange,
  name,
  placeholder,
  options,
  className = '',
  disabled = false,
  required = true,
  loading = false,
  value = [],
  hasError = false,
  width = '80',
}: MultiselectProps) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const [searchQuery, setsearchQuery] = useState('');
  const [filtered, setfiltered] = useState<SelectData[]>(options);

  const input = useRef<HTMLInputElement>(null);

  const handleSelect = (value: string) => {
    if (internalValue.includes(value)) {
      //remove from select items
      setInternalValue(internalValue.filter((val) => val != value));
    } else {
      setInternalValue([...internalValue, value]);
    }
    handleChange({ name, value: internalValue });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchQuery(e.target.value);
    setfiltered(
      options.filter((op) =>
        op.label.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
      ),
    );
  };

  let selectId = useMemo(() => randomString(16), []);

  return (
    <div className={`w-${width || 'full'} ${className}`}>
      <div>
        <div className="relative hover:border-primary-400">
          {/* hidden input */}
          <input
            type="text"
            name={name}
            value={internalValue}
            required={required}
            onChange={(_e) => {}}
            onFocus={() => input.current?.focus()}
            className="border-none focus:outline-none absolute w-full top-0 text-white h-0 placeholder-black"
            style={{ zIndex: -10 }}
          />
          {/* input with placeholder */}
          <input
            disabled={disabled}
            ref={input}
            value={searchQuery}
            onFocus={() => setisMenuOpen(true)}
            placeholder={placeholder || `Select ${name}`}
            onChange={handleSearch}
            id={selectId}
            onBlur={() => setisMenuOpen(false)}
            className={`block w-full hover:border-primary-400 placeholder-${
              internalValue ? 'black' : 'txt-secondary'
            } h-12 text-sm border-2 border-${
              hasError ? 'error-500' : 'tertiary'
            }  rounded-md px-4 focus:border-primary-500 focus:outline-none font-normal cursor-pointer`}
          />
          {/* 
            // type="button"
            // onMouseDown={handleArrowClick}
            // className="inline absolute top-0 right-0 cursor-pointer"> */}
          <label
            htmlFor={selectId}
            className="inline absolute top-0 right-0 cursor-pointer">
            <Icon name={'chevron-down'} />
          </label>
        </div>
        {/* Dropdown menu */}
        <div
          className={`${
            isMenuOpen ? 'relative' : 'hidden'
          } w-full p-0 m-0 pt-2 bg-white z-10`}>
          <div
            className="py-1 origin-top max-h-60 overflow-y-auto overflow-x-hidden absolute w-full rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-0 m-0"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button">
            <div className="static">
              {filtered.map((op) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={op.value}
                  onMouseDown={() => handleSelect(op.value.toString())}
                  className={`py-2 cursor-pointer ${
                    internalValue.includes(op.value.toString())
                      ? 'bg-primary-500 text-white'
                      : 'bg-main text-black hover:bg-blue-100'
                  } rounded-none text-left px-4 text-base capitalize`}>
                  {op.label}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="py-2 text-left px-4 text-base text-gray-500">
                  {loading ? 'loading...' : 'No options available'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
