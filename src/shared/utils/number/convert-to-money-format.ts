import {commarizeNumber} from './commarize-number';

interface Unit {
  value: number;
  unit: string;
}

const UNITS: Unit[] = [
  {value: 1000000000000, unit: '조'},
  {value: 100000000, unit: '억'},
  {value: 10000, unit: '만'},
  {value: 1000, unit: '천'},
];

const findMoneyUnits = (
  collection: Unit[],
  predicate: (value: Unit) => boolean,
  defaultValue?: Unit,
): Unit[] => {
  const matchedUnits = collection.filter(predicate);

  return matchedUnits || [defaultValue] || [collection[collection.length - 1]];
};

// 영 or 만 or 천만 or 천억
type OmitUnitType = 0 | 10000 | 10000000 | 100000000000;

interface Props {
  money: number;
  needWon?: boolean;
  omitUnit?: OmitUnitType;
  units?: Unit[];
}

/**
 * 주어진 값을 한국 돈 형식으로 변경해주는 함수
 * @param money - 금액
 * @param needWon - '원'표시 여부
 * @param omitUnit - ${omitUnit}단위까지 표현됨: 생략 기준 단위(default: 10000)
 * @example
 * ```
 * // omitUnit: 1000 - 1조 9,999억 9,999만원
 * covertToMoneyFormat({
 *   money: 1999999999998,
 *   needWon: true,
 *   omitUnit: 10000,
 * });
 * ```
 * @param units - {value: 1000, unit: '천'} 형식으로 구성된 units배열
 * @returns The arithmetic mean of `x` and `y`
 *
 * @example
 * 예제
 * ```
 * // Prints "1조 9,999억원":
 * covertToMoneyFormat({
 *   money: 1999999999998,
 *   needWon: true,
 *   omitUnit: 10000000,
 * })
 * ```
 */
export const convertToMoneyFormat = ({
  money,
  needWon = true,
  omitUnit = 10000,
  units = UNITS,
}: Props) => {
  if (money < omitUnit) {
    throw new Error(
      `Money must bigger than omitUnit. money: ${money}, omitUnit: ${omitUnit}`,
    );
  }
  // '11억 4,000천'과 같이 글자 사이 간격을 표현함
  const SPACING = ' ';
  const necessaryUnits = findMoneyUnits(units, unit => money >= unit.value);

  // 단위를 치환하지 않아도 되는 케이스(ex: 900원)
  if (necessaryUnits.length === 0) {
    return `${commarizeNumber(money)}${needWon ? '원' : ''}`;
  }

  const {formattedString} = necessaryUnits.reduce(
    (acc, curr) => {
      const quotient = Math.floor(acc.money / curr.value);
      const money = acc.money - quotient * curr.value;
      if (quotient <= 0) {
        return {
          money,
          formattedString: acc.formattedString,
        };
      }
      if (curr.value < omitUnit) {
        return {
          money,
          formattedString: `${acc.formattedString} `,
        };
      }

      return {
        money,
        formattedString:
          acc.formattedString + commarizeNumber(quotient) + curr.unit + SPACING,
      };
    },
    {
      money,
      formattedString: '',
    },
  );

  return `${formattedString.trim()}${needWon ? '원' : ''}`;
};
