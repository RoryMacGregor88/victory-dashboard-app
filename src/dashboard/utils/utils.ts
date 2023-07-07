import { WALTHAM_FILTER_RANGE, MIME_TYPE, EXTENSION } from '../../constants';

import * as FileSaver from 'file-saver';
import { utils, write } from 'xlsx';
// TODO: why is this working
import { ExportData } from '~/mocks/fixtures/export_data';

/**
 * This function is necessary because the data entries do not always have the same
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys with 'null' so the data is usable.
 */
const lineDataTransformer = (data) => {
  if (!data) return;

  /** create list of every key that appears across all data */
  const uniqueKeys = [
    ...new Set(data.reduce((acc, cur) => [...acc, ...Object.keys(cur)], [])),
  ];

  /**
   * normalise each datum with every key, using data where it exists,
   * and 'null' where it does not
   */
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

/**
 * Generic Group Tranformer for Grouped Bar charts.
 * Reshapes data into the form expected by GroupedBarChart component.
 * Brought in to allow me to test bar chart width functionality for 2,3,4 and more groups
 * Similar to the groupedDataTransformer in functionality, except that you don't need
 * to declare properties
 * Generic in the sense that it supports all properties (or just some)
 * @param {*} data
 * @param {string} groupColumn - name of column used for grouping (e.g. Year)
 * @param {array[string]} columns - list of columns we want to add (miss out to use all)
 * @returns
 */
const GroupedDataTransformer = (
  data,
  groupColumn = 'Year',
  requiredColumns = null
) => {
  const transformedData = [];
  const datum = data[0];

  const columns = requiredColumns ? requiredColumns : Object.keys(datum);

  // TODO: reduce this
  columns.forEach((column) => {
    if (column !== groupColumn) {
      const series = data.map((cur) => {
        return {
          x: cur[groupColumn],
          y: cur[column],
        };
      });
      transformedData.push(series);
    }
  });

  return transformedData;
};

/**
 * Utilities to look at data and work out the width hints for bars.
 * For charts where groups (if any) are on the z axis use BaseWidthCalculator
 * For grouped charts, where groups appear side-by-side on x axis, use GroupedWidthCalculator
 * @param {*} data
 */
const BaseWidthCalculator = (data, width) => ({
  barWidth: 100.0 / data.length,
  offset: 0,
});

/**
 * Work out bar widths for Grouped Bar charts.
 * Introduced to allow us to avoid using magic numbers for formatting, and allowing us
 * to anticipate and test for having >2 groups in future
 * @param {*} data
 * @param {*} width
 * @returns {*} - object with suggested barWidth and offset values
 */
const GroupedWidthCalculator = (data, width) => {
  // magic numbers, tweak to change feel
  const barGapMultiplier = 1.44; // gap between bars, where 1 = bar width
  const minBarWidth = 3; // can be no narrower than this

  const keys = Object.keys(data);

  const groupCount = keys.length;
  const thinness = groupCount * 2; // increase to narrow the bars
  const dataPointCount = data?.[keys[0]].length; // TODO: this doesn't look right
  const zoneWidth = width / dataPointCount;
  const barWidth = minBarWidth + zoneWidth / (groupCount * thinness);
  const offset = barWidth * barGapMultiplier;

  return {
    barWidth,
    offset,
  };
};

// TODO: test this

/**
 * takes an array of sub-arrays and creates a document for each parent
 * array, and a separate worksheet for each sub array.
 */
const exportToCsv = (data: ExportData, filename) => {
  const sheets = data
    .map(({ title, data }) => ({ title, data: utils.json_to_sheet(data) }))
    .reduce((acc, { title, data }) => ({ ...acc, [title]: data }), {});

  const workbook = {
    Sheets: sheets,
    SheetNames: data.map((datum) => datum.title),
  };

  const fileBuffer = write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const dataBlob = new Blob([fileBuffer], { type: MIME_TYPE });
  FileSaver.saveAs(dataBlob, filename + EXTENSION);
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
  GroupedDataTransformer,
  BaseWidthCalculator,
  GroupedWidthCalculator,
  exportToCsv,
};
