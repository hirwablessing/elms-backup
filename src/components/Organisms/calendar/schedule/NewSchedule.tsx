import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { authenticatorStore } from '../../../../store/administration';
import { levelStore } from '../../../../store/administration/level.store';
import programStore from '../../../../store/administration/program.store';
import usersStore from '../../../../store/administration/users.store';
import { eventStore } from '../../../../store/timetable/event.store';
import { scheduleStore } from '../../../../store/timetable/schedule.store';
import { venueStore } from '../../../../store/timetable/venue.store';
import { SelectData, ValueType } from '../../../../types';
import {
  CreateEventSchedule,
  frequencyType,
  methodOfInstruction,
  daysOfWeek,
  scheduleAppliesTo,
  createRecurringSchedule,
} from '../../../../types/services/schedule.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import CheckboxMolecule from '../../../Molecules/input/CheckboxMolecule';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IStepProps {
  handleChange: (_e: ValueType) => any;
  setCurrentStep: Function;
  values: CreateEventSchedule;
  handleSubmit?: (_e: FormEvent) => any;
}

export default function NewSchedule() {
  const [values, setvalues] = useState<CreateEventSchedule>({
    appliesTo: undefined,
    beneficiaries: undefined,
    event: '',
    methodOfInstruction: methodOfInstruction.LEC,
    period: 1,
    repeatingDays: [],
    plannedEndHour: '',
    plannedScheduleStartDate: new Date().toLocaleDateString(),
    plannedScheduleEndDate: new Date().toLocaleDateString(),
    plannedStartHour: new Date().toLocaleTimeString(),
    venue: '',
    frequencyType: frequencyType.ONETIME,
  });

  //state varibales
  const [currentStep, setcurrentStep] = useState(0);
  const history = useHistory();

  const { mutateAsync } = scheduleStore.createEventSchedule();

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    let data: CreateEventSchedule = { ...values };

    if (values.frequencyType == frequencyType.RECURRING) {
      data = {
        ...values,
        recurringSchedule: values.repeatingDays.map((d) => ({
          dayOfWeek: d,
          endHour: values.plannedEndHour,
          startHour: values.plannedStartHour,
        })) as createRecurringSchedule[],
      };
    }

    mutateAsync(data, {
      async onSuccess(_data) {
        toast.success('Schedule was created successfully');
        history.goBack();
      },
      onError() {
        toast.error('error occurred please try again');
      },
    });
  }
  return (
    <div>
      <Stepper
        currentStep={currentStep}
        completeStep={currentStep}
        width="w-32"
        isVertical={false}
        isInline={false}
        navigateToStepHandler={() => console.log('submitted')}>
        <FirstStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
        />
        <SecondStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
          handleSubmit={handleSubmit}
        />
        <ThirdStep
          values={values}
          handleChange={handleChange}
          setCurrentStep={setcurrentStep}
          handleSubmit={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function FirstStep({ handleChange, setCurrentStep, values }: IStepProps) {
  const events = eventStore.getAllEvents().data?.data.data;
  const venues = venueStore.getAllVenues().data?.data.data;
  const authUser = authenticatorStore.authUser().data?.data.data;

  const users = usersStore.getUsersByAcademy(authUser?.academy.id + '').data?.data.data;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep(1);
  };
  return (
    <form onSubmit={handleSubmit} className="-mb-6">
      <div className="pb-1">
        <DropdownMolecule
          name="event"
          handleChange={handleChange}
          options={
            events?.map((vn) => ({ label: vn.name, value: vn.id })) as SelectData[]
          }
          placeholder="Select event">
          Event
        </DropdownMolecule>
      </div>
      <div className="pb-1">
        <DropdownMolecule
          name="venue"
          handleChange={handleChange}
          options={
            venues?.map((vn) => ({ label: vn.name, value: vn.id })) as SelectData[]
          }
          placeholder="Select venue">
          Venue
        </DropdownMolecule>
      </div>
      <div className="pb-1">
        <DropdownMolecule
          name="user_in_charge"
          handleChange={handleChange}
          options={
            users?.map((user) => ({
              label: `${user.person.first_name} ${user.person.last_name}`,
              value: user.id,
            })) as SelectData[]
          }
          placeholder="Select someone">
          Who is in charge?
        </DropdownMolecule>
      </div>
      <div className="pb-4">
        <RadioMolecule
          type="block"
          handleChange={handleChange}
          name={'frequencyType'}
          value={values.frequencyType}
          options={getDropDownStatusOptions(frequencyType)}>
          Event type
        </RadioMolecule>
      </div>
      <Button type="submit">Next</Button>
    </form>
  );
}

function SecondStep({ handleChange, setCurrentStep, values }: IStepProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm -mb-6">
      <InputMolecule
        name="plannedStartHour"
        placeholder="Intake title"
        type="time"
        value={values.plannedStartHour}
        handleChange={handleChange}>
        Planned start hour
      </InputMolecule>
      <InputMolecule
        type="time"
        value={values.plannedEndHour}
        name="plannedEndHour"
        placeholder="End time"
        handleChange={handleChange}>
        Planned end hour
      </InputMolecule>
      <InputMolecule
        name="plannedScheduleStartDate"
        placeholder="Intake title"
        type="date"
        value={values.plannedScheduleStartDate.toLocaleString()}
        handleChange={handleChange}>
        Schedule Start date
      </InputMolecule>
      {values.frequencyType === frequencyType.RECURRING ? (
        <CheckboxMolecule
          isFlex
          options={getDropDownStatusOptions(daysOfWeek).slice(0, 7)}
          name="repeatingDays"
          placeholder="Repeat days:"
          handleChange={handleChange}
          values={values.repeatingDays}
        />
      ) : values.frequencyType === frequencyType.DATE_RANGE ? (
        <InputMolecule
          name="plannedScheduleEndDate"
          placeholder="Intake title"
          type="date"
          value={values.plannedScheduleEndDate.toLocaleString()}
          handleChange={handleChange}>
          Repetition end date
        </InputMolecule>
      ) : (
        <></>
      )}

      <div className="pt-3 flex justify-between w-80">
        <Button styleType="text" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}

function ThirdStep({ values, handleChange, handleSubmit, setCurrentStep }: IStepProps) {
  const programs = programStore.fetchPrograms().data?.data.data;
  const levels = levelStore.getLevels().data?.data.data;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm -mb-6">
      <div className="pb-1">
        <DropdownMolecule
          name="appliesTo"
          handleChange={handleChange}
          options={getDropDownStatusOptions(scheduleAppliesTo)}
          placeholder="Select group">
          Event concerns
        </DropdownMolecule>
      </div>
      <div className="pb-1">
        <DropdownMolecule
          name="beneficiaries"
          isMulti
          handleChange={handleChange}
          options={
            (values.appliesTo == scheduleAppliesTo.APPLIES_TO_LEVEL
              ? levels
              : values.appliesTo == scheduleAppliesTo.APPLIES_TO_PROGRAM
              ? programs
              : []
            )?.map((pr) => ({
              value: pr.id + '',
              label: pr.name,
            })) as SelectData[]
          }
          placeholder="Select group">
          {`Select beneficiaries`}
        </DropdownMolecule>
      </div>
      <RadioMolecule
        options={getDropDownStatusOptions(methodOfInstruction)}
        handleChange={handleChange}
        name={'methodOfInstruction'}
        value={values.methodOfInstruction}>
        Method of Instruction
      </RadioMolecule>
      <div className="pt-8 flex justify-between w-80">
        <Button styleType="text" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button type="submit">Create schedule</Button>
      </div>
    </form>
  );
}