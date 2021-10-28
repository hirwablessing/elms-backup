import './styles/redirecting.scss';

import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from './components/Atoms/custom/Button';
import Icon from './components/Atoms/custom/Icon';
import { authenticatorStore } from './store';
import { experienceStore } from './store/experience.store';
import { Response } from './types';
import { ExperienceInfo } from './types/services/experience.types';
import { PersonInfo, UserType } from './types/services/user.types';

export default function Redirecting() {
  const [hasNoAcademy, setHasNoAcademy] = useState(false);
  const [userNotAllowed, setUserNotAllowed] = useState(false);
  const { data } = authenticatorStore.authUser();
  let experiences: AxiosResponse<Response<ExperienceInfo[]>> | undefined;

  let person: PersonInfo | undefined = data?.data.data.person;

  ({ data: experiences } = experienceStore.getPersonExperiences(
    person?.id.toString() || '',
  ));

  console.log(experiences?.data.data);

  if (experiences?.data.data.length === 0 && data?.data.data.user_type === UserType.ADMIN)
    window.location.href = '/complete-profile/experience';

  useEffect(() => {
    if (data?.data.data.user_type === UserType.SUPER_ADMIN)
      window.location.href = '/dashboard/users';
    else if (data?.data.data.user_type === UserType.ADMIN) {
      let val = !data?.data.data.academy ? true : false;
      setHasNoAcademy(val);
      if (experiences?.data.data.length === 0)
        window.location.href = '/complete-profile/experience';
      else window.location.href = '/dashboard/divisions';
    }
    setUserNotAllowed(true);
  }, [data?.data.data]);

  // const redirectTo = (path: string) => {
  //   history.push(path);
  // };

  // if (data?.data.data.user_type == 'SUPER_ADMIN') redirectTo('/dashboard/users');
  // else if (data?.data.data.user_type == 'ADMIN') {
  //   if (!data.data.data.academy) setHasNoAcademy(true);
  //   else {
  //     if (experiences?.length == 0) redirectTo('/complete-profile/experience');
  //     else redirectTo('/dashboard/programs');
  //   }
  // } else {
  //   setUserNotAllowed(true);
  // }

  return (
    <>
      <div>
        {hasNoAcademy && (
          <div className="full-height w-full grid items-center">
            <div className="flex justify-center">
              <div className=" ">
                <div className="flex items-center px-6 py-1 rounded-lg bg-tertiary">
                  <Icon name="alert" stroke="error" />
                  <p>
                    User{' '}
                    <span className="bg-error-400 px-2 rounded">
                      {data?.data.data.username}
                    </span>{' '}
                    has no Academy, please contact admin
                  </p>
                </div>

                <div className="flex justify-center pt-5 pb-3">
                  <Link to="/login">
                    <Button>Go Back Home</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* when academic admin does not have academy assigned to him */}
        {hasNoAcademy &&
          ErrorCard({
            text: 'User %% has no Academy to operate in, please contact admin',
            value: data?.data.data.user_type,
          })}

        {/* when user type is not yet supported in system */}
        {userNotAllowed &&
          ErrorCard({
            text: 'User type %% is not allowed to use this sytem, please contact Admin.',
            value: data?.data.data.user_type,
          })}

        {/* <p>User has no Academy, please contact admin to give you </p> */}
        {!hasNoAcademy && !userNotAllowed && (
          <div className="redirecing-loader full-height grid place-items-center">
            <div className="typewriter text-xl font-bold w-44">
              <h1>Redirecting....</h1>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface ErrorCardProp {
  text: string;
  value: string | undefined;
}

function ErrorCard({ text, value }: ErrorCardProp) {
  const spanValue = <span className="bg-error-400 px-2 rounded">{value}</span>;

  const realError = text.split('%%');

  return (
    <div className="full-height w-full grid items-center">
      <div className="flex justify-center">
        <div className=" ">
          <div className="flex items-center px-6 py-1 rounded-lg bg-tertiary">
            <Icon name="alert" stroke="error" />
            <p>
              {' '}
              {realError[0]} {spanValue} {realError[1]}{' '}
            </p>
          </div>

          <div className="flex justify-center pt-5 pb-3">
            <Link to="/login">
              <Button>Go Back Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
