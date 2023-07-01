import { WALTHAM_FILTER_RANGE } from './waltham.constants';

/**
 * This function is necessary because the data entries do not always have the same
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys with 'null' so the data is usable.
 *
 * @param {Object[]} data
 * @returns {Object[]}
 */
const lineDataTransformer = (data) => {
  if (!data) return;

  // create list of every key that appears across all data
  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  // normalise each datum with every key, using data where it exists,
  // and 'null' where it does not
  return data.map((obj) =>
    uniqueKeys.reduce((acc, cur) => ({ ...acc, [cur]: obj[cur] ?? null }), {})
  );
};

/**
 * This is here because typing into a field and then deleting the input
 * results in an empty string being saved, which is then converted into
 * a number on the frontend, which JavaScript type conversion reads as zero.
 * @param {object} data
 */
const filterEmptyStrings = (data) => {
  // TODO: react hook form makes this obsolete
  if (!data) return;

  return Object.entries(data).reduce(
    (acc, [key, value]) =>
      value === '' ? acc : { ...acc, [key]: Number(value) },
    {}
  );
};

/**
 * This function transforms a key/value object into X/Y data to be rendered
 * on a line chart, and converts any 'y' values from strings to numbers, as
 * Victory can only render number values, and will break with strings.
 *
 * If a timeline of string years is passed, it will return only values within
 * that timeline. If no timeline is passed, it will return all data.
 *
 * If a timeline is provided, but the data falls outwith it, returns null.
 * @param {object} data
 * @param {number[]} timeline
 * @returns {{ x: string, y: number }[]|null}
 */
const userTargetTransformer = (data, timeline) => {
  if (!data) return;

  const result = Object.entries(data).reduce((acc, [key, value]) => {
    const numYear = Number(key);
    return !timeline || timeline.includes(numYear)
      ? [...acc, { x: key, y: value }]
      : acc;
  }, []);

  return result.length ? result : null;
};

/**
 * This is here to reduce the totals for every year across multiple tenure types
 * into a single object consisting of year ranges and total number values.
 * @param {object} data
 */
const getTargetTotals = (data) => {
  if (!data) return;

  // extract year/value objects, eg: [{ 2016: 123 }, { 2017: 456 }]
  return Object.entries(data).reduce(
    (acc, [key, targets]) =>
      key === 'totalHousing'
        ? acc
        : {
            ...acc,
            // create array of new objects with accumulated totals for values
            ...Object.entries(targets)
              .map(([year, target]) => {
                let num = Number(target);
                return { [year]: (num += acc[year] ?? 0) };
              })
              // reduce array of totals objects into a single object
              .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          },
    {}
  );
};

/**
 * @param {number} years
 * @returns {number[]}
 */
const getPastYears = (years = 5) => {
  const thisYear = new Date().getFullYear();

  let yearRange = [];
  for (let i = 0; i < years; i++) {
    yearRange = [...yearRange, thisYear - i];
  }

  return yearRange.reverse();
};

/**
 * This tallies up the user's 'total housing' target data for the last 5 years,
 * to be used in the progress wheels.
 * @param {object} obj
 */
const getUser5YearTotals = (obj) => {
  if (!obj || !Object.keys(obj).length) return;

  return getPastYears().reduce(
    (acc, cur) => (acc += obj[cur] ? Number(obj[cur]) : 0),
    0
  );
};

/**
 * This function builds an array of string years from the years
 * present in the api data and target data, to allow the charts to
 * pad any missing values, to create a consistent timeline.
 *
 * The timeline ranges from the earliest year in both datasets, to the
 * latest year in the api data, as was requested.
 *
 * Also pads up to a given constant, at a minimum.
 * @param {object[]} apiData
 * @param {object} targets
 * @returns {number[]}
 */
const getDataTimeline = (apiData, targets = {}) => {
  if (!apiData) return;

  // if uninitiated by user, targets will be undefined, but
  // defaulted to empty object
  const hasTargets = !!Object.keys(targets).length;

  const apiYears = apiData.map((obj) => Number(obj.startYear));

  // if targets is undefined, defaulted to object and will return empty array
  const targetYears = hasTargets
    ? Object.keys(targets).map((year) => Number(year))
    : [];

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears);
  const max = Math.max(...allYears);

  const yearRange = max - min;

  // ensures a minimum year range displayed on charts
  const startPoint =
    yearRange < WALTHAM_FILTER_RANGE
      ? min - (WALTHAM_FILTER_RANGE - yearRange)
      : min;

  // TODO: reduce this?
  let timeline = [];
  for (let i = startPoint; i <= max; i++) {
    timeline = [...timeline, i];
  }

  return timeline;
};

/**
 * @param {object[]} chartData : all chart data
 * @param {string} selectedType : currently selected type
 * @param {string} allTypes: text for 'all of the above' option
 * @param {Object} mapping : object mapping selectedType values to names used in data
 * @param {string} yearField
 * @returns {object[]} : data filtered according to current filter
 */
const filterByType = (
  chartData,
  selectedType,
  allTypes,
  mapping,
  yearField = 'startYear'
) => {
  return selectedType === allTypes
    ? chartData
    : chartData?.map((datum) => ({
        [yearField]: datum[yearField],
        [mapping[selectedType]]: datum[mapping[selectedType]],
      }));
};

/**
 * @param {number[]} timeline
 * @param {number} selectedYear
 * @param {number} range
 * @returns {number[]}
 */
const getFilteredTimeline = (
  timeline,
  selectedYear,
  range = WALTHAM_FILTER_RANGE
) => {
  const index = timeline?.indexOf(selectedYear);
  return timeline?.slice(index - range, index + 1);
};

/**
 * @param {number[]} timeline
 * @param {object[]} data : actual data. data points are properties
 * @param {object} targets : target data. array of objects
 * @param {string} targetProperty : target property in targets objects to use
 * @returns {object[]} : actual data, values replaced with percentages relative to target
 */
const computePercentages = (timeline, data, targets, targetProperty) => {
  // we return the data in the same shape as data, but values are
  // replaced with the percentage relative to the corresponding target
  // for years where data is zero, or target is zero, or both, then we use null // to prevent the chart from being misleading. This may result in gaps in the // chart

  // No data points can be constructed if both datasets are not present
  if (!data || !targets) return;

  return timeline?.map((year) => {
    const obj = data.find((datum) => datum.startYear === year) ?? {};

    let percentage = null;
    if (!!obj[targetProperty] && !!targets[obj.startYear]) {
      percentage = Math.round(
        (obj[targetProperty] / targets[obj.startYear]) * 100
      );
    }
    return {
      startYear: year.toString(),
      [targetProperty]: percentage,
    };
  });
};

export {
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getPastYears,
  getUser5YearTotals,
  getDataTimeline,
  filterByType,
  getFilteredTimeline,
  computePercentages,
};
