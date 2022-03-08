import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { roleStore } from '../../../../store/administration';
import academyStore from '../../../../store/administration/academy.store';
import { CreateRoleReq, FormPropType, RoleType, ValueType } from '../../../../types';
import { AcademyInfo } from '../../../../types/services/academy.types';
import { UserType } from '../../../../types/services/user.types';
import cookie from '../../../../utils/cookie';
import {
  getDropDownOptions,
  getDropDownStatusOptions,
} from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function NewRole({ onSubmit }: FormPropType) {
  const { mutateAsync } = roleStore.addRole();
  const { user } = useAuthenticator();
  const history = useHistory();
  const user_role_cookie = cookie.getCookie('user_role') || '';
  const user_role = user?.user_roles?.find((role) => role.id + '' === user_role_cookie);

  const [form, setForm] = useState<CreateRoleReq>({
    name: '',
    description: '',
    academy_id: '',
    institution_id: '',
    type: RoleType.ACADEMY,
  });

  useEffect(() => {
    setForm({
      name: '',
      description: '',
      academy_id: user_role?.academy_id.toString() || '',
      institution_id: user?.institution?.id.toString() || '',
      type: RoleType.ACADEMY,
    });
  }, [user?.institution?.id, user_role?.academy_id]);

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    mutateAsync(form, {
      onSuccess: () => {
        toast.success('Role created');
        history.goBack();
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
    if (onSubmit) onSubmit(e);
  }
  const academies: AcademyInfo[] | undefined =
    academyStore.fetchAcademies().data?.data.data || [];

  return (
    <form onSubmit={submitForm}>
      {/* model name */}
      {user?.user_type === UserType.SUPER_ADMIN ? (
        <>
          <RadioMolecule
            className="pb-2"
            defaultValue={form.type}
            options={getDropDownStatusOptions(RoleType)}
            value={form.type}
            handleChange={handleChange}
            name="type">
            Apply Role On
          </RadioMolecule>
          {form.type === RoleType.ACADEMY ? (
            <SelectMolecule
              options={getDropDownOptions({ inputs: academies || [] })}
              name="academy_id"
              placeholder="select academy"
              value={form.academy_id}
              handleChange={handleChange}>
              Academy
            </SelectMolecule>
          ) : (
            <InputMolecule
              name=""
              readOnly
              value={user?.institution.name}
              handleChange={handleChange}>
              Institution
            </InputMolecule>
          )}
        </>
      ) : (
        <InputMolecule
          readOnly
          value={academies.find((ac) => ac.id === form.academy_id)?.name}
          name={'academy_id'}>
          Academy
        </InputMolecule>
      )}
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
