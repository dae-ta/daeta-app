/**
 * 숫자 문자열이나 숫자를 입력받아, 콤마를 넣어서 반환합니다.
 * 소수점이 있는 경우 소수부 앞에 있는 정수부에만 comma가 추가됩니다.
 *
 * @param value 숫자 문자열이나 숫자
 * @returns 콤마가 포함된 숫자 문자열
 * @context to-currency 를 deprecated 시키고 commarizeNumber 를 사용하길 기대합니다.
 * - 이 함수는 comma 를 붙이고, 소수점 자릿수를 고정시키는 역할을 하는데 이는 통화라는 표현과 다소 무관합니다.
 * - 통화에 대한 맥락은 콤마를 붙이는 것 이외에도 억, 만원, 천원 등을 붙이는 것을 포함하는데, 이 함수가 currency 라는 이름을 점유하고 있어 다른 함수를 만들기 어렵습니다.
 * - 이 함수는 comma 를 붙이는 기능과 소수점 자릿수를 고정시키는 기능을 동시에 수행하는 두 기능을 함께 사용할 케이스는 드뭅니다.
 * - 소수점을 사용해야 하는지 여부는 idl field의 nf(1f,2f...) 로 명시적 구분이 가능합니다. 대다수 comma 를 붙이는 경우는 nf 가 0f 인 경우입니다.
 * - 따라서 평소에는 commarizeNumber 를 사용하고 소수점을 고려해야 하는 경우에는 pipe(number|string, (number) => toFixedWithRoundingMode(number, 2) commarizeNumber) 를 통해 명시적으로 소수점 처리를 하는게 더 명확고 분명한 코드 입니다.
1
 * @context commarize 라는 이름을 쓰게된 이유
 * - formatNumberWithComma 라는 이름은 너무 길다.
 * - commarizeNumber 라는 이름을 github에서도 꾀 사용하고 있다. (https://github.com/search?q=commarize&type=code)
 * - 이 함수로 리턴값을 다시 파싱해서 숫자로 변환할 경우가 많은데 그때 decommarize 라는 이름을 쓰면 대구(對句)가 잘 맞고 편하다.
 * - e.g commarizeNumber <-> decommarizeNumString
 * @context 대구법 (對句法)
 * - 비슷하거나 동일한 문장 구조를 짝을 맞추어 표현의 효과를 나타내는 수사법으로, 비슷하거나 동일한 문장 구조를 짝을 맞추어 늘어놓는 표현법이다.
 * - e.g commarizeNumber <-> decommarizeNumString
 */
export const commarizeNumber = (value: string | number): string => {
  const numberAsString = String(value);
  const indexOfDecimal = numberAsString.indexOf('.');
  const thousandsSeparatorRegex = /(\d)(?=(\d{3})+(?!\d))/g;

  /* 소수점이 있는 경우에 대한 분기를 해야합니다. e.g 123.456 */
  return indexOfDecimal > -1
    ? numberAsString
        .slice(0, indexOfDecimal)
        .replace(thousandsSeparatorRegex, '$1,') +
        numberAsString.slice(indexOfDecimal)
    : numberAsString.replace(thousandsSeparatorRegex, '$1,');
};

/**
 * @description 숫자 문자열에 포함된 콤마를 제거하고 number로 변환합니다.
 */
export const decommarizeNumString = (value: string): number =>
  Number(value.replace(/,/g, ''));
