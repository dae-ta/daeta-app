import dayjs from 'dayjs';

type Props = {
  columns: dayjs.Dayjs[];
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};

export const fillEmptyColumns = ({columns, start, end}: Props) => {
  const filledColumns = [...columns];

  const startDay = dayjs(start).get('day');

  for (let i = 1; i <= startDay; i++) {
    const date = dayjs(start).subtract(i, 'day');
    filledColumns.unshift(date);
  }

  const endDay = dayjs(end).get('day');

  for (let i = 1; i <= 6 - endDay; i++) {
    const date = dayjs(end).add(i, 'day');
    filledColumns.push(date);
  }

  return filledColumns;
};
