import React, { FormEvent } from 'react';

import { CommonFormProps, SelectData, ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface PropType<K> extends CommonFormProps<K> {}

export default function NewModuleForm<E>({ onSubmit }: PropType<E>) {
  const programs: SelectData[] = [
    { value: 'Caddette Program', label: 'Caddette Program' },
    { value: 'Senior Program', label: 'Senior Program' },
  ];

  function handleChange(e: ValueType) {
    console.log(e);
  }

  function submitForm(e: FormEvent) {
    e.preventDefault(); // prevent page to reload:
    if (onSubmit) onSubmit(e);
  }

  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      <InputMolecule value="" error="" handleChange={handleChange} name="model-name">
        Module name
      </InputMolecule>
      {/* model code
    <InputMolecule
      value=""
      error=""
      handleChange={handleChange}
      name="model-name">
      Module code
    </InputMolecule> */}
      {/* module description */}
      <TextAreaMolecule value="" name="description" handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      <DropdownMolecule name="radio" handleChange={handleChange} options={programs}>
        Program
      </DropdownMolecule>
      {/* model initial status
      <RadioMolecule
        className="mt-4"
        value="ACTIVE"
        name="status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
        handleChange={handleChange}>
        Status
      </RadioMolecule>
      {/* model has prerequesit */}
      <RadioMolecule
        className="mt-4"
        name="prerequsites"
        options={[
          { label: 'Yes', value: 'YES' },
          { label: 'No', value: 'NO' },
        ]}
        handleChange={handleChange}>
        Has Prerequesites
      </RadioMolecule>
      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full>
          Save
        </Button>
      </div>
    </form>
  );
}
