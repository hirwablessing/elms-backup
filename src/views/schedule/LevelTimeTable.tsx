import '../../styles/components/Molecules/timetable/timetable.scss';

import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import TableHeader from '../../components/Molecules/table/TableHeader';
import TimeTableWeek from '../../components/Organisms/schedule/timetable/TimeTableWeek';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { timetableStore } from '../../store/timetable/timetable.store';
import { ParamType } from '../../types';
import { formatDateToYyMmDd } from '../../utils/date-helper';

export default function ClassTimeTable() {
  const { id } = useParams<ParamType>();

  const levelInfo = intakeProgramStore.getIntakeLevelById(id).data?.data.data;
  const { data, isLoading, isError } = timetableStore.getCurrentWeek(
    formatDateToYyMmDd(new Date().toISOString()),
    id,
  );

  return (
    <div>
      <TableHeader
        showBadge={false}
        showSearch={false}
        title={`${levelInfo?.academic_program_level.program.name} - ${levelInfo?.academic_program_level.level.name} (current)`}>
        <div className="flex gap-3">
          <Link to={`/dashboard/schedule/timetable/${id}/provisional`}>
            <Button type="button">View provisional</Button>
          </Link>
        </div>
      </TableHeader>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="py-20">
          <p className="text-base text-center text-error-500">
            Can not retrive timetable at this time.
            <br /> Try again latter.
          </p>
        </div>
      ) : null}
      {data?.data.data && <TimeTableWeek levelId={id} week={data?.data.data} />}
    </div>
  );
}
