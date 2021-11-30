import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { authenticatorStore } from '../../../store/administration';
import { GenericStatus, ValueType } from '../../../types';
import { UserType, UserTypes } from '../../../types/services/user.types';
import Button from '../../Atoms/custom/Button';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../Molecules/Popup';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';
import ImportUsers from './ImportUsers';

export default function Students({
  students,
  showTableHeader = true,
}: {
  students: UserTypes[];
  showTableHeader?: boolean;
}) {
  const { url } = useRouteMatch();
  const history = useHistory();

  function handleSearch(_e: ValueType) {}
  const studentActions = [
    { name: 'Add Role', handleAction: () => {} },
    {
      name: 'Edit student',
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/users/${id}/edit`); // go to edit user
      },
    },
    {
      name: 'View Student',
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/${id}/profile`); // go to view user profile
      },
    },
  ];

  const studentStatActions = Object.keys(GenericStatus).map((stat) => ({
    name: stat,
    type: stat as GenericStatus,
    handleStatusAction: () => {},
  }));

  const authUser = authenticatorStore.authUser().data?.data.data;

  return (
    <>
      {showTableHeader && (
        <TableHeader
          title="Students"
          totalItems={students && students.length > 0 ? students.length : 0}
          handleSearch={handleSearch}
          showSearch={students && students.length > 0}>
          {authUser?.user_type === UserType.SUPER_ADMIN && (
            <div className="flex gap-3">
              <Link to={`${url}/import`}>
                <Button styleType="outline">Import students</Button>
              </Link>
              <Link to={`${url}/add`}>
                <Button>New student</Button>
              </Link>
            </div>
          )}
        </TableHeader>
      )}
      {students && (
        <div className="pt-8">
          {students.length <= 0 ? (
            <NoDataAvailable
              icon="user"
              buttonLabel="Add new student"
              title={'No students available'}
              handleClick={() => history.push(`/dashboard/users/add`)}
              description="And the web just isnt the same without you. Lets get you back online!"
            />
          ) : (
            <Table<UserTypes>
              statusColumn="status"
              data={students}
              actions={studentActions}
              statusActions={studentStatActions}
              hide={['id', 'user_type']}
              uniqueCol="id"
            />
          )}
        </div>
      )}
      <Switch>
        <Route
          exact
          path={`${url}/import`}
          render={() => (
            <PopupMolecule title="Import students" open={true} onClose={history.goBack}>
              <ImportUsers userType={UserType.STUDENT} />
            </PopupMolecule>
          )}
        />
      </Switch>
    </>
  );
}
