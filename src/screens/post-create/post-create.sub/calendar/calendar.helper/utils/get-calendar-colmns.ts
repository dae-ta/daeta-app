import dayjs from 'dayjs';
import {fillEmptyColumns} from './fill-empty-columns';

export const getCalendarColumns = (now: dayjs.Dayjs) => {
  const start = dayjs(now).startOf('month');
  const end = dayjs(now).endOf('month');
  const endDate = dayjs(end).date();

  const columns = [];

  for (let i = 0; i < endDate; i++) {
    columns.push(dayjs(start).add(i, 'day'));
  }

  const filledColumns = fillEmptyColumns({columns, start, end});

  return filledColumns;
};
