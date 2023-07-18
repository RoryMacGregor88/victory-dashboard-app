import { HousingApprovalsObjectArray } from '../../../utils/types';

/**
 * This function is necessary because the data entries do not always have the same
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys with 'null' so the data is usable.
 */
export const housingApprovalsTransformer = (
  data: HousingApprovalsObjectArray
): HousingApprovalsObjectArray => {
  const allKeys = data.reduce((acc: string[], cur) => {
    const keys = Object.keys(cur);
    return [...acc, ...keys];
  }, []);

  const uniqueKeys = [...new Set(allKeys)];

  /**
   * recreates each datum with every key from the list of unique keys,
   * setting the values to data from datum where it exists, and'null'
   * where it does not
   */
  const padUniqueYears = (obj: HousingApprovalsObjectArray[number]) =>
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {});

  return data.map(padUniqueYears);
};
