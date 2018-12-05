/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.d3 = global.d3 || {}, global.d3.ez = factory(global.d3));
}(this, (function (d3) { 'use strict';

var version = "3.3.14";
var license = "GPL-2.0";

/**
 * Reusable Credit Tag Component
 *
 * @module
 */
function componentCreditTag () {

	/* Default Properties */
	var text = "d3-ez.net";
	var href = "http://d3-ez.net";

	/**
  * Constructor
  *
  * @constructor
  * @alias creditTag
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		var creditTag = selection.selectAll("#creditTag").data([0]).enter().append("g").attr("id", "creditTag");

		var creditText = creditTag.append("text").text(text).style("text-anchor", "end").attr("baseline", "middle").attr("xlink:href", href).on("click", function () {
			window.open(href);
		});
	}

	/**
  * Text Getter / Setter
  *
  * @param {string} _v - Credit tag text.
  * @returns {*}
  */
	my.text = function (_v) {
		if (!arguments.length) return text;
		text = _v;
		return this;
	};

	/**
  * Link Getter / Setter
  *
  * @param {string} _v - Credit tag link.
  * @returns {*}
  */
	my.href = function (_v) {
		if (!arguments.length) return href;
		href = _v;
		return this;
	};

	return my;
}

/**
 * Reusable Title Component
 *
 * @module
 */
function componentTitle () {

	/* Default Properties */
	var mainText = "Title";
	var subText = "Sub Title";
	var height = 40;
	var width = 200;

	/**
  * Constructor
  *
  * @constructor
  * @alias title
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.selectAll("#titleGroup").data([0]).enter().append("g").attr("id", "titleGroup");
		var titleGroup = selection.select("#titleGroup");

		titleGroup.selectAll(".title").data([mainText]).enter().append("text").classed("title", true).text(function (d) {
			return d;
		});
		var title = titleGroup.select(".title").text(mainText);

		titleGroup.selectAll(".subTitle").data([subText]).enter().append("text").classed("subTitle", true).text(function (d) {
			return d;
		});
		var subTitle = titleGroup.select(".subTitle").text(subText);

		// Centre Text
		// let titleOffset = 0 - (title.node().getBBox().width / 2);
		// let subTitleOffset = 0 - (subTitle.node().getBBox().width / 2);
		title.style("text-anchor", "middle").attr("transform", "translate(0, 15)");
		subTitle.style("text-anchor", "middle").attr("transform", "translate(0, 30)");
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Main Text Getter / Setter
  *
  * @param {string} _v - Main text title.
  * @returns {*}
  */
	my.mainText = function (_v) {
		if (!arguments.length) return mainText;
		mainText = _v;
		return this;
	};

	/**
  * Sub Text Getter / Setter
  *
  * @param {string} _v - Sub text description.
  * @returns {*}
  */
	my.subText = function (_v) {
		if (!arguments.length) return subText;
		subText = _v;
		return this;
	};

	return my;
}

/**
 * Chart Base
 *
 * @module
 */
function base () {

	/* Default Properties */
	var svg = void 0;
	var canvas = void 0;
	var width = 600;
	var height = 400;
	var margin = { top: 15, right: 15, bottom: 15, left: 15 };
	var canvasW = void 0;
	var canvasH = void 0;
	var chartTop = 0;
	var classed = "d3ez";

	var chart = void 0;
	var legend = void 0;
	var title = void 0;
	var creditTag = componentCreditTag();
	var yAxisLabel = "";

	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		canvasW = width - (margin.left + margin.right);
		canvasH = height - (margin.top + margin.bottom);

		// Init Chart
		chart.dispatch(dispatch).width(canvasW).height(canvasH);

		// Init Legend
		if (legend) {
			legend.width(150).height(200);
			chart.width(chart.width() - legend.width());
		}

		// Init Title
		if (title) {
			chartTop = title.height();
			chart.height(chart.height() - title.height());
		}

		// Init Credit Tag
		creditTag.text("d3-ez.net").href("http://d3-ez.net");
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias base
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = selection.append("svg").classed(classed, true).attr("width", width).attr("height", height);

			canvas = svg.append("g").classed("canvas", true);
			canvas.append("g").classed("chartbox", true);
			canvas.append("g").classed("legendbox", true);
			canvas.append("g").classed("titlebox", true);
			canvas.append("g").classed("creditbox", true);
		} else {
			canvas = svg.select(".canvas");
		}

		// Update the canvas dimensions
		canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", canvasW).attr("height", canvasH);

		selection.each(function (data) {
			init(data);

			// Chart
			canvas.select(".chartbox").datum(data).attr("transform", "translate(" + 0 + "," + chartTop + ")").call(chart);

			// Legend
			if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
				if (typeof chart.colorScale === "function") {
					legend.colorScale(chart.colorScale());
				}
				if (typeof chart.sizeScale === "function") {
					legend.sizeScale(chart.sizeScale());
				}
				canvas.select(".legendbox").attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")").call(legend);
			}

			// Title
			if (title) {
				canvas.select(".titlebox").attr("transform", "translate(" + canvasW / 2 + "," + 0 + ")").call(title);
			}

			// Credit Tag
			canvas.select(".creditbox").attr("transform", "translate(" + canvasW + "," + canvasH + ")").call(creditTag);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Chart Getter / Setter
  *
  * @param {d3.ez.chart} _v - Chart component.
  * @returns {*}
  */
	my.chart = function (_v) {
		if (!arguments.length) return chart;
		chart = _v;
		return this;
	};

	/**
  * Legend Getter / Setter
  *
  * @param {d3.ez.component.legend} _v - Legend component.
  * @returns {*}
  */
	my.legend = function (_v) {
		if (!arguments.length) return legend;
		legend = _v;
		return this;
	};

	/**
  * Title Getter / Setter
  *
  * @param {d3.ez.component.title} _v - Title component.
  * @returns {*}
  */
	my.title = function (_v) {
		if (!arguments.length) return title;
		if (typeof _ === "string") {
			// If the caller has passed a plain string convert it to a title object.
			title = componentTitle().mainText(_).subText("");
		} else {
			title = _v;
		}
		return this;
	};

	/**
  * Y Axix Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Colour Palettes
 *
 * @module
 * @example
 * d3.ez.palette.categorical(1);
 * d3.ez.palette.diverging(1);
 * d3.ez.palette.sequential("#ff0000", 9);
 * d3.ez.palette.lumShift(d3.ez.palette.categorical(1), 0.2);
 */
var palette = {
	categorical: function categorical(index) {
		// Categorical colour palettes are the ones that are used to separate items into
		// distinct groups or categories.
		switch (index) {
			case 1:
				// Stephen Few - Show Me the Numbers Book
				//      Blue       Orange     Green      Pink       L Brown    Purple     D.Yellow   Red        Black
				return ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
			case 2:
				// Color Brewer - http://colorbrewer2.com/
				//      Red        L.Blue     Green      Purple     Orange     Yellow     Brown      Pink       Grey
				return ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"];
			case 3:
				// Google Design - http://www.google.com/design/spec/style/color.html
				//      D. Blue    Orange     L.Green    Purple     Yellow     L.Blue     Red        D.Green    Brown
				return ["#3f51b5", "#ff9800", "#8bc34a", "#9c27b0", "#ffeb3b", "#03a9f4", "#f44336", "#009688", "#795548"];
		}
	},

	diverging: function diverging(index) {
		// Diverging colour palettes are used for quantitative data. Usually two different hues
		// that diverge from a light colour, for the critical midpoint, toward dark colours.
		switch (index) {
			case 1:
				// Color Brewer - Colourblind Safe
				return ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"];
			case 2:
				// Color Brewer - RAG
				return ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"];
			case 3:
				// Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
				return ["#0000ff", "#8052fe", "#b58bfb", "#ddc5f7", "#fffff0", "#ffcfb4", "#ff9e7a", "#ff6842", "#ff0000"];
		}
	},

	sequential: function sequential(origHex, count) {
		// Sequential colour palettes are primarily used to encode quantitative differences.
		// Quantitative values are arranged sequentially, from low to high.
		var lumStep = 0.1;
		var lumMax = lumStep * count / 2;
		var lumMin = 0 - lumMax;

		var lumScale = d3.scaleLinear().domain([1, count]).range([lumMin, lumMax]);

		var result = [];
		for (var i = 1; i <= count; i++) {
			var lum = lumScale(i);

			// Validate and normalise Hex value.
			origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
			if (origHex.length < 6) {
				origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
			}

			// Convert to decimal and change luminosity
			var newHex = "#";
			var c = void 0;
			for (var j = 0; j < 3; j++) {
				c = parseInt(origHex.substr(j * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
				newHex += ("00" + c).substr(c.length);
			}
			result.push(newHex);
		}
		return result;
	},

	lumShift: function lumShift(colors, lum) {
		var result = [];
		colors.forEach(function addNumber(origHex, index) {
			origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
			if (origHex.length < 6) {
				origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
			}
			lum = lum || 0;

			// Convert to decimal and change luminosity
			var newHex = "#";
			for (var i = 0; i < 3; i++) {
				var c = parseInt(origHex.substr(i * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
				newHex += ("00" + c).substr(c.length);
			}
			result[index] = newHex;
		});
		return result;
	}
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
function dataTransform(data) {

	var SINGLE_SERIES = 1;
	var MULTI_SERIES = 2;
	var coordinateKeys = ['x', 'y', 'z'];

	/**
  * Data Type
  *
  * @type {Number}
  */
	var dataType = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
  * Row Key
  *
  * @returns {Array}
  */
	var rowKey = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	}();

	/**
  * Row Total
  *
  * @returns {Array}
  */
	var rowTotal = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, function (d) {
				return d.value;
			});
		}
	}();

	/**
  * Row Keys
  *
  * @returns {Array}
  */
	var rowKeys = function () {
		if (dataType === MULTI_SERIES) {
			return data.map(function (d) {
				return d.key;
			});
		}
	}();

	/**
  * Row Totals
  *
  * @returns {Array}
  */
	var rowTotals = function () {
		if (dataType === MULTI_SERIES) {
			var ret = {};
			d3.map(data).values().forEach(function (d) {
				var rowKey = d.key;
				d.values.forEach(function (d) {
					ret[rowKey] = typeof ret[rowKey] === "undefined" ? 0 : ret[rowKey];
					ret[rowKey] += d.value;
				});
			});
			return ret;
		}
	}();

	/**
  * Row Totals Max
  *
  * @returns {number}
  */
	var rowTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
	}();

	/**
  * Row Value Keys
  *
  * @returns {Array}
  */
	var rowValuesKeys = function () {
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
	var union = function union(array1, array2) {
		var ret = [];
		var arr = array1.concat(array2);
		var len = arr.length;
		var assoc = {};

		while (len--) {
			var item = arr[len];

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
	var columnKeys = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data.values).map(function (d) {
				return d.key;
			});
		}

		var ret = [];
		d3.map(data).values().forEach(function (d) {
			var tmp = [];
			d.values.forEach(function (d, i) {
				tmp[i] = d.key;
			});
			ret = union(tmp, ret);
		});

		return ret;
	}();

	/**
  * Column Totals
  *
  * @returns {Array}
  */
	var columnTotals = function () {
		if (dataType !== MULTI_SERIES) {
			return;
		}

		var ret = {};
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				var columnName = d.key;
				ret[columnName] = typeof ret[columnName] === "undefined" ? 0 : ret[columnName];
				ret[columnName] += d.value;
			});
		});

		return ret;
	}();

	/**
  * Column Totals Max
  *
  * @returns {Array}
  */
	var columnTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	}();

	/**
  * Value Min
  *
  * @returns {number}
  */
	var valueMin = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, function (d) {
				return +d.value;
			});
		}

		var ret = void 0;
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				ret = typeof ret === "undefined" ? d.value : d3.min([ret, +d.value]);
			});
		});

		return +ret;
	}();

	/**
  * Value Max
  *
  * @returns {number}
  */
	var valueMax = function () {
		var ret = void 0;

		if (dataType === SINGLE_SERIES) {
			ret = d3.max(data.values, function (d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = typeof ret !== "undefined" ? d3.max([ret, +d.value]) : +d.value;
				});
			});
		}

		return ret;
	}();

	/**
  * Value Extent
  *
  * @returns {Array}
  */
	var valueExtent = function () {
		return [valueMin, valueMax];
	}();

	/**
  * Coordinates Min
  *
  * @returns {Array}
  */
	var coordinatesMin = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.min(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.min([ret[key], +d[key]]) : d[key];
					});
				});
			});
		}

		return ret;
	}();

	/**
  * Coordinates Max
  *
  * @returns {Array}
  */
	var coordinatesMax = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.max(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.max([ret[key], +d[key]]) : d[key];
					});
				});
			});
		}

		return ret;
	}();

	/**
  * Coordinates Extent
  *
  * @returns {Array}
  */
	var coordinatesExtent = function () {
		var ret = {};
		coordinateKeys.forEach(function (key) {
			ret[key] = [coordinatesMin[key], coordinatesMax[key]];
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
	var decimalPlaces = function decimalPlaces(num) {
		var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}

		return Math.max(0,
		// Number of digits right of decimal point.
		(match[1] ? match[1].length : 0) - (
		// Adjust for scientific notation.
		match[2] ? +match[2] : 0));
	};

	/**
  * Max Decimal Place
  *
  * @returns {number}
  */
	var maxDecimalPlace = function () {
		var ret = 0;
		if (dataType === MULTI_SERIES) {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = d3.max([ret, decimalPlaces(d.value)]);
				});
			});
		}

		// toFixed must be between 0 and 20
		return ret > 20 ? 20 : ret;
	}();

	/**
  * Thresholds
  *
  * @returns {Array}
  */
	var thresholds = function () {
		var distance = valueMax - valueMin;
		var bands = [0.15, 0.40, 0.55, 0.90];

		return bands.map(function (v) {
			return Number((valueMin + v * distance).toFixed(maxDecimalPlace));
		});
	}();

	/**
  * Summary
  *
  * @returns {Array}
  */
	var summary = function summary() {
		return {
			dataType: dataType,
			rowKey: rowKey,
			rowTotal: rowTotal,
			rowKeys: rowKeys,
			rowTotals: rowTotals,
			rowTotalsMax: rowTotalsMax,
			rowValuesKeys: rowValuesKeys,
			columnKeys: columnKeys,
			columnTotals: columnTotals,
			columnTotalsMax: columnTotalsMax,
			valueMin: valueMin,
			valueMax: valueMax,
			valueExtent: valueExtent,
			coordinatesMin: coordinatesMin,
			coordinatesMax: coordinatesMax,
			coordinatesExtent: coordinatesExtent,
			maxDecimalPlace: maxDecimalPlace,
			thresholds: thresholds
		};
	};

	/**
  * Rotate Data
  *
  * @returns {Array}
  */
	var rotate = function rotate() {
		var columnKeys = data.map(function (d) {
			return d.key;
		});
		var rowKeys = data[0].values.map(function (d) {
			return d.key;
		});

		var rotated = rowKeys.map(function (rowKey, rowIndex) {
			var values = columnKeys.map(function (columnKey, columnIndex) {
				// Copy the values from the original object
				var values = _extends({}, data[columnIndex].values[rowIndex]);
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

/**
 * Reusable Circular Bar Chart Component
 *
 * @module
 */
function componentBarsCircular () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;
	var radius = 150;
	var innerRadius = 20;
	var startAngle = 0;
	var endAngle = 270;
	var cornerRadius = 2;
	var classed = "barsCircular";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [valueMax, 0];

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([innerRadius, radius]).padding(0.15);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([startAngle, endAngle]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barsCircular
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Arc Generator
			var arc = d3.arc().startAngle(0).endAngle(function (d) {
				return yScale(d.value) * Math.PI / 180;
			}).outerRadius(function (d) {
				return xScale(d.key) + xScale.bandwidth();
			}).innerRadius(function (d) {
				return xScale(d.key);
			}).cornerRadius(cornerRadius);

			// Arc Tween
			var arcTween = function arcTween(d) {
				var i = d3.interpolate(this._current, d);
				this._current = i(0);

				return function (t) {
					return arc(i(t));
				};
			};

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bars to series
			var bars = seriesGroup.selectAll(".bar").data(function (d) {
				return d.values;
			});

			bars.enter().append("path").attr("d", arc).classed("bar", true).style("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attrTween("d", arcTween);

			bars.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Start angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - End angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Stacked Bar Chart Component
 *
 * @module
 */
function componentBarsStacked () {

	/* Default Properties */
	var width = 100;
	var height = 300;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var yScale = void 0;
	var colorScale = void 0;
	var classed = "barsStacked";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    rowTotalsMax = _dataTransform$summar.rowTotalsMax;

		var valueExtent = [0, rowTotalsMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, height]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barsStacked
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Stack Generator
			var stacker = function stacker(data) {
				var series = [];
				var y0 = 0;
				var y1 = 0;
				data.forEach(function (d, i) {
					y1 = y0 + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						y0: y0,
						y1: y1
					};
					y0 += d.value;
				});

				return series;
			};

			// Update bar group
			var barGroup = d3.select(this);
			barGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bars to group
			var bars = barGroup.selectAll(".bar").data(function (d) {
				return stacker(d.values);
			});

			bars.enter().append("rect").classed("bar", true).attr("width", width).attr("x", 0).attr("y", height).attr("rx", 0).attr("ry", 0).attr("height", 0).attr("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("width", width).attr("x", 0).attr("y", function (d) {
				return height - yScale(d.y1);
			}).attr("height", function (d) {
				return yScale(d.value);
			});

			bars.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Horizontal Bar Chart Component
 *
 * @module
 */
function componentBarsHorizontal () {

	/* Default Properties */
	var width = 400;
	var height = 500;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;
	var classed = "barsHorizontal";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain(valueExtent).range([0, height]).nice();
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand().domain(columnKeys).rangeRound([0, width]).padding(0.15);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barsHorizontal
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bars to series
			var bars = seriesGroup.selectAll(".bar").data(function (d) {
				return d.values;
			});

			bars.enter().append("rect").classed("bar", true).attr("fill", function (d) {
				return colorScale(d.key);
			}).attr("width", yScale.bandwidth()).attr("y", function (d) {
				return yScale(d.key);
			}).attr("height", yScale.bandwidth()).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", 0).attr("width", function (d) {
				return xScale(d.value);
			});

			bars.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Vertical Bar Chart Component
 *
 * @module
 */
function componentBarsVertical () {

	/* Default Properties */
	var width = 400;
	var height = 400;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;
	var classed = "barsVertical";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, width]).padding(0.15);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, height]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barsVertical
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Update bar group
			var barGroup = d3.select(this);
			barGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bars to group
			var bars = barGroup.selectAll(".bar").data(function (d) {
				return d.values;
			});

			bars.enter().append("rect").classed("bar", true).attr("width", xScale.bandwidth()).attr("x", function (d) {
				return xScale(d.key);
			}).attr("y", height).attr("rx", 0).attr("ry", 0).attr("height", 0).attr("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
				return xScale(d.key);
			}).attr("y", function (d) {
				return height - yScale(d.value);
			}).attr("height", function (d) {
				return yScale(d.value);
			});

			bars.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Labeled Node Component
 *
 * @module
 */
function componentLabeledNode () {

	/* Default Properties */
	var color = "steelblue";
	var opacity = 1;
	var strokeColor = "#000000";
	var strokeWidth = 1;
	var radius = 8;
	var label = void 0;
	var display = "block";
	var fontSize = 10;
	var classed = "labeledNode";
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick");

	/**
  * Constructor
  *
  * @constructor
  * @alias labeledNode
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {

		// Size Accessor
		function sizeAccessor(_) {
			return typeof radius === "function" ? radius(_) : radius;
		}

		selection.each(function (data) {
			var r = sizeAccessor(data);

			var node = d3.select(this).classed(classed, true);

			node.append("circle").attr("r", r).attr("fill-opacity", opacity).style("stroke", strokeColor).style("stroke-width", strokeWidth).style("fill", color);

			node.append("text").text(label).attr("dx", -r).attr("dy", -r).style("display", display).style("font-size", fontSize + "px").attr("alignment-baseline", "middle").style("text-anchor", "end");
		});
	}

	/**
  * Color Getter / Setter
  *
  * @param {string} _v - Color.
  * @returns {*}
  */
	my.color = function (_v) {
		if (!arguments.length) return color;
		color = _v;
		return this;
	};

	/**
  * Opacity Getter / Setter
  *
  * @param {number} _v - Level of opacity.
  * @returns {*}
  */
	my.opacity = function (_v) {
		if (!arguments.length) return opacity;
		opacity = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.label = function (_v) {
		if (!arguments.length) return label;
		label = _v;
		return this;
	};

	/**
  * Display Getter / Setter
  *
  * @param {string} _v - HTML display type (e.g. 'block')
  * @returns {*}
  */
	my.display = function (_v) {
		if (!arguments.length) return display;
		display = _v;
		return this;
	};

	/**
  * Font Size Getter / Setter
  *
  * @param {number} _v - Fint size.
  * @returns {*}
  */
	my.fontSize = function (_v) {
		if (!arguments.length) return fontSize;
		fontSize = _v;
		return this;
	};

	/**
  * Stroke Getter / Setter
  *
  * @param {number} _width - Width in px.
  * @param {string} _color - Colour.
  * @returns {*}
  */
	my.stroke = function (_width, _color) {
		if (!arguments.length) return [strokeWidth, strokeColor];
		strokeWidth = _width;
		strokeColor = _color;
		return this;
	};

	/**
  * Class Getter / Setter
  *
  * @param {string} _v - HTML class name.
  * @returns {*}
  */
	my.classed = function (_v) {
		if (!arguments.length) return classed;
		classed = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Scatter Plot Component
 *
 * @module
 */
function componentBubbles () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var transition = { ease: d3.easeLinear, duration: 0 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var classed = "bubbles";

	var minRadius = 10;
	var maxRadius = 20;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    _dataTransform$summar2 = _dataTransform$summar.coordinatesExtent,
		    xExtent = _dataTransform$summar2.x,
		    yExtent = _dataTransform$summar2.y,
		    valueExtent = _dataTransform$summar.valueExtent;

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(valueExtent).range([minRadius, maxRadius]);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain(xExtent).range([0, width]).nice();
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(yExtent).range([height, 0]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bubbles
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add bubbles to series
			var bubble = componentLabeledNode().radius(function (d) {
				return sizeScale(d.value);
			}).color(function (d) {
				return colorScale(d.series);
			}).label(function (d) {
				return d.key;
			}).stroke(1, "white").display("none").classed("bubble").dispatch(dispatch);

			var bubbles = seriesGroup.selectAll(".bubble").data(function (d) {
				return d.values;
			});

			bubbles.enter().append("g").attr("transform", function (d) {
				return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
			}).on("mouseover", function (d) {
				d3.select(this).select("text").style("display", "block");
				dispatch.call("customValueMouseOver", this, d);
			}).on("mouseout", function () {
				d3.select(this).select("text").style("display", "none");
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).call(bubble).merge(bubbles).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
				return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
			});

			bubbles.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * Min Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.minRadius = function (_v) {
		if (!arguments.length) return minRadius;
		minRadius = _v;
		return this;
	};

	/**
  * Max Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.maxRadius = function (_v) {
		if (!arguments.length) return maxRadius;
		maxRadius = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Candle Stick Component
 *
 * @module
 */
function componentCandleSticks () {

	/* Default Properties */
	var width = 400;
	var height = 400;
	var colors = ["green", "red"];
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = d3.scaleOrdinal().range(colors).domain([true, false]);
	var candleWidth = 3;
	var classed = "candleSticks";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		// TODO: Use dataTransform() to calculate date domains?
		var maxDate = d3.max(data.values, function (d) {
			return d.date;
		});
		var minDate = d3.min(data.values, function (d) {
			return d.date;
		});

		var ONE_DAY_IN_MILLISECONDS = 86400000;
		var dateDomain = [new Date(minDate - ONE_DAY_IN_MILLISECONDS), new Date(maxDate + ONE_DAY_IN_MILLISECONDS)];

		// TODO: Use dataTransform() to calculate candle min/max?
		var yDomain = [d3.min(data.values, function (d) {
			return d.low;
		}), d3.max(data.values, function (d) {
			return d.high;
		})];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain([true, false]).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleTime().domain(dateDomain).range([0, width]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(yDomain).range([height, 0]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias candleSticks
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data()[0]);
		selection.each(function () {

			// Is Up Day
			var isUpDay = function isUpDay(d) {
				return d.close > d.open;
			};

			// Line Function
			var line = d3.line().x(function (d) {
				return d.x;
			}).y(function (d) {
				return d.y;
			});

			// High Low Lines
			var highLowLines = function highLowLines(bars) {
				var paths = bars.selectAll(".high-low-line").data(function (d) {
					return [d];
				});

				paths.enter().append("path").classed("high-low-line", true).attr("d", function (d) {
					return line([{ x: xScale(d.date), y: yScale(d.high) }, { x: xScale(d.date), y: yScale(d.low) }]);
				});
			};

			// Open Close Bars
			var openCloseBars = function openCloseBars(bars) {
				var rect = bars.selectAll(".open-close-bar").data(function (d) {
					return [d];
				});

				rect.enter().append("rect").classed("open-close-bar", true).attr("x", function (d) {
					return xScale(d.date) - candleWidth;
				}).attr("y", function (d) {
					return isUpDay(d) ? yScale(d.close) : yScale(d.open);
				}).attr("width", candleWidth * 2).attr("height", function (d) {
					return isUpDay(d) ? yScale(d.open) - yScale(d.close) : yScale(d.close) - yScale(d.open);
				});
			};

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add candles to series
			var candlesSelect = seriesGroup.selectAll(".candle").data(function (d) {
				return d.values;
			});

			var candles = candlesSelect.enter().append("g").classed("candle", true).attr("fill", function (d) {
				return colorScale(isUpDay(d));
			}).attr("stroke", function (d) {
				return colorScale(isUpDay(d));
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(candlesSelect);

			highLowLines(candles);
			openCloseBars(candles);
			// openCloseTicks(candles);

			candles.exit().remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Candle Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.candleWidth = function (_v) {
		if (!arguments.length) return candleWidth;
		candleWidth = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Circular Axis Component
 *
 * @module
 */
function componentCircularAxis () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var radius = void 0;
	var radialScale = void 0;
	var ringScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularAxis
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		// Create axis group
		var axisSelect = selection.selectAll(".axis").data([0]);

		var axis = axisSelect.enter().append("g").classed("axis", true).on("click", function (d) {
			dispatch.call("customClick", this, d);
		}).merge(axisSelect);

		// Outer circle
		var outerCircle = axis.selectAll(".outerCircle").data([radius]).enter().append("circle").classed("outerCircle", true).attr("r", function (d) {
			return d;
		}).style("fill", "none").attr("stroke-width", 2).attr("stroke", "#ddd");

		// Tick Data Generator
		var tickData = function tickData() {
			var tickArray = void 0,
			    tickPadding = void 0;
			if (typeof ringScale.ticks === "function") {
				// scaleLinear
				tickArray = ringScale.ticks();
				tickPadding = 0;
			} else {
				// scaleBand
				tickArray = ringScale.domain();
				tickPadding = ringScale.bandwidth() / 2;
			}

			return tickArray.map(function (d) {
				return {
					value: d,
					radius: ringScale(d),
					padding: tickPadding
				};
			});
		};

		var tickCirclesGroupSelect = axis.selectAll(".tickCircles").data(function () {
			return [tickData()];
		});

		var tickCirclesGroup = tickCirclesGroupSelect.enter().append("g").classed("tickCircles", true).merge(tickCirclesGroupSelect);

		var tickCircles = tickCirclesGroup.selectAll("circle").data(function (d) {
			return d;
		});

		tickCircles.enter().append("circle").style("fill", "none").attr("stroke-width", 1).attr("stroke", "#ddd").merge(tickCircles).transition().attr("r", function (d) {
			return d.radius + d.padding;
		});

		tickCircles.exit().remove();

		// Spoke Data Generator
		var spokeData = function spokeData() {
			var spokeCount = 0;
			var spokeArray = [];
			if (typeof radialScale.ticks === "function") {
				// scaleLinear
				var min = d3.min(radialScale.domain());
				var max = d3.max(radialScale.domain());
				spokeCount = radialScale.ticks().length;
				var spokeIncrement = (max - min) / spokeCount;
				for (var i = 0; i <= spokeCount; i++) {
					spokeArray[i] = (spokeIncrement * i).toFixed(0);
				}
			} else {
				// scaleBand
				spokeArray = radialScale.domain();
				spokeCount = spokeArray.length;
				spokeArray.push("");
			}

			var spokeScale = d3.scaleLinear().domain([0, spokeCount]).range(radialScale.range());

			return spokeArray.map(function (d, i) {
				return {
					value: d,
					rotate: spokeScale(i)
				};
			});
		};

		var spokesGroupSelect = axis.selectAll(".spokes").data(function () {
			return [spokeData()];
		});

		var spokesGroup = spokesGroupSelect.enter().append("g").classed("spokes", true).merge(spokesGroupSelect);

		var spokes = spokesGroup.selectAll("line").data(function (d) {
			return d;
		});

		spokes.enter().append("line").attr("id", function (d) {
			return d.value;
		}).attr("y2", -radius).merge(spokes).attr("transform", function (d) {
			return "rotate(" + d.rotate + ")";
		});

		spokes.exit().remove();
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Ring Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.ringScale = function (_v) {
		if (!arguments.length) return ringScale;
		ringScale = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Radial Labels Component
 *
 * @module
 */
function componentCircularRingLabels () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 360;
	var capitalizeLabels = false;
	var textAnchor = "centre";
	var radialScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularRingLabels
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		var labelsSelect = selection.selectAll(".radialLabels").data([0]);

		var labels = labelsSelect.enter().append("g").classed("radialLabels", true).merge(labelsSelect);

		var radData = radialScale.domain();

		var defSelect = labels.selectAll("def").data(radData);

		defSelect.enter().append("def").append("path").attr("id", function (d, i) {
			return "radialLabelPath" + "-" + i;
		}).attr("d", function (d) {
			var r = radialScale(d);
			var arc = d3.arc().outerRadius(r).innerRadius(r);
			var pathConf = {
				startAngle: startAngle * Math.PI / 180,
				endAngle: endAngle * Math.PI / 180
			};
			var pathStr = arc(pathConf).split(/[A-Z]/);
			return "M" + pathStr[1] + "A" + pathStr[2];
		});

		var textSelect = labels.selectAll("text").data(radData);

		textSelect.enter().append("text").style("text-anchor", "start").attr("dy", -5).attr("dx", 5).append("textPath").attr("xlink:href", function (d, i) {
			return "#radialLabelPath" + "-" + i;
		}).attr("startOffset", "0%").text(function (d) {
			return d;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Capital Label Getter / Setter
  *
  * @param {boolean} _v - Capitalize labels.
  * @returns {*}
  */
	my.capitalizeLabels = function (_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Text Anchor Getter / Setter
  *
  * @param {string} _v - Anchor name.
  * @returns {*}
  */
	my.textAnchor = function (_v) {
		if (!arguments.length) return textAnchor;
		textAnchor = _v;
		return this;
	};

	return my;
}

/**
 * Reusable Circular Labels Component
 *
 * @module
 */
function componentCircularSectorLabels () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 360;
	var capitalizeLabels = false;
	var textAnchor = "centre";
	var radialScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias circularSectorLabels
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		// Tick Data Generator
		var tickData = function tickData() {
			var tickCount = 0;
			var tickArray = [];

			if (typeof radialScale.ticks === "function") {
				// scaleLinear
				var min = d3.min(radialScale.domain());
				var max = d3.max(radialScale.domain());
				tickCount = radialScale.ticks().length;
				var tickIncrement = (max - min) / tickCount;
				for (var i = 0; i <= tickCount; i++) {
					tickArray[i] = (tickIncrement * i).toFixed(0);
				}
			} else {
				// scaleBand
				tickArray = radialScale.domain();
				tickCount = tickArray.length;
			}

			var tickScale = d3.scaleLinear().domain([0, tickCount]).range(radialScale.range());

			return tickArray.map(function (d, i) {
				return {
					value: d,
					offset: tickScale(i) / 360 * 100
				};
			});
		};

		// Unique id so that the text path defs are unique - is there a better way to do this?
		var uId = selection.attr("id") ? selection.attr("id") : "uid-" + Math.floor(1000 + Math.random() * 9000);
		selection.attr("id", uId);

		var labelsSelect = selection.selectAll(".circularLabels").data(function () {
			return [tickData()];
		});

		var labels = labelsSelect.enter().append("g").classed("circularLabels", true).merge(labelsSelect);

		// Labels
		var defSelect = labels.selectAll("def").data([radius]);

		defSelect.enter().append("def").append("path").attr("id", function () {
			var pathId = selection.attr("id") + "-path";
			return pathId;
		}).attr("d", function (d) {
			return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
		}).merge(defSelect);

		defSelect.exit().remove();

		var textSelect = labels.selectAll("text").data(function (d) {
			return d;
		});

		textSelect.enter().append("text").style("text-anchor", textAnchor).append("textPath").attr("xlink:href", function () {
			var pathId = selection.attr("id") + "-path";
			return "#" + pathId;
		}).text(function (d) {
			var text = d.value;
			return capitalizeLabels ? text.toUpperCase() : text;
		}).attr("startOffset", function (d) {
			return d.offset + "%";
		}).attr("id", function (d) {
			return d.value;
		}).merge(textSelect);

		textSelect.transition().select("textPath").text(function (d) {
			var text = d.value;
			return capitalizeLabels ? text.toUpperCase() : text;
		}).attr("startOffset", function (d) {
			return d.offset + "%";
		});

		textSelect.exit().remove();
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Capital Label Getter / Setter
  *
  * @param {boolean} _v - Capitalize labels.
  * @returns {*}
  */
	my.capitalizeLabels = function (_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
  * Radial Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.radialScale = function (_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
  * Text Anchor Getter / Setter
  *
  * @param {string} _v - Anchor name.
  * @returns {*}
  */
	my.textAnchor = function (_v) {
		if (!arguments.length) return textAnchor;
		textAnchor = _v;
		return this;
	};

	return my;
}

/**
 * Reusable Donut Chart Component
 *
 * @module
 */
function componentDonut () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = 150;
	var innerRadius = void 0;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "donut";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys;

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias donut
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.each(function (data) {
			init(data);

			// Pie Generator
			var pie = d3.pie().value(function (d) {
				return d.value;
			}).sort(null).padAngle(0.015);

			// Arc Generator
			var arc = d3.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(2);

			// Arc Tween
			var arcTween = function arcTween(d) {
				var i = d3.interpolate(this._current, d);
				this._current = i(0);
				return function (t) {
					return arc(i(t));
				};
			};

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Slices
			var slices = seriesGroup.selectAll("path.slice").data(function (d) {
				return pie(d.values);
			});

			slices.enter().append("path").attr("class", "slice").attr("fill", function (d) {
				return colorScale(d.data.key);
			}).attr("d", arc).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(slices).transition().duration(transition.duration).ease(transition.ease).attrTween("d", arcTween);

			slices.exit().remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner Radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Donut Chart Label Component
 *
 * @module
 */
function componentDonutLabels () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var radius = 150;
	var innerRadius = void 0;
	var classed = "donutLabels";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias donutLabels
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.each(function (data) {
			init(data);

			// Pie Generator
			var pie = d3.pie().value(function (d) {
				return d.value;
			}).sort(null).padAngle(0.015);

			// Arc Generator
			var arc = d3.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(2);

			// Outer Arc Generator
			var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

			// Mid Angle
			var midAngle = function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			};

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true);

			// Text Labels
			var labelsGroupSelect = seriesGroup.selectAll("g.labels").data(function (d) {
				return [d];
			});

			var labelsGroup = labelsGroupSelect.enter().append("g").attr("class", "labels").merge(labelsGroupSelect);

			var labels = labelsGroup.selectAll("text.label").data(function (d) {
				return pie(d.values);
			});

			labels.enter().append("text").attr("class", "label").attr("dy", ".35em").merge(labels).transition().duration(transition.duration).text(function (d) {
				return d.data.key;
			}).attrTween("transform", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
					return "translate(" + pos + ")";
				};
			}).styleTween("text-anchor", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start" : "end";
				};
			});

			labels.exit().remove();

			// Text Label to Slice Connectors
			var connectorsGroupSelect = seriesGroup.selectAll("g.connectors").data(function (d) {
				return [d];
			});

			var connectorsGroup = connectorsGroupSelect.enter().append("g").attr("class", "connectors").merge(connectorsGroupSelect);

			var connectors = connectorsGroup.selectAll("polyline.connector").data(function (d) {
				return pie(d.values);
			});

			connectors.enter().append("polyline").attr("class", "connector").merge(connectors).transition().duration(transition.duration).attrTween("points", function (d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function (t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};
			});

			connectors.exit().remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	return my;
}

/**
 * Reusable Heat Map Ring Component
 *
 * @module
 */
function componentHeatMapRing () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = 150;
	var innerRadius = 20;
	var startAngle = 0;
	var endAngle = 360;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "heatMapRing";
	var thresholds = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    tmpThresholds = _dataTransform$summar.thresholds;

		if (typeof thresholds === "undefined") {
			thresholds = tmpThresholds;
		}

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleThreshold().domain(thresholds).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]).padding(0.1);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand().domain(rowKeys).rangeRound([radius, innerRadius]).padding(0.1);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias heatMapRing
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Pie Generator
			var segStartAngle = d3.min(xScale.range());
			var segEndAngle = d3.max(xScale.range());
			var pie = d3.pie().value(1).sort(null).startAngle(segStartAngle * (Math.PI / 180)).endAngle(segEndAngle * (Math.PI / 180)).padAngle(0.015);

			// Arc Generator
			var arc = d3.arc().outerRadius(radius).innerRadius(innerRadius).cornerRadius(2);

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add segments to series group
			var segments = seriesGroup.selectAll(".segment").data(function (d) {
				var key = d.key;
				var data = pie(d.values);
				data.forEach(function (d, i) {
					data[i].key = key;
				});

				return data;
			});

			segments.enter().append("path").attr("d", arc).attr("fill", "black").classed("segment", true).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d.data);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d.data);
			}).merge(segments).transition().duration(transition.duration).attr("fill", function (d) {
				return colorScale(d.data.value);
			});

			segments.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angke in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * Thresholds Getter / Setter
  *
  * @param {Array} _v - Array of thresholds.
  * @returns {*}
  */
	my.thresholds = function (_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Heat Map Table Row Component
 *
 * @module
 */
function componentHeatMapRow () {

	/* Default Properties */
	var width = 400;
	var height = 100;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "heatMapRow";
	var thresholds = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    tmpThresholds = _dataTransform$summar.thresholds;

		if (typeof thresholds === "undefined") {
			thresholds = tmpThresholds;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleThreshold().domain(thresholds).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).range([0, width]).padding(0.1);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand().domain(rowKeys).range([0, height]).padding(0.1);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias heatMapRow
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			var cellHeight = yScale.bandwidth();
			var cellWidth = xScale.bandwidth();

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add cells to series group
			var cells = seriesGroup.selectAll(".cell").data(function (d) {
				var seriesName = d.key;
				var seriesValues = d.values;

				return seriesValues.map(function (el) {
					var o = _extends({}, el);
					o.series = seriesName;
					return o;
				});
			});

			cells.enter().append("rect").attr("class", "cell").attr("x", function (d) {
				return xScale(d.key);
			}).attr("y", 0).attr("rx", 2).attr("ry", 2).attr("fill", "black").attr("width", cellWidth).attr("height", cellHeight).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(cells).transition().duration(transition.duration).attr("fill", function (d) {
				return colorScale(d.value);
			});

			cells.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	my.thresholds = function (_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch Event Handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Simple HTML List
 *
 * @module
 */
function componentHtmlList () {

	/* HTML List Element */
	var listEl = void 0;

	/* Default Properties */
	var classed = "htmlList";

	/* Dispatch */
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
  * Constructor
  *
  * @constructor
  * @alias htmlList
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.each(function (data) {
			// Create HTML List 'ul' element (if it does not exist already)
			if (!listEl) {
				listEl = d3.select(this).append("ul").classed("d3ez", true).classed(classed, true);
			} else {
				listEl.selectAll("*").remove();
			}

			listEl.selectAll("li").data(data).enter().append("li").text(function (d) {
				return d.key;
			}).on("click", expand);

			function expand(d) {
				d3.event.stopPropagation();
				dispatch.call("customValueMouseOver", this, d);

				if (typeof d.values === "undefined") {
					return 0;
				}

				var ul = d3.select(this).on("click", collapse).append("ul");

				var li = ul.selectAll("li").data(d.values).enter().append("li").text(function (d) {
					if (typeof d.value !== "undefined") {
						return d.key + " : " + d.value;
					} else {
						return d.key;
					}
				}).on("click", expand);
			}

			function collapse() {
				d3.event.stopPropagation();
				d3.select(this).on("click", expand).selectAll("*").remove();
			}
		});
	}

	/**
  * Class Getter / Setter
  *
  * @param {string} _v - HTML class.
  * @returns {*}
  */
	my.classed = function (_v) {
		if (!arguments.length) return classed;
		classed = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Simple HTML Table
 *
 * @module
 */
function componentHtmlTable () {

	/* HTML List Element */
	var tableEl = void 0;

	/* Default Properties */
	var classed = "htmlTable";
	var width = 800;

	// Dispatch (Custom events)
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
  * Constructor
  *
  * @constructor
  * @alias htmlTable
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.each(function (data) {
			var _dataTransform$summar = dataTransform(data).summary(),
			    columnKeys = _dataTransform$summar.columnKeys;

			// Create HTML Table 'table' element (if it does not exist already)


			if (!tableEl) {
				tableEl = d3.select(this).append("table").classed("d3ez", true).classed(classed, true).attr("width", width);
			} else {
				tableEl.selectAll("*").remove();
			}
			var head = tableEl.append("thead");
			var foot = tableEl.append("tfoot");
			var body = tableEl.append("tbody");

			// Add table headings
			var hdr = head.append("tr");

			hdr.selectAll("th").data(function () {
				return [""].concat(columnKeys);
			}) // Tack a blank cell at the beginning this is the empty 'A1' cell.
			.enter().append("th").html(function (d) {
				return d;
			});

			// Add table body
			var rowsSelect = body.selectAll("tr").data(data);

			var rows = rowsSelect.enter().append("tr").attr("class", function (d) {
				return d.key;
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			}).merge(rowsSelect);

			// Add the first column of headings (categories)
			rows.append("th").html(function (d) {
				return d.key;
			});

			// Add the main data values
			rows.selectAll("td").data(function (d) {
				return d.values;
			}).enter().append("td").attr("class", function (d) {
				return d.key;
			}).html(function (d) {
				return d.value;
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			});
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Class Getter / Setter
  *
  * @param {string} _v - HTML class.
  * @returns {*}
  */
	my.classed = function (_v) {
		if (!arguments.length) return classed;
		classed = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Line Chart Component
 *
 * @module
 */
function componentLineChart () {

	/* Default Properties */
	var width = 400;
	var height = 400;
	var transition = { ease: d3.easeLinear, duration: 0 };
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "lineChart";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		// TODO: Use dataTransform() to calculate date domains?
		var dateDomain = d3.extent(data[0].values, function (d) {
			return d.key;
		});

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleTime().domain(dateDomain).range([0, width]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([height, 0]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias lineChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Line generation function
			var line = d3.line().curve(d3.curveCardinal).x(function (d) {
				return xScale(d.key);
			}).y(function (d) {
				return yScale(d.value);
			});

			// Line animation tween
			var pathTween = function pathTween(data) {
				var interpolate = d3.scaleQuantile().domain([0, 1]).range(d3.range(1, data.length + 1));
				return function (t) {
					return line(data.slice(0, interpolate(t)));
				};
			};

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Create series group
			var seriesLine = seriesGroup.selectAll(".seriesLine").data(function (d) {
				return [d];
			});

			seriesLine.enter().append("path").attr("class", "seriesLine").attr("stroke-width", 1.5).attr("stroke", function (d) {
				return colorScale(d.key);
			}).attr("fill", "none").merge(seriesLine).transition().duration(transition.duration).attrTween("d", function (d) {
				return pathTween(d.values);
			});

			seriesLine.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Number Row Component
 *
 * @module
 */
function componentNumberCard () {

	/* Default Properties */
	var width = 400;
	var height = 100;
	var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "numberCard";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueExtent = _dataTransform$summar.valueExtent;

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(valueExtent).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).range([0, width]).padding(0.05);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand().domain(rowKeys).range([0, height]).padding(0.05);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias numberCard
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Calculate cell sizes
			var cellHeight = yScale.bandwidth();
			var cellWidth = xScale.bandwidth();

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add numbers to series
			var numbers = seriesGroup.selectAll(".number").data(function (d) {
				return d.values;
			});

			numbers.enter().append("text").attr("class", "number").attr("x", function (d) {
				return xScale(d.key) + cellWidth / 2;
			}).attr("y", cellHeight / 2).attr("text-anchor", "middle").attr("dominant-baseline", "central").text(function (d) {
				return d["value"];
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(numbers).transition().duration(1000).attr("fill", function (d) {
				return colorScale(d.value);
			});

			numbers.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Polar Area Chart Component
 *
 * @module
 */
function componentPolarArea () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var radius = 150;
	var startAngle = 0;
	var endAngle = 360;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "polarArea";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]).padding(0.15);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias polarArea
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Pie Generator
			startAngle = d3.min(xScale.range());
			endAngle = d3.max(xScale.range());
			var pie = d3.pie().value(1).sort(null).startAngle(startAngle * (Math.PI / 180)).endAngle(endAngle * (Math.PI / 180)).padAngle(0);

			// Arc Generator
			var arc = d3.arc().outerRadius(function (d) {
				return yScale(d.data.value);
			}).innerRadius(0).cornerRadius(2);

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add segments to series
			var segments = seriesGroup.selectAll(".segment").data(function (d) {
				return pie(d.values);
			});

			segments.enter().append("path").classed("segment", true).style("fill", function (d) {
				return colorScale(d.data.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d.data);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d.data);
			}).merge(segments).transition().ease(transition.ease).duration(transition.duration).attr("d", arc);

			segments.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Line Chart Component
 *
 * @module
 */
function componentRadarArea () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;
	var radius = 150;
	var angleSlice = void 0;
	var classed = "radarArea";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		// Slice calculation on circle
		angleSlice = Math.PI * 2 / columnKeys.length;

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).range([0, 360]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]).nice();
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias radarArea
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Function to generate radar line points
			var radarLine = d3.radialLine().radius(function (d) {
				return yScale(d.value);
			}).angle(function (d, i) {
				return i * angleSlice;
			}).curve(d3.curveBasis).curve(d3.curveCardinalClosed);

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.append("path").classed(classed, true).attr("d", function (d) {
				return radarLine(d.values);
			}).style("fill-opacity", 0.2).on('mouseover', function () {
				d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
			}).on('mouseout', function () {
				d3.select(this).transition().duration(200).style("fill-opacity", 0.2);
			});

			// Creating lines/path on circle
			seriesGroup.append("path").attr("class", "radarStroke").attr("d", function (d) {
				return radarLine(d.values);
			}).style("stroke-width", 3 + "px").style("fill", "none");

			// Create Radar Circle points on line
			seriesGroup.selectAll(".radarCircle").data(function (d) {
				return d.values;
			}).enter().append("circle").attr("class", "radarCircle").attr("r", 4).attr("cx", function (d, i) {
				return yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
			}).attr("cy", function (d, i) {
				return yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
			}).style("fill-opacity", 0.8);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Proportional Area Circles Component
 *
 * @module
 */
function componentProportionalAreaCircles () {

	/* Default Properties */
	var width = 400;
	var height = 100;
	var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var sizeScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "proportionalAreaCircles";

	var minRadius = 2;
	var maxRadius = 20;
	var useGlobalScale = true;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueExtent = _dataTransform$summar.valueExtent;

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(valueExtent).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).range([0, width]).padding(0.05);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand().domain(rowKeys).range([0, height]).padding(0.05);
		}

		var sizeExtent = useGlobalScale ? valueExtent : [0, d3.max(data[1]["values"], function (d) {
			return d["value"];
		})];

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(sizeExtent).range([minRadius, maxRadius]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias proportionalAreaCircles
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Calculate cell sizes
			var cellHeight = yScale.bandwidth();
			var cellWidth = xScale.bandwidth();

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			var spot = componentLabeledNode().radius(function (d) {
				return sizeScale(d.value);
			}).color(function (d) {
				return colorScale(d.value);
			}).label(function (d) {
				return d.value;
			}).display("none").stroke(1, "#cccccc").classed("punchSpot").dispatch(dispatch);

			// Add spots to series
			var spots = seriesGroup.selectAll(".punchSpot").data(function (d) {
				return d.values;
			});

			spots.enter().append("g").call(spot).attr("transform", function (d) {
				return "translate(" + (cellWidth / 2 + xScale(d.key)) + "," + cellHeight / 2 + ")";
			}).on("mouseover", function (d) {
				d3.select(this).select("text").style("display", "block");
				dispatch.call("customValueMouseOver", this, d);
			}).on("mouseout", function () {
				d3.select(this).select("text").style("display", "none");
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(spots);

			spots.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Scatter Plot Component
 *
 * @module
 */
function componentScatterPlot () {

	/* Default Properties */
	var width = 400;
	var height = 400;
	var transition = { ease: d3.easeLinear, duration: 0 };
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "scatterPlot";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax * 1.05];
		var dateDomain = d3.extent(data[0].values, function (d) {
			return d.key;
		});

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleTime().domain(dateDomain).range([0, width]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([height, 0]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias scatterPlot
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Create series group
			var seriesDots = seriesGroup.selectAll(".seriesDots").data(function (d) {
				return [d];
			});

			var series = seriesDots.enter().append("g").classed("seriesDots", true).attr("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			}).merge(seriesDots);

			// Add dots to series
			var dots = series.selectAll(".dot").data(function (d) {
				return d.values;
			});

			dots.enter().append("circle").attr("class", "dot").attr("r", 3).attr("cx", function (d) {
				return xScale(d.key);
			}).attr("cy", height).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(dots).transition().ease(transition.ease).duration(transition.duration).attr("cx", function (d) {
				return xScale(d.key);
			}).attr("cy", function (d) {
				return yScale(d.value);
			});

			dots.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Rose Chart Sector
 *
 * @module
 */
function componentRoseChartSector () {

	/* Default Properties */
	var width = 300;
	var height = 300;
	var transition = { ease: d3.easeBounce, duration: 500 };
	var radius = void 0;
	var startAngle = 0;
	var endAngle = 45;
	var colors = palette.categorical(3);
	var colorScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var stacked = false;
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	var classed = "roseChartSector";

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax,
		    rowTotalsMax = _dataTransform$summar.rowTotalsMax;

		var max = stacked ? rowTotalsMax : valueMax;
		var valueExtent = [0, max];

		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		if (typeof xScale !== "undefined") {
			startAngle = xScale(data.key);
			endAngle = xScale(data.key) + xScale.bandwidth();
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias roseChartSector
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		init(selection.data());
		selection.each(function () {
			// Stack Generator
			var stacker = function stacker(data) {
				// Calculate inner and outer radius values
				var series = [];
				var innerRadius = 0;
				var outerRadius = 0;
				data.forEach(function (d, i) {
					outerRadius = innerRadius + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						innerRadius: yScale(innerRadius),
						outerRadius: yScale(outerRadius)
					};
					innerRadius += stacked ? d.value : 0;
				});

				return series;
			};

			// Arc Generator
			var arc = d3.arc().innerRadius(function (d) {
				return d.innerRadius;
			}).outerRadius(function (d) {
				return d.outerRadius;
			}).startAngle(startAngle * (Math.PI / 180)).endAngle(endAngle * (Math.PI / 180));

			// Update series group
			var seriesGroup = d3.select(this);
			seriesGroup.classed(classed, true).attr("id", function (d) {
				return d.key;
			}).on("mouseover", function (d) {
				dispatch.call("customSeriesMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customSeriesClick", this, d);
			});

			// Add arcs to series group
			var arcs = seriesGroup.selectAll(".arc").data(function (d) {
				return stacker(d.values);
			});

			arcs.enter().append("path").classed("arc", true).attr("fill", function (d) {
				return colorScale(d.key);
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(arcs).transition().ease(transition.ease).duration(transition.duration).attr("d", arc);

			arcs.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Start Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.startAngle = function (_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
  * End Angle Getter / Setter
  *
  * @param {number} _v - Angle in degrees.
  * @returns {*}
  */
	my.endAngle = function (_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
  * Stacked Getter / Setter
  *
  * @param {boolean} _v - Stacked bars or grouped?
  * @returns {*}
  */
	my.stacked = function (_v) {
		if (!arguments.length) return stacked;
		stacked = _v;
		return my;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Reusable Size Legend Component
 *
 * @module
 */
function componentLegendSize () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var sizeScale = void 0;
	var itemCount = 4;

	/**
  * Constructor
  *
  * @constructor
  * @alias legendSize
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var data = function data() {
			// Calculate radiusScale
			var domainMin = parseFloat(d3.min(sizeScale.domain()));
			var domainMax = parseFloat(d3.max(sizeScale.domain()));
			var increment = (domainMax - domainMin) / itemCount;
			var ranges = Array(itemCount).fill().map(function (v, i) {
				var rangeStart = domainMin + increment * i;
				var rangeEnd = domainMin + increment * (i + 1);
				return [rangeStart, rangeEnd];
			});

			// Calculate yScale
			var yStep = height / (itemCount * 2);
			var yDomain = [0, itemCount - 1];
			var yRange = [yStep, height - yStep];
			var yScale = d3.scaleLinear().domain(yDomain).range(yRange);

			return ranges.map(function (v, i) {
				return {
					x: sizeScale(domainMax),
					y: yScale(i),
					r: sizeScale(ranges[i][0]),
					text: v[0].toFixed(0) + " - " + v[1].toFixed(0)
				};
			});
		};

		var itemsSelect = legend.selectAll(".legendItem").data(data);

		var items = itemsSelect.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
			return "translate(0," + d.y + ")";
		}).merge(itemsSelect);

		items.exit().remove();

		items.append("circle").attr("r", function (d) {
			return d.r;
		}).attr("cx", function (d) {
			return d.x;
		}).attr("fill", "lightgrey").attr("stroke", "grey").attr("stroke-width", 1);

		items.append("text").text(function (d) {
			return d.text;
		}).attr("dominant-baseline", "middle").attr("x", function (d) {
			return d.x * 2 + 5;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 size scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * Item Count Getter / Setter
  *
  * @param {number} _v - Number of items.
  * @returns {*}
  */
	my.itemCount = function (_v) {
		if (!arguments.length) return itemCount;
		itemCount = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Categorical Legend Component
 *
 * @module
 */
function componentLegendColor () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var colorScale = void 0;
	var itemCount = void 0;
	var itemType = "rect";

	/**
  * Constructor
  *
  * @constructor
  * @alias legendColor
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var data = function data() {
			var domain = colorScale.domain();
			itemCount = domain.length;
			var itemHeight = height / itemCount / 2;
			var itemWidth = 20;

			return domain.map(function (v, i) {
				return {
					y: 10 + itemHeight * 2 * i,
					width: itemWidth,
					height: itemHeight,
					color: colorScale(v),
					text: v
				};
			});
		};

		var itemsSelect = legend.selectAll(".legendItem").data(data);

		var items = itemsSelect.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
			return "translate(0," + d.y + ")";
		}).merge(itemsSelect);

		items.exit().remove();

		switch (itemType) {
			case "line":
				items.append("line").attr("x1", 0).attr("y1", function (d) {
					return d.height / 2;
				}).attr("x2", function (d) {
					return d.width;
				}).attr("y2", function (d) {
					return d.height / 2;
				}).attr("stroke", function (d) {
					return d.color;
				}).attr("stroke-width", 2);
				break;

			case "rect":
			default:
				items.append("rect").attr("width", function (d) {
					return d.width;
				}).attr("height", function (d) {
					return d.height;
				}).style("fill", function (d) {
					return d.color;
				}).attr("stroke", "#dddddd").attr("stroke-width", 1);
				break;
		}

		items.append("text").text(function (d) {
			return d.text;
		}).attr("dominant-baseline", "middle").attr("x", 40).attr("y", function (d) {
			return d.height / 2;
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Item Type Getter / Setter
  *
  * @param {string} _v - Item type (‘rect’, ‘circle’).
  * @returns {*}
  */
	my.itemType = function (_v) {
		if (!arguments.length) return itemType;
		itemType = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Threshold Legend Component
 *
 * @module
 * @see https://bl.ocks.org/mbostock/4573883
 */
function componentLegendThreshold () {

	/* Default Properties */
	var width = 100;
	var height = 200;
	var thresholdScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias legendThreshold
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendSelect = selection.selectAll("#legendBox").data([0]);

		var legend = legendSelect.enter().append("g").attr("id", "legendBox").attr("width", width).attr("height", height).merge(legendSelect);

		var domainMin = d3.min(thresholdScale.domain());
		var domainMax = d3.max(thresholdScale.domain());
		var domainMargin = (domainMax - domainMin) * 0.1;

		var x = d3.scaleLinear().domain([domainMin - domainMargin, domainMax + domainMargin]).range([0, height]);

		var xAxis = d3.axisRight(x).tickSize(30).tickValues(thresholdScale.domain());

		var axis = legend.call(xAxis);
		axis.select(".domain").remove();

		axis.selectAll("rect").data(thresholdScale.range().map(function (color) {
			var d = thresholdScale.invertExtent(color);
			if (typeof d[0] === 'undefined') d[0] = x.domain()[0];
			if (typeof d[1] === 'undefined') d[1] = x.domain()[1];
			return d;
		})).enter().insert("rect", ".tick").attr("width", 20).attr("y", function (d) {
			return x(d[0]);
		}).attr("height", function (d) {
			return x(d[1]) - x(d[0]);
		}).attr("fill", function (d) {
			return thresholdScale(d[0]);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Threshold Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 scale.
  * @returns {*}
  */
	my.thresholdScale = function (_v) {
		if (!arguments.length) return thresholdScale;
		thresholdScale = _v;
		return my;
	};

	return my;
}

/**
 * Reusable Legend Component
 *
 * @module
 */
function componentLegend () {

	/* Default Properties */
	var width = 100;
	var height = 150;
	var sizeScale = void 0;
	var colorScale = void 0;
	var title = void 0;
	var legend = void 0;

	var opacity = 0.7;

	/**
  * Constructor
  *
  * @constructor
  * @alias legend
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		height = height ? height : this.attr("height");
		width = width ? width : this.attr("width");

		// Legend Box
		var legendBox = selection.selectAll("#legendBox").data([0]).enter().append("g").attr("id", "legendBox");

		legendBox.append("rect").attr("width", width).attr("height", height).attr("fill-opacity", opacity).attr("fill", "#ffffff").attr("stroke-width", 1).attr("stroke", "#000000");

		// Size Legend
		if (typeof sizeScale !== "undefined") {
			legend = componentLegendSize().sizeScale(sizeScale).itemCount(4);
		}

		// Colour Legend
		if (typeof colorScale !== "undefined") {
			if (scaleType(colorScale) === "threshold") {
				legend = componentLegendThreshold().thresholdScale(colorScale);
			} else {
				legend = componentLegendColor().colorScale(colorScale).itemType("rect");
			}
		}

		legendBox.append("g").attr("transform", "translate(10, 10)").append("text").style("font-weight", "bold").attr("dominant-baseline", "hanging").text(title);

		legend.width(width - 20).height(height - 40);
		legendBox.append("g").attr("transform", "translate(10, 30)").call(legend);
	}

	/**
  * Detect Scale Type
  *
  * @param {d3.scale} scale - Scale type.
  *
  * @returns {string}
  */
	function scaleType(scale) {
		var s = scale.copy();
		if (s.domain([1, 2]).range([1, 2])(1.5) === 1) {
			return "ordinal";
		} else if (typeof s.invert !== "function") {
			return "threshold";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) === 1.5) {
			return "linear";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) instanceof Date) {
			return "time";
		} else {
			return "not supported";
		}
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return my;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
  * Title Getter / Setter
  *
  * @param {string} _v - Title text.
  * @returns {*}
  */
	my.title = function (_v) {
		if (!arguments.length) return title;
		title = _v;
		return my;
	};

	return my;
}

var component = {
	barsCircular: componentBarsCircular,
	barsStacked: componentBarsStacked,
	barsHorizontal: componentBarsHorizontal,
	barsVertical: componentBarsVertical,
	bubbles: componentBubbles,
	candleSticks: componentCandleSticks,
	circularAxis: componentCircularAxis,
	circularRingLabels: componentCircularRingLabels,
	circularSectorLabels: componentCircularSectorLabels,
	creditTag: componentCreditTag,
	donut: componentDonut,
	donutLabels: componentDonutLabels,
	heatMapRing: componentHeatMapRing,
	heatMapRow: componentHeatMapRow,
	htmlList: componentHtmlList,
	htmlTable: componentHtmlTable,
	labeledNode: componentLabeledNode,
	legend: componentLegend,
	legendSize: componentLegendSize,
	legendColor: componentLegendColor,
	legendThreshold: componentLegendThreshold,
	lineChart: componentLineChart,
	numberCard: componentNumberCard,
	polarArea: componentPolarArea,
	radarArea: componentRadarArea,
	roseChartSector: componentRoseChartSector,
	proportionalAreaCircles: componentProportionalAreaCircles,
	scatterPlot: componentScatterPlot,
	title: componentTitle
};

/**
 * Circular Bar Chart (also called: Progress Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
function chartBarChartCircular () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartCircular";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;
	var innerRadius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var startAngle = 0;
	var endAngle = 270;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [valueMax, 0];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).rangeRound([innerRadius, radius]).padding(0.15);

		yScale = d3.scaleLinear().domain(valueExtent).range([startAngle, endAngle]);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartCircular
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["circularAxis", "barsCircular", "circularSectorLabels", "circularRingLabels"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Circular Axis
			var circularAxis = component.circularAxis().radius(radius).radialScale(yScale).ringScale(xScale);

			chart.select(".circularAxis").call(circularAxis);

			// Radial Bars
			var barsCircular = component.barsCircular().radius(radius).innerRadius(innerRadius).colorScale(colorScale).xScale(xScale).dispatch(dispatch);

			chart.select(".barsCircular").datum(data).call(barsCircular);

			// Outer Labels
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(yScale).textAnchor("middle");

			chart.select(".circularSectorLabels").call(circularSectorLabels);

			// Ring Labels
			var circularRingLabels = component.circularRingLabels().radialScale(xScale).textAnchor("middle");

			chart.select(".circularRingLabels").call(circularRingLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Clustered Bar Chart (also called: Multi-set Bar Chart; Grouped Bar Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/grouped-bar-chart/
 */
function chartBarChartClustered () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartClustered";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var yAxisLabel = null;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var valueExtent = [0, maxValue];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(rowKeys).rangeRound([0, chartW]).padding(0.1);

		yScale = d3.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartClustered
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["barChart", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			data = dataTransform(data).rotate();
			init(data);

			// Vertical Bars Component
			var barsVertical = component.barsVertical().width(xScale.bandwidth()).height(chartH).colorScale(colorScale).dispatch(dispatch);

			// Create Bar Groups
			var categoryGroup = chart.select(".barChart").selectAll(".categoryGroup").data(data);

			categoryGroup.enter().append("g").classed("categoryGroup", true).attr("transform", function (d) {
				return "translate(" + xScale(d.key) + ", 0)";
			}).merge(categoryGroup).call(barsVertical);

			categoryGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Label
			chart.select(".yAxis").append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").text(yAxisLabel);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Y Axix Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Stacked Bar Chart
 *
 * @module
 * @see http://datavizproject.com/data-type/stacked-bar-chart/
 */
function chartBarChartStacked () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartStacked";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var yAxisLabel = null;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    rowTotalsMax = _dataTransform$summar.rowTotalsMax;

		var valueExtent = [0, rowTotalsMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(rowKeys).rangeRound([0, chartW]).padding(0.15);

		yScale = d3.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartStacked
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["barChart", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			data = dataTransform(data).rotate();
			init(data);

			// Stacked Bars Component
			var barsStacked = component.barsStacked().width(xScale.bandwidth()).height(chartH).colorScale(colorScale).dispatch(dispatch);

			// Create Bar Groups
			var categoryGroup = chart.select(".barChart").selectAll(".categoryGroup").data(data);

			categoryGroup.enter().append("g").classed("categoryGroup", true).attr("transform", function (d) {
				return "translate(" + xScale(d.key) + ", 0)";
			}).merge(categoryGroup).call(barsStacked);

			categoryGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Label
			chart.select(".yAxis").append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").text(yAxisLabel);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Y Axix Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Bar Chart (horizontal) (also called: Bar Chart; Bar Graph)
 *
 * @module
 * @see http://datavizproject.com/data-type/bar-chart/
 */
function chartBarChartHorizontal () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartHorizontal";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 80 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		yScale = d3.scaleBand().domain(columnKeys).rangeRound([0, chartH]).padding(0.15);

		xScale = d3.scaleLinear().domain(valueExtent).range([0, chartW]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartHorizontal
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["barChart", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Horizontal Bars
			var barsHorizontal = component.barsHorizontal().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch);

			chart.select(".barChart").datum(data).call(barsHorizontal);

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Label
			var yLabel = chart.select(".yAxis").selectAll(".yAxisLabel").data([data.key]);

			yLabel.enter().append("text").classed("yAxisLabel", true).attr("y", -10).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "center").merge(yLabel).transition().text(function (d) {
				return d;
			});
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch on Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Bar Chart (vertical) (also called: Bar Chart; Bar Graph)
 *
 * @module
 * @see http://datavizproject.com/data-type/bar-chart/
 */
function chartBarChartVertical () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartVertical";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, chartW]).padding(0.15);

		yScale = d3.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartVertical
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["barChart", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Vertical Bars
			var barsVertical = component.barsVertical().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).dispatch(dispatch);

			chart.select(".barChart").datum(data).call(barsVertical);

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Label
			var yLabel = chart.select(".yAxis").selectAll(".yAxisLabel").data([data.key]);

			yLabel.enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").merge(yLabel).transition().text(function (d) {
				return d;
			});
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Bubble Chart
 *
 * @module
 * @see http://datavizproject.com/data-type/bubble-chart/
 */
function chartBubbleChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "bubbleChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 40, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var sizeScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var minRadius = 3;
	var maxRadius = 20;
	var yAxisLabel = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    _dataTransform$summar2 = _dataTransform$summar.coordinatesExtent,
		    xExtent = _dataTransform$summar2.x,
		    yExtent = _dataTransform$summar2.y,
		    valueExtent = _dataTransform$summar.valueExtent;

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(valueExtent).range([minRadius, maxRadius]);
		}

		xScale = d3.scaleLinear().domain(xExtent).range([0, chartW]).nice();

		yScale = d3.scaleLinear().domain(yExtent).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bubbleChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["zoomArea", "bubbleGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Add Clip Path - Still Proof of Concept
			chart.append('defs').append('clipPath').attr('id', 'plotAreaClip').append('rect').attr('width', chartW).attr('height', chartH);

			// Bubble Chart
			var bubbles = component.bubbles().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).minRadius(minRadius).maxRadius(maxRadius).dispatch(dispatch);

			var bubbleGroups = chart.select(".bubbleGroups").attr('clip-path', "url(" + window.location + "#plotAreaClip)").append("g");

			var seriesGroup = bubbleGroups.selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).call(bubbles);

			seriesGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			// Zoom
			var zoom = d3.zoom().extent([[0, 0], [chartW, chartH]]).scaleExtent([1, 20]).translateExtent([[0, 0], [chartW, chartH]]).on("zoom", zoomed);

			chart.select(".zoomArea").append("rect").attr("width", chartW).attr("height", chartH).attr("fill", "none").attr("pointer-events", "all").call(zoom);

			function zoomed() {
				var xScaleZoomed = d3.event.transform.rescaleX(xScale);
				var yScaleZoomed = d3.event.transform.rescaleY(yScale);

				xAxis.scale(xScaleZoomed);
				yAxis.scale(yScaleZoomed);
				bubbles.xScale(xScaleZoomed).yScale(yScaleZoomed);

				chart.select(".xAxis").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
				chart.select(".yAxis").call(yAxis);

				bubbleGroups.selectAll(".seriesGroup").call(bubbles);
			}

			chart.select(".yAxis").call(yAxis);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Y Axis Label Getter / Setter
  *
  * @param {string} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Candlestick Chart (also called: Japanese Candlestick; OHLC Chart; Box Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
function chartCandlestickChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "candlestickChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 40, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = ["green", "red"];
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// TODO: Use dataTransform() to calculate date domains?
		data.values.forEach(function (d, i) {
			// Convert to date
			data.values[i].date = Date.parse(d.date);
		});
		var maxDate = d3.max(data.values, function (d) {
			return d.date;
		});
		var minDate = d3.min(data.values, function (d) {
			return d.date;
		});

		var ONE_DAY_IN_MILLISECONDS = 86400000;
		var dateDomain = [new Date(minDate - ONE_DAY_IN_MILLISECONDS), new Date(maxDate + ONE_DAY_IN_MILLISECONDS)];

		// TODO: Use dataTransform() to calculate candle min/max?
		var yDomain = [d3.min(data.values, function (d) {
			return d.low;
		}), d3.max(data.values, function (d) {
			return d.high;
		})];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain([true, false]).range(colors);
		}

		xScale = d3.scaleTime().domain(dateDomain).range([0, chartW]);

		yScale = d3.scaleLinear().domain(yDomain).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias candlestickChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["zoomArea", "candleSticks", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Candle Sticks
			var candleSticks = component.candleSticks().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch);

			chart.select(".candleSticks").datum(data).call(candleSticks);

			// X Axis
			var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%y"));

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Labels
			var yLabel = chart.select(".yAxis").selectAll(".yAxisLabel").data([data.key]);

			yLabel.enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").merge(yLabel).transition().text(function (d) {
				return d;
			});

			// Experimental Brush
			var brush = d3.brushX().extent([[0, 0], [chartW, chartH]]).on("brush start", brushStart).on("brush end", brushEnd);

			chart.select(".zoomArea").call(brush);

			function brushStart() {
				// console.log(this);
			}

			function brushEnd() {
				// console.log(this);
			}
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Donut Chart (also called: Doughnut Chart; Pie Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/donut-chart/
 */
function chartDonutChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "donutChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeCubic, duration: 750 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;
	var innerRadius = void 0;

	/* Scales */
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys;

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias donutChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["donut", "donutLabels"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Donut Slices
			var donutChart = component.donut().radius(radius).innerRadius(innerRadius).colorScale(colorScale).dispatch(dispatch);

			chart.select(".donut").datum(data).call(donutChart);

			// Donut Labels
			var donutLabels = component.donutLabels().radius(radius).innerRadius(innerRadius);

			chart.select(".donutLabels").datum(data).call(donutLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Gantt Chart
 *
 * @module
 * @see http://datavizproject.com/data-type/gannt-chart/
 */
function chartGanttChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "ganttChart";
	var width = 600;
	var height = 400;
	var margin = { top: 20, right: 20, bottom: 40, left: 80 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = d3.ez.palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var tickFormat = "%d-%b-%y";
	var dateDomainMin = void 0;
	var dateDomainMax = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	var init = function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys;

		// TODO: Use dataTransform() to calculate date domains?


		data.forEach(function (d) {
			d.values.forEach(function (b) {
				dateDomainMin = d3.min([b.startDate, dateDomainMin]);
				dateDomainMax = d3.max([b.endDate, dateDomainMax]);
			});
		});
		var dateDomain = [dateDomainMin, dateDomainMax];

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleTime().domain(dateDomain).range([0, chartW]).clamp(true);

		yScale = d3.scaleBand().domain(rowKeys).rangeRound([0, chartH]).padding(0.1);
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias ganttChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["ganttBarGroup", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			var _this = this;

			// Initialise Data
			init(data);

			// Create bar groups
			var seriesGroup = chart.select(".ganttBarGroup").selectAll(".seriesGroup").data(data).enter().append("g").classed("seriesGroup", true).attr("id", function (d) {
				return d.key;
			}).attr("transform", function (d) {
				return "translate(0," + yScale(d.key) + ")";
			});

			// Add bars
			var bars = seriesGroup.selectAll(".bar").data(function (d) {
				return d.values;
			});

			bars.enter().append("rect").attr("rx", 3).attr("ry", 3).attr("class", "bar").attr("y", 0).attr("x", function (d) {
				return xScale(d.startDate);
			}).attr("height", yScale.bandwidth()).attr("fill", function (d) {
				return colorScale(d.key);
			}).attr("width", function (d) {
				return Math.max(1, xScale(d.endDate) - xScale(d.startDate));
			}).on("mouseover", function (d) {
				return dispatch.call("customValueMouseOver", _this, d);
			}).on("click", function (d) {
				return dispatch.call("customValueClick", _this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
				return xScale(d.startDate);
			}).attr("width", function (d) {
				return Math.max(1, xScale(d.endDate) - xScale(d.startDate));
			});

			var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8);

			chart.select(".xAxis").attr("transform", "translate(0, " + chartH + ")").call(xAxis);

			var yAxis = d3.axisLeft().scale(yScale).tickSize(0);

			chart.select(".yAxis").call(yAxis);
		});
	};

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Time Domain Getter / Setter
  *
  * @param {array} _v - Time domain array.
  * @returns {*}
  */
	my.timeDomain = function (_v) {
		if (!arguments.length) return [dateDomainMin, dateDomainMax];
		dateDomainMin = _[0];
		dateDomainMax = _[1];
		return this;
	};

	/**
  * Tick Format Getter / Setter
  *
  * @param {string} _v - String format.
  * @returns {*}
  */
	my.tickFormat = function (_v) {
		if (!arguments.length) return tickFormat;
		tickFormat = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Circular Heat Map (also called: Radial Heat Map)
 *
 * @module
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
function chartHeatMapRadial () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "heatMapRadial";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = ["#D34152", "#f4bc71", "#FBF6C4", "#9bcf95", "#398abb"];
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;
	var innerRadius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var startAngle = 0;
	var endAngle = 270;
	var thresholds = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    tmpThresholds = _dataTransform$summar.thresholds;

		if (typeof thresholds === "undefined") {
			thresholds = tmpThresholds;
		}

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleThreshold().domain(thresholds).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]).padding(0.1);

		yScale = d3.scaleBand().domain(rowKeys).rangeRound([radius, innerRadius]).padding(0.1);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias heatMapRadial
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["heatRingsGroups", "circularSectorLabels", "circularRingLabels"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Heat Map Rings
			var heatMapRing = component.heatMapRing().radius(function (d) {
				return yScale(d.key);
			}).innerRadius(function (d) {
				return yScale(d.key) + yScale.bandwidth();
			}).startAngle(startAngle).endAngle(endAngle).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch).thresholds(thresholds);

			// Create Series Group
			var seriesGroup = chart.select(".heatRingsGroups").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).call(heatMapRing);

			seriesGroup.exit().remove();

			// Circular Labels
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(xScale).textAnchor("start");

			chart.select(".circularSectorLabels").call(circularSectorLabels);

			// Ring Labels
			var circularRingLabels = component.circularRingLabels().radialScale(yScale).textAnchor("middle");

			chart.select(".circularRingLabels").call(circularRingLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Inner Radius Getter / Setter
  *
  * @param {number} _v - Inner radius in px.
  * @returns {*}
  */
	my.innerRadius = function (_v) {
		if (!arguments.length) return innerRadius;
		innerRadius = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Thresholds Getter / Setter
  *
  * @param {Array} _v - Array of thresholds.
  * @returns {*}
  */
	my.thresholds = function (_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return my;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Heat Map (also called: Heat Table; Density Table; Heat Map)
 *
 * @module
 * @see http://datavizproject.com/data-type/heat-map/
 */
function chartHeatMapTable () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "heatMapTable";
	var width = 400;
	var height = 300;
	var margin = { top: 50, right: 20, bottom: 20, left: 50 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = ["#D34152", "#f4bc71", "#FBF6C4", "#9bcf95", "#398abb"];
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var thresholds = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    tmpThresholds = _dataTransform$summar.thresholds;

		if (typeof thresholds === "undefined") {
			thresholds = tmpThresholds;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleThreshold().domain(thresholds).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.1);

		yScale = d3.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.1);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias heatMapTable
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["heatRowGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Heat Map Rows
			var heatMapRow = component.heatMapRow().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch).thresholds(thresholds);

			// Create Series Group
			var seriesGroup = chart.select(".heatRowGroups").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").attr("class", "seriesGroup").attr("transform", function (d) {
				return "translate(0, " + yScale(d.key) + ")";
			}).merge(seriesGroup).call(heatMapRow);

			seriesGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisTop(xScale);

			chart.select(".xAxis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Thresholds Getter / Setter
  *
  * @param {Array} _v - Array of thresholds.
  * @returns {*}
  */
	my.thresholds = function (_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/line-chart/
 */
function chartLineChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "lineChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 40, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var yAxisLabel = null;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		// TODO: Use dataTransform() to calculate date domains?
		data.forEach(function (d, i) {
			d.values.forEach(function (b, j) {
				data[i].values[j].key = new Date(b.key * 1000);
			});
		});
		var dateDomain = d3.extent(data[0].values, function (d) {
			return d.key;
		});

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		xScale = d3.scaleTime().domain(dateDomain).range([0, chartW]);

		yScale = d3.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias lineChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["zoomArea", "lineGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Add Clip Path (Proof of Concept)
			chart.append('defs').append('clipPath').attr('id', 'plotAreaClip').append('rect').attr('width', chartW).attr('height', chartH);

			// Line Chart
			var lineChart = component.lineChart().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch);

			// Scatter Plot
			var scatterPlot = component.scatterPlot().width(chartW).height(chartH).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);

			var lineGroups = chart.select(".lineGroups").attr('clip-path', "url(" + window.location + "#plotAreaClip)").append("g");

			var seriesGroup = lineGroups.selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").attr("class", "seriesGroup").style("fill", function (d) {
				return colorScale(d.key);
			}).merge(seriesGroup).call(lineChart).call(scatterPlot);

			seriesGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%y"));

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").text(yAxisLabel);

			// Zoom
			var zoom = d3.zoom().extent([[0, 0], [chartW, chartH]]).scaleExtent([1, 8]).translateExtent([[0, 0], [chartW, chartH]]).on("zoom", zoomed);

			chart.select(".zoomArea").append("rect").attr("width", chartW).attr("height", chartH).attr("fill", "none").attr("pointer-events", "all").call(zoom);

			function zoomed() {
				var xScaleZoomed = d3.event.transform.rescaleX(xScale);

				xAxis.scale(xScaleZoomed);
				lineChart.xScale(xScaleZoomed);
				scatterPlot.xScale(xScaleZoomed);

				chart.select(".xAxis").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

				lineGroups.selectAll(".seriesGroup").call(lineChart).call(scatterPlot);
			}
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Y Axix Label Getter / Setter
  *
  * @param {number} _v - Label text.
  * @returns {*}
  */
	my.yAxisLabel = function (_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Polar Area Chart (also called: Coxcomb Chart; Rose Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
function chartPolarAreaChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "polarAreaChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var startAngle = 0;
	var endAngle = 360;
	var capitalizeLabels = false;
	var colorLabels = false;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]).padding(0.15);

		yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias polarAreaChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["circularAxis", "polarArea", "circularSectorLabels", "verticalAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Circular Axis
			var circularAxis = component.circularAxis().radialScale(xScale).ringScale(yScale).radius(radius);

			chart.select(".circularAxis").call(circularAxis);

			// Radial Bar Chart
			var polarArea = component.polarArea().radius(radius).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch);

			chart.select(".polarArea").datum(data).call(polarArea);

			// Vertical Axis
			// We reverse the yScale
			var axisScale = d3.scaleLinear().domain(yScale.domain()).range(yScale.range().reverse()).nice();

			var verticalAxis = d3.axisLeft(axisScale);

			chart.select(".verticalAxis").attr("transform", "translate(0," + -radius + ")").call(verticalAxis);

			// Circular Labels
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(xScale).textAnchor("start");

			chart.select(".circularSectorLabels").call(circularSectorLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Capital Labels Getter / Setter
  *
  * @param {boolean} _v - Display capital labels or not?
  * @returns {*}
  */
	my.capitalizeLabels = function (_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
  * Color Labels Getter / Setter
  *
  * @param {Array} _v - Array of color labels.
  * @returns {*}
  */
	my.colorLabels = function (_v) {
		if (!arguments.length) return colorLabels;
		colorLabels = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Punch Card
 *
 * @module
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
function chartPunchCard () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "punchCard";
	var width = 400;
	var height = 300;
	var margin = { top: 50, right: 20, bottom: 20, left: 50 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;

	/* Scales */
	var sizeScale = void 0;
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var minRadius = 2;
	var maxRadius = 20;
	var useGlobalScale = true;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueExtent = _dataTransform$summar.valueExtent;

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(valueExtent).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.05);

		yScale = d3.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.05);

		var sizeExtent = useGlobalScale ? valueExtent : [0, d3.max(data[1].values, function (d) {
			return d.value;
		})];

		sizeScale = d3.scaleLinear().domain(sizeExtent).range([minRadius, maxRadius]);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias punchCard
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["punchRowGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Proportional Area Circles
			var proportionalAreaCircles = component.proportionalAreaCircles().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).sizeScale(sizeScale).dispatch(dispatch);

			var seriesGroup = chart.select(".punchRowGroups").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").attr("class", "seriesGroup").attr("transform", function (d) {
				return "translate(0, " + yScale(d.key) + ")";
			}).merge(seriesGroup).call(proportionalAreaCircles);

			seriesGroup.exit().remove();

			// X Axis
			var xAxis = d3.axisTop(xScale);

			chart.select(".xAxis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Min Radius Getter / Setter
  *
  * @param {number} _v - Min radius in px.
  * @returns {*}
  */
	my.minRadius = function (_v) {
		if (!arguments.length) return minRadius;
		minRadius = _v;
		return this;
	};

	/**
  * Max Radius Getter / Setter
  *
  * @param {number} _v - Max radius in px.
  * @returns {*}
  */
	my.maxRadius = function (_v) {
		if (!arguments.length) return maxRadius;
		maxRadius = _v;
		return this;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Global Scale Use Getter / Setter
  *
  * @param {boolean} _v - Use global scale or not?
  * @returns {*}
  */
	my.useGlobalScale = function (_v) {
		if (!arguments.length) return useGlobalScale;
		useGlobalScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Radar Chart (also called: Spider Chart; Web Chart; Star Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/radar-diagram/
 */
function chartRadarChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "radarChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/* Other Customisation Options */
	var startAngle = 0;
	var endAngle = 360;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(columnKeys).range([startAngle, endAngle]);

		yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]).nice();
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias radarChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["circularAxis", "circularSectorLabels", "verticalAxis axis", "radarGroup"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Create Circular Axis
			var circularAxis = component.circularAxis().radialScale(xScale).ringScale(yScale).radius(radius);

			chart.select(".circularAxis").call(circularAxis);

			var radarArea = component.radarArea().radius(radius).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);

			// Create Radars
			var seriesGroup = chart.select(".radarGroup").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").classed("seriesGroup", true).attr("fill", function (d) {
				return colorScale(d.key);
			}).style("stroke", function (d) {
				return colorScale(d.key);
			}).merge(seriesGroup).call(radarArea);

			// Creating vertical scale
			var axisScale = d3.scaleLinear().domain(yScale.domain()).range(yScale.range().reverse()).nice();

			// Render vertical scale on circle
			var verticalAxis = d3.axisLeft(axisScale);
			chart.select(".verticalAxis").attr("transform", "translate(0," + -radius + ")").call(verticalAxis);

			// Adding Circular Labels on Page
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(xScale).textAnchor("start");

			chart.select(".circularSectorLabels").call(circularSectorLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

/**
 * Rose Chart (also called: Coxcomb Chart; Circumplex Chart; Nightingale Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
function chartRoseChart () {

	/* Default Properties */
	var svg = void 0;
	var chart = void 0;
	var classed = "roseChart";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	var chartW = void 0;
	var chartH = void 0;
	var radius = void 0;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}

		xScale = d3.scaleBand().domain(rowKeys).rangeRound([0, 360]);

		yScale = d3.scaleLinear().domain(valueExtent).range([0, radius]);
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias roseChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["circularSectorLabels", "rosePetalGroups"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Rose Sectors
			var roseChartSector = component.roseChartSector().radius(radius).colorScale(colorScale).yScale(yScale).stacked(false).dispatch(dispatch);

			// Create Series Group
			var seriesGroup = chart.select(".rosePetalGroups").selectAll(".seriesGroup").data(data);

			seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).each(function (d) {
				var startAngle = xScale(d.key);
				var endAngle = xScale(d.key) + xScale.bandwidth();
				roseChartSector.startAngle(startAngle).endAngle(endAngle);
				d3.select(this).call(roseChartSector);
			});

			seriesGroup.exit().remove();

			// Circular Labels
			var circularSectorLabels = component.circularSectorLabels().radius(radius * 1.04).radialScale(xScale).textAnchor("start").capitalizeLabels(true);

			chart.select(".circularSectorLabels").call(circularSectorLabels);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _v - Width in px.
  * @returns {*}
  */
	my.width = function (_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _v - Height in px.
  * @returns {*}
  */
	my.height = function (_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
  * Margin Getter / Setter
  *
  * @param {number} _v - Margin in px.
  * @returns {*}
  */
	my.margin = function (_v) {
		if (!arguments.length) return margin;
		margin = _v;
		return this;
	};

	/**
  * Radius Getter / Setter
  *
  * @param {number} _v - Radius in px.
  * @returns {*}
  */
	my.radius = function (_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
  * Transition Getter / Setter
  *
  * @param {d3.transition} _v - D3 transition style.
  * @returns {*}
  */
	my.transition = function (_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _v - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return this;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _v - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return this;
	};

	/**
  * Dispatch Getter / Setter
  *
  * @param {d3.dispatch} _v - Dispatch event handler.
  * @returns {*}
  */
	my.dispatch = function (_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
	};

	/**
  * Dispatch On Getter
  *
  * @returns {*}
  */
	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}

var chart = {
	barChartCircular: chartBarChartCircular,
	barChartClustered: chartBarChartClustered,
	barChartStacked: chartBarChartStacked,
	barChartHorizontal: chartBarChartHorizontal,
	barChartVertical: chartBarChartVertical,
	bubbleChart: chartBubbleChart,
	candlestickChart: chartCandlestickChart,
	donutChart: chartDonutChart,
	ganttChart: chartGanttChart,
	heatMapRadial: chartHeatMapRadial,
	heatMapTable: chartHeatMapTable,
	lineChart: chartLineChart,
	polarAreaChart: chartPolarAreaChart,
	punchCard: chartPunchCard,
	radarChart: chartRadarChart,
	roseChart: chartRoseChart
};

/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

var author$1 = "James Saunders";
var date = new Date();
var copyright = "Copyright (C) " + date.getFullYear() + " " + author$1;

var ez = function () {
	var ez = base;
	ez.version = version;
	ez.author = author$1;
	ez.copyright = copyright;
	ez.license = license;
	ez.chart = chart;
	ez.component = component;
	ez.palette = palette;
	ez.dataTransform = dataTransform;

	// TODO: Remove base when new 'ez' constructor fully tested.
	ez.base = base;

	return ez;
}();

return ez;

})));
