import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import AssignRole from '../../components/Organisms/forms/roles/AssignRole';
import ImportUsers from '../../components/Organisms/user/ImportUsers';
import useAuthenticator from '../../hooks/useAuthenticator';
import { enrollmentService } from '../../services/administration/enrollments.service';
import { authenticatorStore } from '../../store/administration';
import academyStore from '../../store/administration/academy.store';
import { Privileges, SortedContent, ValueType } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import { ActionsType } from '../../types/services/table.types';
import { UserType, UserTypes } from '../../types/services/user.types';
import { formatInstructorTable } from '../../utils/array';
import { getDropDownOptions } from '../../utils/getOption';
import DeployInstructors from '../DeployInstructors';
import EnrollStudents from '../EnrollStudents';
import ViewUserRole from '../roles/ViewUserRole';

export default function InstructorsView() {
  const { url, path } = useRouteMatch();
  const { user, picked_role } = useAuthenticator();
  const history = useHistory();
  const { t } = useTranslation();
  const [currentPage, setcurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [selectedAcademy, setSelectedAcademy] = useState('');
  const [academyUsers, setAcademyUsers] = useState<SortedContent<Instructor[]>>();
  const [institutionUsers, setInstitutionUsers] = useState<SortedContent<Instructor[]>>();
  const [isLoading, setIsLoading] = useState(true);

  const { mutateAsync } = authenticatorStore.resetPassword();

  const academies = academyStore.getAcademiesByInstitution(
    user?.institution.id.toString() || '',
  );

  useEffect(() => {
    let users = enrollmentService.getInstructorByAcademyOrderedByRank(selectedAcademy, {
      page: currentPage,
      pageSize,
    });

    users.then((res) => {
      setInstitutionUsers(res.data.data), setIsLoading(false);
    });
  }, [currentPage, pageSize, selectedAcademy]);

  useEffect(() => {
    if (picked_role?.academy_id) {
      let users = enrollmentService.getInstructorByAcademyOrderedByRank(
        picked_role?.academy_id.toString() || '',
        {
          page: currentPage,
          pageSize,
        },
      );

      users.then((res) => {
        setAcademyUsers(res.data.data), setIsLoading(false);
      });
    }
  }, [currentPage, pageSize, picked_role?.academy_id]);

  const [users, setUsers] = useState<UserTypes[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setUsers(
      formatInstructorTable(academyUsers?.content || institutionUsers?.content || []),
    );
    setTotalElements(academyUsers?.totalElements || 0);
    setTotalPages(academyUsers?.totalPages || 0);
  }, [
    academyUsers?.content,
    academyUsers?.totalElements,
    academyUsers?.totalPages,
    institutionUsers?.content,
  ]);

  let actions: ActionsType<UserTypes>[] = [];

  actions?.push({
    name: 'View ' + t('Instructor'),
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/user/${id}/profile`); // go to view user profile
    },
    privilege: Privileges.CAN_ACCESS_USERS,
  });

  actions?.push({
    name: 'Edit ' + t('Instructor'),
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/users/${id}/edit`); // go to edit user
    },
    privilege: Privileges.CAN_MODIFY_USER,
  });

  actions?.push({
    name: 'Deploy ' + t('Instructor'),
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/deploy`); // go to assign role
    },
    privilege: Privileges.CAN_CREATE_USER,
  });

  actions?.push({
    name: 'Enroll student',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/enroll`); // go to assign role
    },
    privilege: Privileges.CAN_CREATE_USER,
  });

  actions?.push({
    name: 'View Role',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/view-role`); // go to assign role
    },
    privilege: Privileges.CAN_ACCESS_USERS_ROLES,
  });

  actions?.push({
    name: 'Assign Role',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/assign-role`); // go to assign role
    },
    privilege: Privileges.CAN_ASSIGN_ROLE,
  });
  actions?.push({
    name: 'Reset Password',
    handleAction: (id: string | number | undefined) => {
      //call a reset password api
      mutateAsync(id?.toString() || '', {
        onSuccess: () => {
          toast.success('Password reset successfully', { duration: 5000 });
        },
        onError: (error: any) => {
          toast.error(error + '');
        },
      });
    },
    privilege: Privileges.CAN_RESET_USER_PASSWORD,
  });

  function handleSearch(_e: ValueType) {}

  return (
    <div>
      {user?.user_type === UserType.SUPER_ADMIN && (
        <div className="flex items-center gap-4">
          <SelectMolecule
            width="80"
            className=""
            loading={academies.isLoading}
            value={selectedAcademy}
            handleChange={(e) => {
              setSelectedAcademy(e.value.toString());
            }}
            name={'academy'}
            options={getDropDownOptions({ inputs: academies.data?.data.data || [] })}>
            Select Academy
          </SelectMolecule>
        </div>
      )}
      <TableHeader
        title={t('Instructor')}
        totalItems={totalElements}
        handleSearch={handleSearch}>
        <Permission privilege={Privileges.CAN_CREATE_USER}>
          <div className="flex gap-3">
            <Link to={`${url}/import`}>
              <Button styleType="outline">Import {t('Instructor')}</Button>
            </Link>
            <Link to={`/dashboard/users/add/${UserType.INSTRUCTOR}`}>
              <Button>New {t('Instructor')}</Button>
            </Link>
          </div>
        </Permission>
      </TableHeader>
      {!selectedAcademy && user?.user_type === UserType.SUPER_ADMIN ? (
        <NoDataAvailable
          showButton={false}
          icon="user"
          buttonLabel={'Add new ' + t('Instructor')}
          title={'No ' + t('Instructor') + ' available'}
          handleClick={() => history.push(`/dashboard/users/add/${UserType.INSTRUCTOR}`)}
          description={
            'There are no ' +
            t('Instructor') +
            '! Make sure you select a specific academy'
          }
          privilege={Privileges.CAN_CREATE_USER}
        />
      ) : isLoading ? (
        <Loader />
      ) : users.length <= 0 ? (
        <NoDataAvailable
          icon="user"
          buttonLabel={'Add new ' + t('Instructor')}
          title={'No ' + t('Instructor') + ' available'}
          handleClick={() => history.push(`/dashboard/users/add/${UserType.INSTRUCTOR}`)}
          description={'There are no ' + t('Instructor') + ' added into the system yet'}
          privilege={Privileges.CAN_CREATE_USER}
        />
      ) : (
        <Table<UserTypes>
          statusColumn="status"
          data={users}
          actions={actions}
          statusActions={[]}
          hide={['id', 'user_type', 'ID Card']}
          selectorActions={[]}
          uniqueCol="id"
          rowsPerPage={pageSize}
          totalPages={totalPages}
          currentPage={currentPage}
          onPaginate={(page) => setcurrentPage(page)}
          onChangePageSize={(size) => {
            setcurrentPage(currentPage);
            setPageSize(size);
          }}
        />
      )}

      <Switch>
        <Route
          exact
          path={`${url}/import`}
          render={() => (
            <PopupMolecule
              title={'Import ' + t('Instructor')}
              open={true}
              onClose={history.goBack}>
              <ImportUsers userType={UserType.INSTRUCTOR} />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/assign-role`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Assign role"
              open={true}
              onClose={history.goBack}>
              <AssignRole />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/deploy`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title={'Deploy as an ' + t('Instructor')}
              open={true}
              onClose={history.goBack}>
              <DeployInstructors />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/enroll`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Enroll as a student"
              open={true}
              onClose={history.goBack}>
              <EnrollStudents />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/:id/view-role`}
          render={() => (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Roles"
              open={true}
              onClose={history.goBack}>
              <ViewUserRole />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
