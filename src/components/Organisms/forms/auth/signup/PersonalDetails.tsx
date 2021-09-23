import React from 'react';

import { CommonStepProps } from '../../../../../types';
import Button from '../../../../Atoms/custom/Button';
import DateMolecule from '../../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../../Molecules/input/RadioMolecule';

function PersonalDetails({ details, handleChange, nextStep }: CommonStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <InputMolecule
          name="firstName"
          placeholder="eg: John"
          value={details.firstName}
          handleChange={handleChange}>
          First Name
        </InputMolecule>
        <InputMolecule
          name="lastName"
          placeholder="eg: Doe"
          value={details.lastName}
          handleChange={handleChange}>
          Last Name
        </InputMolecule>
      </div>
      <div className="flex flex-col gap-4">
        <InputMolecule
          name="email"
          value={details.email}
          type="email"
          placeholder="username@example.com"
          handleChange={handleChange}>
          Email
        </InputMolecule>
        <InputMolecule
          name="phone"
          value={details.phone}
          placeholder="+250 ---------"
          handleChange={handleChange}>
          Phone number
        </InputMolecule>
      </div>
      <div className="flex flex-col gap-4">
        <RadioMolecule
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
          value={details.gender}
          handleChange={handleChange}
          name="gender">
          Gender
        </RadioMolecule>
        <DateMolecule handleDate={handleChange} name="dob" width="60 md:w-80">
          Date of Birth
        </DateMolecule>
      </div>
      <div className="my-4">
        <RadioMolecule
          options={[
            { value: 'married', label: 'Married' },
            { value: 'single', label: 'Single' },
          ]}
          value={details.maritalStatus}
          handleChange={handleChange}
          name="maritalStatus">
          Marital Status
        </RadioMolecule>
      </div>
      <div>
        <Button onClick={() => nextStep()}>Next</Button>
      </div>
    </div>
  );
}

export default PersonalDetails;
