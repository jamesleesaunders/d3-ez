import * as d3 from "d3";

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
export default function dataTransform(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;
	const coordinateKeys = ['x', 'y', 'z'];

	/**
	 * Data Type
	 *
	 * @type {Number}
	 */
	const dataType = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
	 * Row Key
	 *
	 * @returns {Array}
	 */
	const rowKey = function() {
		if (dataType === SINGLE_SERIES) {
			return Object.values(data)[0];
		}
	}();

	/**
	 * Row Total
	 *
	 * @returns {Array}
	 */
	const rowTotal = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, (d) => d.value);
		}
	}();

	/**
	 * Row Keys
	 *
	 * @returns {Array}
	 */
	const rowKeys = function() {
		if (dataType === MULTI_SERIES) {
			return data.map((d) => d.key);
		}
	}();

	/**
	 * Row Totals
	 *
	 * @returns {Array}
	 */
	const rowTotals = function() {
		if (dataType === MULTI_SERIES) {
			const ret = {};
			data.forEach((item) => {
				const rowKey = item.key;

				item.values.forEach((value) => {
					ret[rowKey] = ret[rowKey] || 0;
					ret[rowKey] += value.value;
				});
			});
			return ret;
		}
	}();

	/**
	 * Row Totals Min
	 *
	 * @returns {number}
	 */
	const rowTotalsMin = function() {
		if (dataType === MULTI_SERIES) {
			return d3.min(Object.values(rowTotals));
		}
	}();

	/**
	 * Row Totals Max
	 *
	 * @returns {number}
	 */
	const rowTotalsMax = function() {
		if (dataType === MULTI_SERIES) {
			return d3.max(Object.values(rowTotals));
		}
	}();

	/**
	 * Row Value Keys
	 *
	 * @returns {Array}
	 */
	const rowValuesKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return Object.keys(data.values[0]);
		} else {
			return Object.keys(data[0].values[0]);
		}
	}();

	/**
	 * Union Two Arrays
	 *
	 * @private
	 * @param {Array} array1 - First Array.
	 * @param {Array} array2 - First Array.
	 * @returns {Array}
	 */
	const union = function(array1, array2) {
		const ret = [];
		const arr = array1.concat(array2);
		let len = arr.length;
		const assoc = {};

		while (len--) {
			const item = arr[len];

			if (!assoc[item]) {
				ret.unshift(item);
				assoc[item] = true;
			}
		}

		return ret;
	};

	/**
	 * Column Keys
	 *
	 * @returns {Array}
	 */
	const columnKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return data.values.map((d) => d.key);
		}

		let ret = [];
		data.forEach((item) => {
			const tmp = [];
			item.values.forEach((value) => {
				tmp.push(value.key);
			});
			ret = Array.from(new Set([...tmp, ...ret]));
		});

		return ret;
	}();

	/**
	 * Column Totals
	 *
	 * @returns {Array}
	 */
	const columnTotals = function() {
		if (dataType !== MULTI_SERIES) {
			return;
		}

		let ret = {};
		data.forEach((item) => {
			item.values.forEach((value) => {
				const columnName = value.key;
				ret[columnName] = ret[columnName] || 0;
				ret[columnName] += value.value;
			});
		});

		return ret;
	}();

	/**
	 * Column Totals Min
	 *
	 * @returns {Array}
	 */
	const columnTotalsMin = function() {
		if (dataType === MULTI_SERIES) {
			return d3.min(Object.values(columnTotals));
		}
	}();

	/**
	 * Column Totals Max
	 *
	 * @returns {Array}
	 */
	const columnTotalsMax = function() {
		if (dataType === MULTI_SERIES) {
			return d3.max(Object.values(columnTotals));
		}
	}();

	/**
	 * Value Min
	 *
	 * @returns {number}
	 */
	const valueMin = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, (d) => +d.value);
		}

		let ret;
		data.forEach((item) => {
			item.values.forEach((value) => {
				ret = (typeof (ret) === "undefined" ? value.value : Math.min(ret, +value.value));
			});
		});

		return +ret;
	}();

	/**
	 * Value Max
	 *
	 * @returns {number}
	 */
	const valueMax = (function() {
		let ret;

		if (dataType === SINGLE_SERIES) {
			ret = Math.max(...data.values.map((d) => +d.value));
		} else {
			data.forEach((item) => {
				item.values.forEach((value) => {
					ret = (typeof ret !== "undefined" ? Math.max(ret, +value.value) : +value.value);
				});
			});
		}

		return ret;
	})();

	/**
	 * Value Extent
	 *
	 * @returns {Array}
	 */
	const valueExtent = function() {
		return [valueMin, valueMax];
	}();

	/**
	 * Value Extent Stacked
	 *
	 * @returns {Array}
	 */
	const valueExtentStacked = (function() {
		let lowestNegativeSum = Infinity;
		let highestPositiveSum = -Infinity;

		if (dataType === MULTI_SERIES) {
			data.forEach(row => {
				const [negativeSum, positiveSum] = row.values.reduce(
					(acc, column) => {
						const value = column.value;
						if (value < 0) {
							acc[0] += value;
						} else if (value > 0) {
							acc[1] += value;
						}
						return acc;
					},
					[0, 0]
				);

				lowestNegativeSum = Math.min(lowestNegativeSum, negativeSum);
				highestPositiveSum = Math.max(highestPositiveSum, positiveSum);
			});
		}
		// Check if lowestNegativeSum is still Infinity (no negative values found), if so, set it to 0
		const finalLowestNegativeSum = lowestNegativeSum === Infinity ? 0 : lowestNegativeSum;

		// Check if highestPositiveSum is still -Infinity (no positive values found), if so, set it to 0
		const finalHighestPositiveSum = highestPositiveSum === -Infinity ? 0 : highestPositiveSum;

		// Return the final results as an array
		return [finalLowestNegativeSum, finalHighestPositiveSum];
	})();

	/**
	 * Coordinates Min
	 *
	 * @returns {Array}
	 */
	const coordinatesMin = (function() {
		let ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach((key) => {
				ret[key] = Math.min(...data.values.map((d) => +d[key]));
			});
			return ret;

		} else {
			data.forEach((item) => {
				item.values.forEach((value) => {
					coordinateKeys.forEach((key) => {
						ret[key] = (key in ret ? Math.min(ret[key], +value[key]) : +value[key]);
					});
				});
			});
		}

		return ret;
	})();


	/**
	 * Coordinates Max
	 *
	 * @returns {Array}
	 */
	const coordinatesMax = (function() {
		let ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach((key) => {
				ret[key] = Math.max(...data.values.map((d) => +d[key]));
			});
			return ret;

		} else {
			data.forEach((item) => {
				item.values.forEach((value) => {
					coordinateKeys.forEach((key) => {
						ret[key] = (key in ret ? Math.max(ret[key], +value[key]) : +value[key]);
					});
				});
			});
		}

		return ret;
	})();

	/**
	 * Coordinates Extent
	 *
	 * @returns {Array}
	 */
	const coordinatesExtent = function() {
		let ret = {};
		coordinateKeys.forEach(function(key) {
			ret[key] = [coordinatesMin[key], coordinatesMax[key]]
		});

		return ret;
	}();

	/**
	 * How Many Decimal Places?
	 *
	 * @private
	 * @param {number} num - Float.
	 * @returns {number}
	 */
	const decimalPlaces = function(num) {
		const match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}

		return Math.max(
			0,
			// Number of digits right of decimal point.
			(match[1] ? match[1].length : 0)
			// Adjust for scientific notation.
			-
			(match[2] ? +match[2] : 0)
		);
	};

	/**
	 * Max Decimal Place
	 *
	 * @returns {number}
	 */
	const maxDecimalPlace = (function() {
		let ret = 0;
		if (dataType === MULTI_SERIES) {
			data.forEach((item) => {
				item.values.forEach((value) => {
					ret = Math.max(ret, decimalPlaces(value.value));
				});
			});
		}

		// toFixed must be between 0 and 20
		return ret > 20 ? 20 : ret;
	})();

	/**
	 * Thresholds
	 *
	 * @returns {Array}
	 */
	const thresholds = function() {
		const distance = valueMax - valueMin;
		const bands = [0.25, 0.50, 0.75, 1.00];

		return bands.map((v) => Number((valueMin + (v * distance)).toFixed(maxDecimalPlace)));
	}();


	/**
	 * Summary
	 *
	 * @returns {Array}
	 */
	const summary = function() {
		return {
			dataType: dataType,
			rowKey: rowKey,
			rowTotal: rowTotal,
			rowKeys: rowKeys,
			rowTotals: rowTotals,
			rowTotalsMin: rowTotalsMin,
			rowTotalsMax: rowTotalsMax,
			rowValuesKeys: rowValuesKeys,
			columnKeys: columnKeys,
			columnTotals: columnTotals,
			columnTotalsMin: columnTotalsMin,
			columnTotalsMax: columnTotalsMax,
			valueMin: valueMin,
			valueMax: valueMax,
			valueExtent: valueExtent,
			valueExtentStacked: valueExtentStacked,
			coordinatesMin: coordinatesMin,
			coordinatesMax: coordinatesMax,
			coordinatesExtent: coordinatesExtent,
			maxDecimalPlace: maxDecimalPlace,
			thresholds: thresholds
		}
	};

	/**
	 * Rotate Data
	 *
	 * @returns {Array}
	 */
	const rotate = function() {
		const columnKeys = data.map((d) => d.key);
		const rowKeys = data[0].values.map((d) => d.key);

		const rotated = rowKeys.map((rowKey, rowIndex) => {
			const values = columnKeys.map((columnKey, columnIndex) => {
				// Copy the values from the original object
				const values = Object.assign({}, data[columnIndex].values[rowIndex]);
				// Swap the key over
				values.key = columnKey;

				return values;
			});

			return {
				key: rowKey,
				values: values
			};
		});

		return rotated;
	};

	return {
		summary: summary,
		rotate: rotate
	};

}
