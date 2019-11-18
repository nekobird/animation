export type RangeArray = [number, number];
 
export type NumberOrRange = number | RangeArray;

function isNumberOrRange(thing: any): boolean {
  return typeof thing === 'number' || isRangeArray(thing);
}

function isRangeArray(thing: any): boolean {
  return (
    Array.isArray(thing) === true
    && thing.length === 2
    && thing.every(member => typeof member === 'number')
  );
}

function orderRangeArray(range: RangeArray): RangeArray {
  const min = Math.min(...range);
  const max = Math.max(...range);

  return [min, max];
}

function getRangeFromNumberOrRange(range: NumberOrRange): RangeArray {
  if (typeof range === 'number') {
    return [0, range];
  }

  return range;
}

export function clamp(value: number, min: number, max: number): number;
export function clamp(value: number, range: NumberOrRange): number;
export function clamp(value: number, a: NumberOrRange, b?: number): number {
  let range: RangeArray;

  if (typeof a === 'number' && typeof b === 'number') {
    range = orderRangeArray([a, b]);
  } else if (
    isNumberOrRange(a) === true
    && typeof b === 'undefined'
  ) {
    range = getRangeFromNumberOrRange(a);
  } else {
    return value;
  }

  let [min, max] = orderRangeArray(range);

  return Math.max(min, Math.min(value, max));
}

export function getSign(value: number): number {
  const sign = Math.sign(value);

  if (sign === 0) {
    return 1;
  }

  return sign;
}

export function transform(
  value: number,
  from: NumberOrRange,
  to: NumberOrRange,
  clampResult: boolean = true,
): number {
  from = getRangeFromNumberOrRange(from);
  to = getRangeFromNumberOrRange(to);

  // Division by zero returns Infinite in JavaScript?
  let result = (value - from[0]) * ((to[1] - to[0]) / (from[1] - from[0])) + to[0];

  if (clampResult === true) {
    return clamp(result, to);
  }

  return result;
}