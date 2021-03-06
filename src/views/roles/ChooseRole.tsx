import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import AcademyProfileCard from '../../components/Molecules/cards/AcademyProfileCard';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import academyStore from '../../store/administration/academy.store';
import { institutionStore } from '../../store/administration/institution.store';
import { i18n } from '../../translations/i18n';
import { CommonCardDataType, RoleType } from '../../types';
import { UserType } from '../../types/services/user.types';
import cookie from '../../utils/cookie';
import { advancedTypeChecker } from '../../utils/getOption';

interface PickedData extends CommonCardDataType {
  academy_trans: string;
}

export default function ChooseRole() {
  const { user } = useAuthenticator();
  const [user_roles, setUserRoles] = useState<PickedData[]>([]);
  const [picked_role, setPickedRole] = useState<string>('');
  const [translation, setTranslation] = useState('');

  const institution = institutionStore.getAll();
  const academy_info = academyStore.fetchAcademies();

  const history = useHistory();

  const redirectTo = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  useEffect(() => {
    let roles: PickedData[] = [];
    user?.user_roles.forEach((role) => {
      roles.push({
        code:
          role.type === RoleType.INSTITUTION
            ? institution.isLoading
              ? 'Loading...'
              : institution.data?.data.data.find(
                  (inst) => inst.id === role.institution_id,
                )?.name + ''
            : RoleType.ACADEMY
            ? academy_info.isLoading
              ? 'Loading...'
              : academy_info.data?.data.data.find((ac) => ac.id === role.academy_id)
                  ?.name + ''
            : '',
        title: role.name,
        description: role.description,
        id: role.id,
        status: {
          type: advancedTypeChecker(role.type),
          text: role.type,
        },
        academy_trans:
          academy_info.data?.data.data.find((ac) => ac.id === role.academy_id)
            ?.translation_preset || 'default',
      });
    });

    setUserRoles(roles);
  }, [
    academy_info.data?.data.data,
    academy_info.isLoading,
    institution.data?.data.data,
    institution.isLoading,
    user?.user_roles,
  ]);

  const handleChoose = (user_role: PickedData) => {
    setPickedRole(user_role.id + '');
    setTranslation(user_role.academy_trans);
  };

  const pickRole = () => {
    if (picked_role) {
      cookie.setCookie('user_role', picked_role);
      i18n.changeLanguage(translation);
      redirectTo(
        user?.user_type === UserType.INSTRUCTOR
          ? '/dashboard/inst-module'
          : user?.user_type === UserType.STUDENT
          ? '/dashboard/student'
          : '/dashboard/users',
      );
    } else {
      toast.error('You must pick a role');
    }
  };

  return (
    <div className="p-2 md:px-48 md:py-14">
      <div className="pb-16">
        <AcademyProfileCard
          src="/images/rdf-logo.png"
          alt="institution logo"
          size="80"
          bgColor="none"
          txtSize="lg"
          fontWeight="semibold"
          color="primary"
          subtitle={institution.data?.data.data[0].moto}>
          {institution.data?.data.data[0].name}
        </AcademyProfileCard>
        <Button styleType="text" className="pt-10">
          <Link to="/login" className="flex items-center justify-center">
            <Icon
              size={16}
              name="chevron-left"
              fill="primary"
              useheightandpadding={false}
            />{' '}
            Back to login
          </Link>
        </Button>
      </div>
      <div>
        <Heading fontSize="2xl" fontWeight="medium" className="py-2">
          Choose Role
        </Heading>
        <Heading
          fontSize="lg"
          color="txt-secondary"
          fontWeight="medium"
          className=" pb-8">
          Which Role would you like to use?
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-32 md:gap-y-8">
          {user_roles.map((user_role) => (
            <CommonCardMolecule
              className="my-2"
              active={picked_role == user_role.id}
              data={user_role}
              key={user_role.id}
              handleClick={() => handleChoose(user_role)}
            />
          ))}
        </div>
        <Button onClick={() => pickRole()} className="mt-8">
          Use role
        </Button>
      </div>
    </div>
  );
}
