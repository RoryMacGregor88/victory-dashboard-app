import { DEFAULT_FILTER_RANGE, MIME_TYPE, EXTENSION } from '../../constants';

import * as FileSaver from 'file-saver';
import { utils, write } from 'xlsx';
import { TargetCategory, Targets } from '../../types';
import { TimelineData, TransformedTargets } from './types';
import { ExportData } from '~/mocks/fixtures';

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
  targetDataset: Targets[TargetCategory],
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
const getUser5YearTotals = (targetDataset: Targets[TargetCategory]) => {
  if (!targetDataset || !Object.keys(targetDataset).length) return;

  return getPastYears().reduce(
    (acc, year) => (acc += targetDataset[year] ?? 0),
    0
  );
};

interface GetDataTimelineArgs {
  apiData: TimelineData;
  targets: Targets[TargetCategory];
}

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
const getDataTimeline = ({ apiData, targets = {} }: GetDataTimelineArgs) => {
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
    yearRange < DEFAULT_FILTER_RANGE
      ? min - (DEFAULT_FILTER_RANGE - yearRange)
      : min;

  let timeline: number[] = [];
  for (let i = startPoint; i <= max; i++) {
    timeline = [...timeline, i];
  }

  return timeline;
};

// TODO: type this properly
interface FilterByTypeArgs<T> {
  apiData: T[];
  selectedType: keyof T | null;
}

const filterByType = <T>({
  apiData,
  selectedType,
}: FilterByTypeArgs<T & { startYear: number }>) => {
  if (!selectedType) return apiData;

  return apiData.map((datum) => ({
    startYear: datum.startYear,
    [selectedType]: Number(datum[selectedType]),
  }));
};

const getFilteredTimeline = (
  timeline: number[],
  selectedYear: number,
  range = DEFAULT_FILTER_RANGE
) => {
  const index = timeline?.indexOf(selectedYear);
  return timeline?.slice(index - range, index + 1);
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
  if (!datum) return null;

  const filteredKeys = Object.keys(datum).filter((key) => ranges.includes(key)),
    total = filteredKeys.reduce((acc, cur) => (acc += datum[cur]), 0);

  return `${ranges.length > 1 ? 'Total: ' : ''}${total}`;
};

export {
  userTargetTransformer,
  getTargetTotals,
  getPastYears,
  getUser5YearTotals,
  getDataTimeline,
  filterByType,
  getFilteredTimeline,
  GroupedDataTransformer,
  BaseWidthCalculator,
  exportToCsv,
  labelsForArrayOfObjectsInclusive,
  getStackDatumTotal,
};
