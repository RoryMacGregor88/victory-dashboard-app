import { WALTHAM_FILTER_RANGE, MIME_TYPE, EXTENSION } from '../../constants';

import * as FileSaver from 'file-saver';
import { utils, write } from 'xlsx';
import { Targets } from '../../types';
import {
  HousingApprovalsObjectArray,
  TimelineData,
  TransformedTargets,
} from './types';
import { ExportData } from '~/mocks/fixtures';

/**
 * This function is necessary because the data entries do not always have the same
 * keys, and victory does not accept missing keys. It does however accept 'null'
 * values, so this fills any missing keys with 'null' so the data is usable.
 */
const lineDataTransformer = (
  data: HousingApprovalsObjectArray
): HousingApprovalsObjectArray | undefined => {
  if (!data) return;

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

/**
 * This is here because typing into a field and then deleting the input
 * results in an empty string being saved, which is then converted into
 * a number on the frontend, which JavaScript type conversion reads as zero.
 * @param {object} data
 */
const filterEmptyStrings = (data: unknown) => {
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
 * If a timeline of number years is passed, it will return only values within
 * that timeline. If no timeline is passed, it will return all data unfiltered.
 *
 * If a timeline is provided, but the data falls outwith it, returns null.
 */
const userTargetTransformer = (
  targetDataset: Targets[string],
  timeline: number[]
): TransformedTargets | null => {
  if (!targetDataset) return null;

  const transformedTargets = Object.entries(targetDataset).reduce(
    (acc: TransformedTargets, [key, value]) => {
      const numYear = Number(key);
      return !timeline || timeline.includes(numYear)
        ? [...acc, { x: key, y: value }]
        : acc;
    },
    []
  );

  return transformedTargets.length ? transformedTargets : null;
};

/**
 * This reduces the values for each year across multiple tenure types into
 * a single object consisting of the year and the total number value.
 */
const getTargetTotals = (data: Targets) => {
  if (!data) return;

  return Object.entries(data).reduce(
    (acc: { [year: string]: number }, [key, tenureTargets]) => {
      /** filter out 'totalHousing' object, as it is a separate totalled value */
      if (key === 'totalHousing') return acc;

      const yearTotal = Object.entries(tenureTargets)
        .map(([year, value]) => ({ [year]: (value += acc[year] ?? 0) }))
        /** reduce array of year/total objects into a single object */
        .reduce((a, c) => ({ ...a, ...c }), {});

      return { ...acc, ...yearTotal };
    },
    {}
  );
};

const getPastYears = (years = 5) => {
  const thisYear = new Date().getFullYear();

  let yearRange: number[] = [];
  for (let i = 0; i < years; i++) {
    yearRange = [...yearRange, thisYear - i];
  }

  return yearRange.reverse();
};

/**
 * This tallies up the user's 'total housing' target data for
 * the last 5 years, to be used in the first progress wheel.
 */
const getUser5YearTotals = (targetDataset: Targets[string]) => {
  if (!targetDataset || !Object.keys(targetDataset).length) return;

  return getPastYears().reduce(
    (acc, year) => (acc += targetDataset[year] ?? 0),
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
 * Also pads up to a minimum number of years.
 */
const getDataTimeline = (apiData: TimelineData, targets = {}) => {
  // TODO: do this for all?
  if (!apiData) return;

  /**
   * if uninitiated by user, targets will be undefined,
   * but defaulted here to empty object
   */
  const hasTargets = !!Object.keys(targets).length;

  const apiYears = apiData.map((obj) => obj.startYear);

  /** if targets is undefined, defaulted to object and will return empty array */
  const targetYears = hasTargets
    ? Object.keys(targets).map((year) => Number(year))
    : [];

  const allYears = [...apiYears, ...targetYears];

  const min = Math.min(...allYears);
  const max = Math.max(...allYears);

  const yearRange = max - min;

  /** ensures a minimum year range displayed on charts */
  const startPoint =
    yearRange < WALTHAM_FILTER_RANGE
      ? min - (WALTHAM_FILTER_RANGE - yearRange)
      : min;

  let timeline: number[] = [];
  for (let i = startPoint; i <= max; i++) {
    timeline = [...timeline, i];
  }

  return timeline;
};

// TODO: type this properly
interface FilterByTypeArgs<T, U> {
  data: T;
  selectedType: U;
}

const filterByType = <T extends T[number][]>({
  data,
  selectedType,
}: FilterByTypeArgs<T, keyof T[number]>) => {
  // TODO: refactor this back to where it was
  const test = data.map((datum: T[number]) => ({
    startYear: datum.startYear,
    [selectedType]: datum[selectedType],
  }));
  return test;
};

const getFilteredTimeline = (
  timeline: number[] | undefined,
  selectedYear: number | undefined,
  range = WALTHAM_FILTER_RANGE
) => {
  if (!timeline || !selectedYear) return;

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

interface ComputePercentagesArgs<T, U> {
  timeline: number[];
  data: T;
  targets: Targets;
  percentageProperty: U;
}

// TODO: this comment needs to be clearer
const computePercentages = <T extends T[number][]>({
  timeline,
  data,
  targets,
  percentageProperty,
}: ComputePercentagesArgs<T, keyof T[number]>) => {
  /**
   * we return the data in the same shape as data, but values are
   * replaced with the percentage relative to the corresponding target
   * for years where data is zero, or target is zero, or both, then we
   * use null  to prevent the chart from being misleading. This may result
   * in gaps in the  chart

   * No data points can be constructed if both datasets are not present
  */
  if (!data || !targets) return;

  return timeline.map((year: number) => {
    const obj: T[number] = data.find((datum) => datum.startYear === year) ?? {};

    const percentage =
      obj[percentageProperty] && targets[obj.startYear]
        ? Math.round((obj[percentageProperty] / targets[obj.startYear]) * 100)
        : null;

    return {
      startYear: year.toString(),
      [percentageProperty]: percentage,
    };
  });
};

// TODO: this needs to go into where it is used, like the others
// TODO: actually being used anywhere?
/**
 * Generic Group Tranformer for Grouped Bar charts.
 * Reshapes data into the form expected by GroupedBarChart component.
 * Brought in to allow me to test bar chart width functionality for 2,3,4 and more groups
 * Similar to the groupedDataTransformer in functionality, except that you don't need
 * to declare properties
 * Generic in the sense that it supports all properties (or just some)
 */
const GroupedDataTransformer = (data, requiredColumns = null) => {
  // TODO: change data so that it's just an object, not inside an array
  const datum = data[0];

  const columns = requiredColumns ?? Object.keys(datum);

  return columns.reduce((acc, cur) => {
    const series = data.map((datum) => ({
      x: datum.startYear,
      y: datum[cur],
    }));

    return [...acc, series];
  }, []);
};

/**
 * Utilities to look at data and work out the width hints for bars.
 * For charts where groups (if any) are on the z axis use BaseWidthCalculator
 * For grouped charts, where groups appear side-by-side on x axis, use
 * GroupedWidthCalculator
 */
const BaseWidthCalculator = (data: object[]) => ({
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
const exportToCsv = (data: ExportData, filename: string) => {
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
