/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import usePickedRole from '../../hooks/usePickedRole';
import { divisionStore } from '../../store/administration/divisions.store';
import programStore from '../../store/administration/program.store';
import usersStore from '../../store/administration/users.store';
import { Link as LinkList } from '../../types';
import { CommonFormProps, ValueType } from '../../types';
import {
  CreateProgramInfo,
  ProgramErrors,
  ProgramStatus,
  ProgramType,
} from '../../types/services/program.types';
import { UserInfo, UserType } from '../../types/services/user.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';
import { newProgramSchema } from '../../validations/program.validation';

interface INewAcademyProgram<K> extends CommonFormProps<K> {}
interface NewProgramErrors extends ProgramErrors {
  department_id: string;
}

export default function NewAcademicProgram<E>({ onSubmit }: INewAcademyProgram<E>) {
  const history = useHistory();
  const { search } = useLocation();
  const facultyId = new URLSearchParams(search).get('dp');

  const picked_role = usePickedRole();
  const { data: inCharge } = usersStore.getUsersByAcademyAndUserType(
    picked_role?.academy_id + '',
    UserType.INSTRUCTOR,
    { page: 0, pageSize: 1000, sortyBy: 'username' },
  );

  const instructors = inCharge?.data.data.content || [];
  const rankedInstructors = instructors.filter((inst) => inst.person?.current_rank) || [];
  const unrankedInstructors =
    instructors.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.person && b.person) {
      return a.person.current_rank?.priority - b.person.current_rank?.priority;
    } else {
      return 0;
    }
  });
  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  const departments = divisionStore.getDivisionByType('DEPARTMENT').data?.data.data;
  // const { data: levelsInfo } = levelStore.getLevels(); // fetch levels

  const [details, setDetails] = useState<CreateProgramInfo>({
    code: '',
    in_charge_id: '',
    department_id: facultyId ? facultyId : '',
    description: '',
    name: '',
    type: ProgramType.SHORT_COURSE,
    status: ProgramStatus.ACTIVE,
  });

  const initialErrorState: NewProgramErrors = {
    name: '',
    code: '',
    description: '',
    in_charge_id: '',
    department_id: '',
  };

  const [errors, setErrors] = useState<NewProgramErrors>(initialErrorState);

  const { mutateAsync } = programStore.createProgram();
  const { t } = useTranslation();

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  const list: LinkList[] = [
    { to: '/', title: 'Home' },
    { to: 'dashboard/divisions', title: t('Division') },
    { to: '/dashboard/divisions/departments', title: 'Departments' },
    { to: '/', title: 'New ' + t('Program') },
  ];

  function createProgram<T>(e: FormEvent<T>) {
    e.preventDefault();

    const cloneDetails = { ...details };
    Object.assign(cloneDetails, { has_faculty: !facultyId });

    const validatedForm = newProgramSchema.validate(cloneDetails, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(cloneDetails, {
          onSuccess(newProgram) {
            toast.success(t('Program') + ' created');
            history.push(`/dashboard/programs/${newProgram.data.data.id}/level/add`);
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        });
        if (onSubmit) onSubmit(e);
      })
      .catch((err) => {
        const validatedErr: NewProgramErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof NewProgramErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <>
      <section>
        <BreadCrumb list={list}></BreadCrumb>
      </section>
      <form onSubmit={createProgram}>
        <div className="p-6 w-auto lg:w-5/12 pl-8 gap-3 rounded-lg bg-main mt-8 flex-col">
          <div className="py-5 mb-3 capitalize">
            <Heading color="txt-primary" fontWeight="bold">
              New {t('Program')}
            </Heading>
          </div>
          <InputMolecule
            required={false}
            error={errors.name}
            value={details.name}
            handleChange={handleChange}
            name="name">
            {t('Program')} name
          </InputMolecule>
          <InputMolecule
            value={details.code}
            required={false}
            error={errors.code}
            handleChange={handleChange}
            name="code">
            {t('Program')} code
          </InputMolecule>
          <RadioMolecule
            className="pb-2"
            value={details.type}
            required
            name="type"
            options={getDropDownStatusOptions(ProgramType)}
            handleChange={handleChange}>
            {t('Program')} Type
          </RadioMolecule>
          <TextAreaMolecule
            error={errors.description}
            value={details.description}
            name="description"
            handleChange={handleChange}>
            {t('Program')} description
          </TextAreaMolecule>
          <DropdownMolecule
            error={errors.in_charge_id}
            hasError={errors.in_charge_id !== ''}
            width="60 md:w-80"
            placeholder="Select incharge"
            options={getDropDownOptions({
              inputs: finalInstructors || [],
              labelName: ['first_name', 'last_name'],
              //@ts-ignore
              getOptionLabel: (inst: UserInfo) =>
                inst.person?.current_rank?.name ||
                '' + ' ' + inst.first_name + ' ' + inst.last_name,
            })}
            name="in_charge_id"
            handleChange={handleChange}>
            Incharge
          </DropdownMolecule>

          {!facultyId && (
            <DropdownMolecule
              error={errors.department_id}
              width="60 md:w-80"
              placeholder="Select department"
              options={getDropDownOptions({ inputs: departments || [] })}
              name="department_id"
              handleChange={handleChange}>
              Department
            </DropdownMolecule>
          )}

          <RadioMolecule
            value={details.status}
            name="status"
            options={getDropDownStatusOptions(ProgramStatus)}
            handleChange={handleChange}>
            Status
          </RadioMolecule>
          {/* save button */}
          <div className="mt-5">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </>
  );
}
