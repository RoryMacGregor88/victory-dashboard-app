import reducer, { setChartData, chartDataSelector } from './dashboard.slice';

describe('Dashboard Slice', () => {
  describe('reducer', () => {
    let beforeState;
    beforeEach(() => {
      beforeState = {
        isLoading: false,
        error: null,
      };
    });

    it('returns initial state', () => {
      const actualState = reducer(undefined, {});
      expect(actualState).toEqual(expect.objectContaining(beforeState));
    });

    describe('setChartData', () => {
      it("builds chart data by sourceId and dataset name if it doesn't exist", () => {
        const state = {},
          chartData = {
            sourceId: 'test-source',
            datasetName: 'test-dataset-name',
            data: { name: 'this is some test data' },
          },
          expected = {
            'test-source': {
              'test-dataset-name': { name: 'this is some test data' },
            },
          };

        const result = reducer(state, setChartData(chartData));
        expect(result).toEqual(expected);
      });
    });

    it('replaces chart data in state', () => {
      const state = {
          'test-source': {
            'test-dataset-name': { name: 'this is the original test data' },
          },
        },
        chartData = {
          sourceId: 'test-source',
          datasetName: 'test-dataset-name',
          data: { name: 'this is the new test data' },
        },
        expected = {
          'test-source': {
            'test-dataset-name': { name: 'this is the new test data' },
          },
        };

      const result = reducer(state, setChartData(chartData));
      expect(result).toEqual(expected);
    });
  });

  describe('selectors', () => {
    describe('chartDataSelector', () => {
      it('selects data for a specific chart', () => {
        const state = {
            dashboard: {
              'test-source': {
                'test-dataset-name': { name: 'this is the original test data' },
              },
            },
          },
          expected = { name: 'this is the original test data' };

        const result = chartDataSelector(
          'test-source',
          'test-dataset-name',
        )(state);
        expect(result).toEqual(expected);
      });

      it('returns undefined if no data is present', () => {
        const state = { dashboard: {} };

        const result = chartDataSelector(
          'test-source',
          'test-dataset-name',
        )(state);
        expect(result).toBeUndefined();
      });
    });
  });
});
