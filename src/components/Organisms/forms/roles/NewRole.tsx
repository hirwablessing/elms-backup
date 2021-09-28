import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { roleStore } from '../../../../store';
import { CreateRoleReq, ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface PropType {
  onSubmit: <E>(_e: FormEvent<E>) => void;
}

export default function NewRole({ onSubmit }: PropType) {
  const [form, setForm] = useState<CreateRoleReq>({ name: '', description: '' });
  const { mutateAsync } = roleStore.addRole();

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    mutateAsync(form, {
      onSuccess: () => {
        toast.success('Role created', { duration: 3 });
      },
      onError: () => {
        toast.error('something wrong happened while creating role', { duration: 3 });
      },
    });
    onSubmit(e);
  }
  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      <InputMolecule
        required
        value={form.name}
        error=""
        handleChange={handleChange}
        name="name">
        Role name
      </InputMolecule>
      {/* model code
    {/* module description */}
      <TextAreaMolecule
        value={form.description}
        name="description"
        required
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      {/* save button */}
      <div className="mt-5">
        <Button type="submit" full>
          Add
        </Button>
      </div>
    </form>
  );
}