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
import Heading from '../../components/Atoms/Text/Heading';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewTimeTable from '../../components/Organisms/calendar/schedule/NewTimeTable';
import { classStore } from '../../store/administration/class.store';
import { scheduleStore } from '../../store/timetable/schedule.store';
import { ParamType } from '../../types';
import { groupTimeTableByDay } from '../../utils/calendar';

export default function TimeTable() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { url } = useRouteMatch();

  const classInfo = classStore.getClassById(id).data?.data.data;

  const handleClose = () => {
    history.goBack();
  };

  const groupedTimeTable = groupTimeTableByDay(
    scheduleStore.getClassTimetableByIntakeLevelClass(id).data?.data.data || [],
  );

  return (
    <div>
      <TableHeader
        showBadge={false}
        showSearch={false}
        title={`${classInfo?.academic_year_program_intake_level.academic_program_level.program.name} - ${classInfo?.academic_year_program_intake_level.academic_program_level.level.name} - ${classInfo?.class_name}`}>
        <Link to={`${url}/new-schedule`}>
          <Button>New timetable</Button>
        </Link>
      </TableHeader>
      <div className="bg-primary-500 py-4  px-8 text-sm text-white rounded grid grid-cols-5">
        <p className="px-2">DAYS</p>
        <p className="px-2">TIME</p>
        <p className="px-2">ACTIVITY</p>
        <p className="px-2">VENUE</p>
        <p className="px-2">RESOURCES</p>
      </div>
      {Object.keys(groupedTimeTable).map((day) => (
        <div
          key={day}
          className="py-6 px-8 text-sm rounded grid grid-cols-5 border-2 border-primary-500 my-4 gap-3">
          <div>
            <Heading fontWeight="semibold" fontSize="sm">
              {day}
            </Heading>
            <p className="py-2 text-sm font-medium">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="col-span-4 grid grid-cols-4 gap-3 cursor-pointer hover:bg-lightgreen px-2 hover:text-primary-600">
            {groupedTimeTable[day].map((activity) => (
              <React.Fragment key={activity.id}>
                <p className="py-2 text-sm font-medium uppercase">
                  {activity.start_hour.substr(0, 5)} - {activity.end_hour.substr(0, 5)}
                </p>
                <p className="py-2 text-sm font-medium">{activity.course_module.name}</p>
                <p className="py-2 text-sm font-medium">{activity.venue.name}</p>
                <p className="py-2 text-sm font-medium">{activity.instructor.id}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
      <Switch>
        <Route
          exact
          path={`/dashboard/schedule/timetable/:id/new-schedule`}
          render={() => (
            <PopupMolecule title="Create timetable" open onClose={handleClose}>
              <NewTimeTable />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
