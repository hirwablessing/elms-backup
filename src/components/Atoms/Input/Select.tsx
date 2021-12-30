import React, { useEffect, useRef, useState } from 'react';

import { SelectProps } from '../../../types';
import Icon from '../custom/Icon';

export default function Select({
  handleChange,
  name,
  placeholder,
  options = [],
  className = '',
  disabled = false,
  required = true,
  loading = false,
  value = '',
  hasError = false,
  width = '80',
}: SelectProps) {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const [searchQuery, setsearchQuery] = useState('');
  const [filtered, setfiltered] = useState(options || []);

  const input = useRef<HTMLInputElement>(null);

  const [_placeholder, setPlaceholder] = useState(
    placeholder || `Select ${name.replace('_', ' ').toLocaleLowerCase()}`,
  );

  useEffect(() => {
    setPlaceholder(
      (internalValue.length > 0 &&
        options.find((op) => op.value === internalValue)?.label) ||
        _placeholder ||
        `Select ${name}`,
    );
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    setPlaceholder(
      (value.length > 0 && options.find((op) => op.value === value)?.label) ||
        _placeholder ||
        `Select ${name}`,
    );
  }, [options]);

  const handleSelect = (value: string) => {
    setInternalValue(value);
    handleChange({ name, value });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchQuery(e.target.value);
    setfiltered(
      options.filter((op) =>
        op.label.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
      ),
    );
  };

  const handleArrowClick = () => {
    if (document.activeElement === input.current) {
      input.current?.blur();
    } else {
      input.current?.focus();
    }
  };

  return (
    <div className={`w-${width || 'full'} ${className}`}>
      <div>
        <div className="relative">
          {/* hidden input */}
          <input
            type="text"
            name={name}
            value={internalValue}
            required={required}
            onChange={(_e) => {}}
            onFocus={() => input.current?.focus()}
            className="border-none focus:outline-none absolute w-full top-0 text-white h-0"
            style={{ zIndex: -10 }}
          />
          {/* input with placeholder */}
          <input
            ref={input}
            value={searchQuery}
            onFocus={() => setisMenuOpen(true)}
            placeholder={_placeholder}
            onChange={handleSearch}
            onBlur={() => setisMenuOpen(false)}
            className={`block w-full hover:border-primary-400 placeholder-${
              internalValue ? 'black' : 'txt-secondary'
            } h-12 text-sm border-2 border-${
              hasError ? 'error-500' : 'tertiary'
            }  rounded-md px-4 focus:border-primary-500 focus:outline-none font-medium cursor-pointer`}
          />
          <button
            type="button"
            onMouseDown={handleArrowClick}
            className="inline absolute top-0 right-0 cursor-pointer">
            <Icon name={'chevron-down'} />
          </button>
        </div>
        {/* Dropdown menu */}
        <div
          className={`${
            isMenuOpen ? 'relative' : 'hidden'
          } w-full p-0 m-0 pt-2 bg-white z-10`}>
          <div
            className="py-1 origin-top absolute w-full rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-0 m-0"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button">
            <div className="static">
              {filtered.map((op) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={op.value}
                  onMouseDown={() => handleSelect(op.value)}
                  className={`py-2 cursor-pointer ${
                    value == op.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-main text-black hover:bg-blue-100'
                  } rounded-none text-left px-4 text-base font-medium capitalize`}>
                  {op.label}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="py-2 text-left px-4 text-base text-gray-500 font-medium">
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