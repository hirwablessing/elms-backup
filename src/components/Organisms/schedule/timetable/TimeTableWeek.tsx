import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { queryClient } from '../../../../plugins/react-query';
import instructordeploymentStore from '../../../../store/instructordeployment.store';
import { timetableStore } from '../../../../store/timetable/timetable.store';
import { Privileges } from '../../../../types';
import {
  ITimeTableWeekInfo,
  TimetableStatus,
} from '../../../../types/services/schedule.types';
import { groupTimeTableByDay } from '../../../../utils/calendar';
import {
  formatDateLikeGoogle,
  formatDateToYyMmDd,
  getWeekBorderDays,
} from '../../../../utils/date-helper';
import Permission from '../../../Atoms/auth/Permission';
import Button from '../../../Atoms/custom/Button';
import Icon from '../../../Atoms/custom/Icon';
import Heading from '../../../Atoms/Text/Heading';
import PopupMolecule from '../../../Molecules/Popup';
import EditTimeTable from './EditTimeTable';
import NewFootNote from './NewFootNote';
import NewTimeTable from './NewTimeTable';

interface IProps {
  week: ITimeTableWeekInfo;
  levelId: string;
}

export default function TimeTableWeek({ week, levelId }: IProps) {
  const { url, path } = useRouteMatch();
  const history = useHistory();

  const [isPrinting, setisPrinting] = useState(false);
  const groupedActivities = groupTimeTableByDay(week.activities || []);

  const { mutateAsync, isLoading } = timetableStore.changeWeekStatus();
  const instructors = instructordeploymentStore.getInstructors().data?.data.data;

  const rankedInstructors =
    instructors?.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructors?.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });

  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  const monday = new Date(getWeekBorderDays(new Date(week.start_date)).monday);
  const timetableRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => timetableRef.current,
    documentTitle: `${week.week_name}-timetable`,
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
    copyStyles: true,
  });

  const handleConfirm = () => {
    mutateAsync(
      { id: week.id.toString(), status: TimetableStatus.CONFIRMED },
      {
        async onSuccess(_data) {
          toast.success('Timetable was confirmed successfully');
          queryClient.invalidateQueries(['timetable/weeks', levelId]);
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'Error occurred please try again');
        },
      },
    );
  };

  formatDateLikeGoogle(week.start_date);

  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <div className="tt-header flex justify-between items-center">
        <Heading fontSize="lg" fontWeight="semibold">
          {week.week_name}
          <span className="text-txt-secondary px-1 text-base capitalize">
            {`(${formatDateLikeGoogle(week.start_date)} - ${formatDateLikeGoogle(
              week.end_date,
            )})`}
          </span>
        </Heading>
        <div className="tt-actions py-4 flex gap-4 justify-end">
          {week.status === TimetableStatus.PROVISIONAL && (
            <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
              <Button
                type="button"
                styleType="outline"
                onClick={handleConfirm}
                isLoading={isLoading}
                disabled={isLoading}>
                Confirm
              </Button>
            </Permission>
          )}
          <Button
            type="button"
            styleType="text"
            className="bg-gray-300 text-black px-10"
            onClick={handlePrint}
            isLoading={isPrinting}>
            Download
          </Button>
          <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
            <Link to={`${url}/new-activity?week=${week.id}`}>
              <Button type="button" styleType="outline">
                Add Activity
              </Button>
            </Link>
          </Permission>
        </div>
      </div>
      <div className="tt print:px-10 print:py-8 print:bg-main" ref={timetableRef}>
        <div className="bg-primary-500 py-4 uppercase px-8 text-sm text- print:text-xs text-white grid grid-cols-10 gap-2 min-w-max overflow-x-auto">
          <p>days</p>
          <p>time</p>
          <p className="col-span-2">subject detail</p>
          <p>code</p>
          <p>pds</p>
          <p>moi</p>
          <p>location</p>
          <p>ds/lecturer</p>
          <p>dress code</p>
        </div>
        {Object.keys(groupedActivities).map((day, i) => {
          monday.setDate(monday.getDate() + i);
          return (
            <div
              key={day}
              className={`py-6 px-6 text-sm print:text-xs rounded grid grid-cols-10 border-2 ${
                week.status == TimetableStatus.PROVISIONAL
                  ? 'bg-yellow-50'
                  : 'bg-blue-100 border-blue-200'
              }   my-4 gap-`}>
              <div className="border pl-2 border-black">
                <h2 className="font-semibold text-sm print:text-xs"> {day}</h2>
                <p className=" print:hidden">
                  {formatDateToYyMmDd(monday.toDateString())}
                </p>
              </div>
              <div className="col-span-9">
                {groupedActivities[day].map((activity) => {
                  let instructor = finalInstructors?.find(
                    (inst) => inst.user.id == activity.in_charge.adminId,
                  );
                  return (
                    <div
                      key={activity.id}
                      className="timetable-item border-r border-t last:border-b border-black relative col-span-4 grid grid-cols-9 gap-2 py-2 cursor-pointer hover:bg-white px-2 hover:text-primary-600">
                      <p className="uppercase">
                        {activity.start_hour.substring(0, 5)} -
                        {' ' + activity.end_hour.substring(0, 5)}
                      </p>
                      <p className="col-span-2">
                        {activity.course_module?.name || activity.event.name}
                        {activity.activity_foot_notes.length > 0 && (
                          <span className="px-1 text-xs">
                            (
                            {activity.activity_foot_notes.map((fnote, i, array) => (
                              <a href={`#foot-note-${fnote.id}`} key={fnote.id}>{`${
                                fnote.id
                              }${i < array.length - 1 ? ', ' : ''}`}</a>
                            ))}
                            )
                          </span>
                        )}
                      </p>
                      <p className="uppercase">{activity.course_code}</p>
                      <p>{activity.periods}</p>
                      <p>{activity.method_of_instruction}</p>
                      <p>{activity.venue.name}</p>
                      <p>
                        {`${instructor?.user.person?.current_rank?.name || ''} ${
                          instructor?.user.first_name
                        } ${instructor?.user.last_name}`}
                      </p>
                      <p>{activity.dress_code}</p>
                      <Permission privilege={Privileges.CAN_MODIFY_TIMETABLE}>
                        <div className="actions hidden absolute top-0 right-0 h-full">
                          <div className="flex gap-0 bg-white px-6 h-full">
                            <Link to={`${url}/item/${activity.id}/add-footnote`}>
                              <Icon name={'add'} size={14} stroke="primary" />
                            </Link>
                            <Link to={`${url}/item/${activity.id}/edit?week=${week.id}`}>
                              <Icon name={'edit'} size={16} stroke="primary" />
                            </Link>
                          </div>
                        </div>
                      </Permission>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="foot-notes text-sm">
          {week.activities.map((act) => (
            <div key={act.id} id={`fnotes-for-${act.id}`}>
              {act.activity_foot_notes.map((footNote) => (
                <p
                  id={`foot-note-${footNote.id}`}
                  key={footNote.id}>{`${footNote.id}. ${footNote.foot_note}`}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* timetable actions */}
      <Switch>
        <Route
          exact
          path={`${path}/new-activity`}
          render={() => (
            <PopupMolecule title="Add timetable activity" open onClose={handleClose}>
              <NewTimeTable />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/item/:itemId/edit`}
          render={() => (
            <PopupMolecule title="Update timetable" open onClose={handleClose}>
              <EditTimeTable />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/item/:itemId/add-footnote`}
          render={() => (
            <PopupMolecule title="Add Footnote" open onClose={handleClose}>
              <NewFootNote levelId={levelId} />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
