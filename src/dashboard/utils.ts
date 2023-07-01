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

export const GroupedDataTransformer = (
  data,
  groupColumn = 'Year',
  requiredColumns = null,
) => {
  const transformedData = [];
  const datum = data[0];

  const columns = requiredColumns ? requiredColumns : Object.keys(datum);

  columns.forEach(column => {
    if (column !== groupColumn) {
      let series = data.map(cur => {
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
export const BaseWidthCalculator = (data, width) => ({
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
export const GroupedWidthCalculator = (data, width) => {
  // magic numbers, tweak to change feel
  const barGapMultiplier = 1.44; // gap between bars, where 1 = bar width
  const minBarWidth = 3; // can be no narrower than this

  const keys = Object.keys(data);

  const groupCount = keys.length;
  const thinness = groupCount * 2; // increase to narrow the bars
  const dataPointCount = data?.[keys[0]].length;
  const zoneWidth = width / dataPointCount;
  const barWidth = minBarWidth + zoneWidth / (groupCount * thinness);
  const offset = barWidth * barGapMultiplier;
  return {
    barWidth,
    offset,
  };
};
