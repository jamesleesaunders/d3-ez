import * as d3 from "d3";

/**
 * Base Functions - Data Parse
 *
 */
export default function(data) {

	let levels = (function() {
		if (data["key"] !== undefined) {
			return 1;
		} else {
			return 2;
		}
	})();

	let groupName = (function() {
		let ret;
		if (1 === levels) {
			ret = d3.values(data)[0];
		}

		return ret;
	})();

	let groupNames = (function() {
		let ret;
		if (levels > 1) {
			ret = data.map(function(d) {
				return d.key;
			});
		}

		return ret;
	})();

	let groupTotals = (function() {
		let ret;
		if (levels > 1) {
			ret = {};
			d3.map(data).values().forEach(function(d) {
				let groupName = d.key;
				d.values.forEach(function(d) {
					let categoryValue = +d.value;

					ret[groupName] = (typeof(ret[groupName]) === "undefined" ? 0 : ret[groupName]);
					ret[groupName] += categoryValue;
				});
			});
		}

		return ret;
	})();

	let groupTotalsMax = (function() {
		let ret;
		if (levels > 1) {
			ret = d3.max(d3.values(groupTotals));
		}

		return ret;
	})();

	let union = function(array1, array2) {
		let ret = [];
		let arr = array1.concat(array2);
		let len = arr.length;
		let assoc = {};

		while (len--) {
			let item = arr[len];

			if (!assoc[item]) {
				ret.unshift(item);
				assoc[item] = true;
			}
		}

		return ret;
	};

	let categoryNames = (function() {

		let ret = [];
		if (1 === levels) {
			ret = d3.values(data.values).map(function(d) {
				return d.key;
			});

		} else {
			d3.map(data).values().forEach(function(d) {
				let tmp = [];
				d.values.forEach(function(d, i) {
					let categoryName = d.key;
					tmp[i] = categoryName;
				});

				ret = union(tmp, ret);
			});
		}

		return ret;
	})();

	let categoryTotal = (function() {
		let ret;
		if (1 === levels) {
			ret = d3.sum(data.values, function(d) {
				return d.value;
			});
		}

		return ret;
	})();

	let categoryTotals = (function() {
		let ret;
		if (levels > 1) {
			ret = {};
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					let categoryName = d.key;
					let categoryValue = +d.value;

					ret[categoryName] = (typeof(ret[categoryName]) === "undefined" ? 0 : ret[categoryName]);
					ret[categoryName] += categoryValue;
				});
			});
		}

		return ret;
	})();

	let categoryTotalsMax = (function() {
		let ret;
		if (levels > 1) {
			ret = d3.max(d3.values(categoryTotals));
		}

		return ret;
	})();

	let minValue = (function() {
		let ret;
		if (1 === levels) {
			ret = d3.min(data.values, function(d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
				});
			});
		}

		return +ret;
	})();

	let maxValue = (function() {
		let ret;
		if (1 === levels) {
			ret = d3.max(data.values, function(d) {
				return +d.value;
			});

		} else {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, +d.value]));
				});
			});
		}

		return +ret;
	})();

	let decimalPlaces = function(num) {
		let match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) { return 0; }
		let ret = Math.max(
			0,
			// Number of digits right of decimal point.
			(match[1] ? match[1].length : 0)
			// Adjust for scientific notation.
			-
			(match[2] ? +match[2] : 0));

		return ret;
	};

	let maxDecimalPlace = (function() {
		let ret = 0;
		if (levels > 1) {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = d3.max([ret, decimalPlaces(d.value)])
				});
			});
		}

		return ret;
	})();

	// If thresholds values are not already set attempt to auto-calculate some thresholds
	let thresholds = (function() {
		let distance = maxValue - minValue;
		let ret = [
      +(minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
		];

		return ret;
	})();

	let my = {
		levels: levels,
		groupName: groupName,
		groupNames: groupNames,
		groupTotals: groupTotals,
		groupTotalsMax: groupTotalsMax,
		categoryNames: categoryNames,
		categoryTotal: categoryTotal,
		categoryTotals: categoryTotals,
		categoryTotalsMax: categoryTotalsMax,
		minValue: minValue,
		maxValue: maxValue,
		maxDecimalPlace: maxDecimalPlace,
		thresholds: thresholds
	};

	return my;
}
