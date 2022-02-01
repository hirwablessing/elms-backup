import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import { queryClient } from '../../../../plugins/react-query';
import { venueStore } from '../../../../store/timetable/venue.store';
import { GenericStatus, ValueType } from '../../../../types';
import { CreateVenue, venueType } from '../../../../types/services/event.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

export default function NewVenue() {
  const history = useHistory();
  const { user } = useAuthenticator();

  const [values, setvalues] = useState<CreateVenue>({
    venueType: venueType.CLASS,
    name: '',
    status: GenericStatus.ACTIVE,
    academyId: user?.academy.id + '',
  });

  useEffect(() => {
    setvalues((prev) => ({ ...prev, academyId: user?.academy?.id || '' }));
  }, [user]);

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  const { mutateAsync, isLoading } = venueStore.createVenue();

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    await mutateAsync(values, {
      async onSuccess(_data) {
        toast.success('Venue was created successfully');
        queryClient.invalidateQueries(['venues']);
        history.goBack();
      },
      onError(error: any) {
        toast.error(error.response.data.message || 'error occurred please try again');
      },
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputMolecule
          name="name"
          placeholder="Venue name"
          value={values.name}
          handleChange={handleChange}>
          Venu name
        </InputMolecule>
        <SelectMolecule
          name="venueType"
          value={values.venueType}
          handleChange={handleChange}
          options={getDropDownStatusOptions(venueType)}
          placeholder="Select venue category">
          Venue type
        </SelectMolecule>
        <div className="pt-4">
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
