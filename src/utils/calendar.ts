import {
  BigCalendarEvent,
  daysOfWeek,
  ITimeTableActivityInfo,
  ScheduleInfo,
} from '../types/services/schedule.types';

export function formatCalendarEvents(schedules: ScheduleInfo[] = []): BigCalendarEvent[] {
  let events: BigCalendarEvent[] = [];

  schedules.forEach((s) => {
    let start = new Date(
      s.schedule_date || s.schedural_start_date || s.planned_schedule_start_date,
    );
    events.push({
      id: s.id,
      title: s.event.name,
      start: new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        s.start_hour
          ? s.start_hour[0]
          : s.planned_start_hour
          ? s.planned_start_hour[0]
          : new Date().getHours(),
        s.start_hour
          ? s.start_hour[1]
          : s.planned_start_hour
          ? s.planned_start_hour[1]
          : new Date().getMinutes(),
      ),
      end: new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        s.end_hour
          ? s.end_hour[0]
          : s.planned_end_hour
          ? s.planned_end_hour[0]
          : new Date().getHours() + 1,
        s.end_hour
          ? s.end_hour[1]
          : s.planned_end_hour
          ? s.planned_end_hour[1]
          : new Date().getMinutes(),
      ),
    });
  });
  return events;
}

interface IDayTimeTable {
  [index: string]: ITimeTableActivityInfo[];
}

export function groupTimeTableByDay(arr: ITimeTableActivityInfo[]): IDayTimeTable {
  let grouped: IDayTimeTable = {};

  Object.keys(daysOfWeek)
    .slice(0, 7)
    .forEach((day) => {
      grouped[day] = [...arr.filter((tt) => tt.day_of_week == day)].sort(function (a, b) {
        return a.start_hour.localeCompare(b.start_hour);
      });
    });

  return grouped;
}

export function calculateNumPeriods(
  startHour: string,
  endHour: string,
  periodDurationInMins = 45,
): number {
  let startDate = new Date();
  startDate.setHours(Number(startHour.split(':')[0]));
  startDate.setMinutes(Number(startHour.split(':')[1]));

  let endDate = new Date();
  endDate.setHours(Number(endHour.split(':')[0]));
  endDate.setMinutes(Number(endHour.split(':')[1]));

  //calculate difference between startDate and endDate in milliseconds
  let diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / 60000 / periodDurationInMins);
}
