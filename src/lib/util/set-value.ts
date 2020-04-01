import { isNumber, isString, isUsable } from 'af-conditionals';

export type NumberString = number | string | bigint;

/**
 * Consistently return a known value. The return value will be one of two
 * values: `newValue` or `defaultValue`. `newValue` will be return if it is
 * usable. Otherwise, `defaultValue` will be returned. If you leave
 * `defaultValue` undefined, and `newValue` is unusable, then you will receive
 * undefined.
 *
 * @export
 * @param {*} newValue
 * @param {NumberString} [defaultValue]
 * @returns {(NumberString | undefined)}
 */
export function setValue(
  newValue: any,
  defaultValue?: NumberString
): NumberString | undefined {
  if (isUsable(newValue)) {
    if (isString(newValue) || isNumber(newValue)) {
      return newValue;
    }
    return String(newValue);
  }
  return defaultValue;
}
