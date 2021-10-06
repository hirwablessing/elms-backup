/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';

import usersStore from '../../../../../store/users.store';
import { CommonFormProps, ValueType } from '../../../../../types';
import { DocType } from '../../../../../types/services/user.types';
import { getDropDownStatusOptions } from '../../../../../utils/getOption';
import Button from '../../../../Atoms/custom/Button';
import Heading from '../../../../Atoms/Text/Heading';
import DropdownMolecule from '../../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../../Molecules/input/InputMolecule';

function SignInWithSearch<E>({ onSubmit }: CommonFormProps<E>) {
  const history = useHistory();
  const [details, setDetails] = useState({
    searchBy: '',
    searchInput: '',
  });

  const handleChange = (e: ValueType) => {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  };

  // get user by inputed reference number
  let user = usersStore.getUserAccountsByNid(details.searchInput);

  function filter<T>(e: FormEvent<T>) {
    e.preventDefault();
    let foundUser = user.data?.data.data[0];
    if (foundUser) {
      toast.success("You're already registered!", { duration: 1200 });
      setTimeout(() => {
        history.push({ pathname: '/register', state: { detail: foundUser } });
      }, 900);
    } else {
      toast.error("You're not yet registered!", { duration: 1200 });
    }
    if (onSubmit) onSubmit(e);
  }

  return (
    <div className="py-32">
      <Heading fontSize="lg" className="md:text-3xl" fontWeight="semibold">
        Search
      </Heading>
      <Heading
        color="txt-secondary"
        fontSize="sm"
        className="md:text-sm pt-2"
        fontWeight="medium">
        Enter your reference number to find out if you&apos;re already registered
      </Heading>

      <form onSubmit={filter}>
        <div className="flex gap-2 items-center py-6">
          <DropdownMolecule
            width="36"
            placeholder="Search by"
            handleChange={handleChange}
            name="searchBy"
            defaultValue={getDropDownStatusOptions(DocType).find(
              (nid) => nid.value === DocType.NID,
            )}
            options={getDropDownStatusOptions(DocType)}
          />
          <InputMolecule
            name="searchInput"
            value={details.searchInput}
            handleChange={(e) => handleChange(e)}>
            <></>
          </InputMolecule>
        </div>
        <Button type="submit">Search</Button>
      </form>
      <div className="text-txt-secondary py-2">
        <p className="text-base text-txt-secondary">
          Already have an account?
          <Link to="/login">
            <Button styleType="text" className="text-primary-500">
              Sign in
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInWithSearch;
