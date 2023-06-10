/**
 * Creates an array a labels from an array of objects whose properties
 * we want to sum up
 *
 * @param {object[]} data - Data to generate labels for
 * @param {string} excludeProperty - Do not include this property in the same (e.g. If it's a label)
 * @param {function=} formatter - Optional function which takes an object and renders it as text
 *
 * @returns {any[]} An array of labels to appear over each data point
 */

const labelsForArrayOfObjects = (data, excludeProperty, formatter) => {
  if (!data || !data.length) {
    return [];
  }
  const fieldsToAddUp = Object.keys(data[0]).filter(
    (item) => item !== excludeProperty
  );
  return data.map((item) => {
    let total = 0;
    fieldsToAddUp.forEach((fieldName) => (total += item[fieldName]));
    return formatter ? formatter(total) : total;
  });
};

/**
 * Creates an array a labels from an array of objects whose properties
 * we want to sum up. We supply an array of properties whose values we need to add up
 *
 * @param {object[]} data - Data to generate labels for
 * @param {string[]} includeProperties - Only sum properties in this list
 * @param {(item: number) => string} formatter - Optional function which takes an object and renders it as text
 *
 * @returns {any[]} An array of labels to appear over each data point
 */

const labelsForArrayOfObjectsInclusive = (
  data,
  includeProperties,
  formatter
) => {
  if (!data || !data.length) {
    return [];
  }
  const fieldsToAddUp = Object.keys(data[0]).filter((item) =>
    includeProperties.includes(item)
  );
  return data.map((obj) => {
    // TODO: reduce this
    let total = 0;
    fieldsToAddUp.forEach((fieldName) => (total += obj[fieldName] ?? 0));
    return formatter ? formatter(total) : total;
  });
};

/**
 * Calculates the totals of a stack chart's datum, excluding all properties
 * except those specified, and returning a varied string depending on whether
 * there is one or multiple properties.
 *
 * @param {object} datum
 * @param {string[]} ranges
 * @returns {string}
 */
const getStackDatumTotal = (datum, ranges) => {
  if (!datum) return;

  const filteredKeys = Object.keys(datum).filter((key) => ranges.includes(key));

  const total = filteredKeys.reduce((acc, cur) => (acc += datum[cur]), 0);

  return `${ranges.length > 1 ? 'Total: ' : ''}${total}`;
};

export {
  labelsForArrayOfObjects,
  labelsForArrayOfObjectsInclusive,
  getStackDatumTotal,
};
