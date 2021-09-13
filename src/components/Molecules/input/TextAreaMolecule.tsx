import React from 'react';

import { ValueType } from '../../../types';
import Textarea from '../../Atoms/Input/Textarea';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../atoms/Text/ILabel';

type IError = {
  name: string;
  value: string;
  handleChange: (_e: ValueType) => void;
  children: React.ReactNode;
  error?: string;
  placeholder?: string;
  type?: string;
};
export default function TextAreaMolecule({
  name,
  value,
  handleChange,
  children,
  error = '',
  placeholder = '',
  type = 'text',
}: IError) {
  return (
    <div className="flex flex-col gap-3">
      <ILabel weight="bold">{children}</ILabel>
      <Textarea
        name={name}
        placeholder={placeholder}
        fcolor={error ? 'error' : undefined}
        type={type}
        value={value}
        /* @ts-ignore */
        handleChange={handleChange}
      />
      <Error>{error && error}</Error>
    </div>
  );
}
