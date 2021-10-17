import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import { authenticatorStore } from '../../../store';
import { divisionStore } from '../../../store/divisions.store';
import { DivisionInfo } from '../../../types/services/division.types';
import Button from '../../Atoms/custom/Button';
import PopupMolecule from '../../Molecules/Popup';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';
import NewDepartment from '../forms/divisions/NewDepartment';
import NewFaculty from '../forms/divisions/NewFaculty';
import UpdateFaculty from '../forms/divisions/UpdateFaculty';

interface FilteredData
  extends Pick<
    DivisionInfo,
    'id' | 'name' | 'description' | 'generic_status' | 'total_num_childreen'
  > {}

interface IFaculties {
  fetchType: string;
}

export default function Faculties({ fetchType }: IFaculties) {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const [faculties, setFaculties] = useState<FilteredData[]>();
  const { data: userInfo } = authenticatorStore.authUser();

  const { data, isSuccess, isLoading } = divisionStore.getDivisionByType(
    fetchType.toUpperCase(),
  );

  useEffect(() => {
    let formattedFaculties: any = [];
    const filteredFaculties = data?.data.data.map((faculty: DivisionInfo) =>
      _.pick(faculty, [
        'id',
        'name',
        'description',
        'generic_status',
        'total_num_childreen',
      ]),
    );

    filteredFaculties?.map((faculty: any) => {
      let filteredInfo: any = {
        id: faculty.id.toString(),
        decription: faculty.description,
        name: faculty.name,
        status: faculty.generic_status,
        departments: faculty.total_num_childreen || 0,
      };
      formattedFaculties.push(filteredInfo);
    });

    data?.data.data && setFaculties(formattedFaculties);
  }, [data]);

  function handleClose() {
    history.goBack();
  }

  const actions = [
    {
      name: 'Edit Faculty',
      handleAction: (id: string | number | undefined) => {
        history.push(`${path}/${id}/edit`); // go to edit role
      },
    },
    {
      name: 'Add Department',
      handleAction: (id: string | number | undefined) => {
        history.push(`${path}/${id}/add`);
      },
    },
    {
      name: 'View Departments',
      handleAction: (id: string | number | undefined) => {
        // history.push({ pathname: `${path}/${id}/view-departments` });
        history.push({
          pathname: `/dashboard/divisions/departments`,
          search: `?fac=${id}`,
        });
      },
    },
  ];

  return (
    <main>
      <section>
        <TableHeader
          title="Faculty"
          totalItems={faculties?.length || 0}
          handleSearch={() => {}}>
          <Link to={`${url}/add`}>
            <Button>Add Faculty</Button>
          </Link>
        </TableHeader>
      </section>
      <section>
        {isLoading && 'Faculty loading...'}
        {!isLoading && isSuccess ? faculties?.length === 0 : 'No Faculties found,add one'}
        {faculties && (
          <Table<FilteredData>
            statusColumn="status"
            data={faculties}
            hide={['id']}
            uniqueCol={'id'}
            actions={actions}
          />
        )}
      </section>

      <Switch>
        {/* modify faculty */}
        <Route
          exact
          path={`${path}/:id/edit`}
          render={() => {
            return (
              <PopupMolecule title="Update Faculty" open={true} onClose={handleClose}>
                <UpdateFaculty academy_id={userInfo?.data.data.academy.id.toString()} />
              </PopupMolecule>
            );
          }}
        />

        <Route
          exact
          path={`${path}/add`}
          render={() => {
            return (
              <PopupMolecule title="New Faculty" open onClose={handleClose}>
                <NewFaculty academy_id={userInfo?.data.data.academy.id.toString()} />
              </PopupMolecule>
            );
          }}
        />

        <Route
          exact
          path={`${path}/:id/add`}
          render={() => {
            return (
              <PopupMolecule title="New Department" open onClose={handleClose}>
                <NewDepartment academy_id={userInfo?.data.data.academy.id.toString()} />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </main>
  );
}
