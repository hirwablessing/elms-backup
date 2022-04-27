import React from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewWeek from '../../components/Organisms/schedule/timetable/NewWeek';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { timetableStore } from '../../store/timetable/timetable.store';
import { ParamType, Privileges } from '../../types';

export default function ProvisionalLevelTT() {
  const { id } = useParams<ParamType>();
  const history = useHistory();

  const levelInfo = intakeProgramStore.getIntakeLevelById(id).data?.data.data;
  const { path, url } = useRouteMatch();

  const handleClose = () => {
    history.goBack();
  };

  const { data, isLoading } = timetableStore.getWeeksByIntakeLevel(id);
  const weeks = data?.data.data;

  return (
    <div>
      <TableHeader
        showBadge={false}
        showSearch={false}
        title={`${levelInfo?.academic_program_level.program.name} - ${levelInfo?.academic_program_level.level.name}`}>
        <div className="flex gap-3">
          <Link to={`${url}/new-week`}>
            <Button type="button" styleType="outline">
              New week
            </Button>
          </Link>
        </div>
      </TableHeader>
      {isLoading ? (
        <Loader />
      ) : weeks?.length === 0 ? (
        <NoDataAvailable
          title={'No weeks registered'}
          description={
            'No weeks registered so far. Please register one with button below'
          }
          buttonLabel="New week"
          handleClick={() => history.push(`${url}/new-week`)}
          privilege={Privileges.CAN_CREATE_VENUE}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {weeks?.map((event) => (
            <div
              key={event.id}
              className="bg-main rounded-md p-4 border-1 border-transparent hover:border-primary-500 cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="semibold">
                {event.week_name}
              </Heading>
              <Heading className="pt-6" fontSize="sm" fontWeight="bold">
                {event.start_date}
              </Heading>
            </div>
          ))}
        </div>
      )}
      <Switch>
        <Route
          exact
          path={`${path}/new-week`}
          render={() => (
            <PopupMolecule title="New timetable week" open onClose={handleClose}>
              <NewWeek />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}