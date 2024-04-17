/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2020 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global = global || self, (global.d3 = global.d3 || {}, global.d3.ez = factory(global.d3)));
}(this, function (d3) { 'use strict';

	var version = "3.3.15";
	var license = "GPL-2.0";

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

	var slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
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
				return Object.values(data)[0];
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
				data.forEach(function (item) {
					var rowKey = item.key;

					item.values.forEach(function (value) {
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
		var rowTotalsMin = function () {
			if (dataType === MULTI_SERIES) {
				return d3.min(Object.values(rowTotals));
			}
		}();

		/**
	  * Row Totals Max
	  *
	  * @returns {number}
	  */
		var rowTotalsMax = function () {
			if (dataType === MULTI_SERIES) {
				return d3.max(Object.values(rowTotals));
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
	  * Column Keys
	  *
	  * @returns {Array}
	  */
		var columnKeys = function () {
			if (dataType === SINGLE_SERIES) {
				return data.values.map(function (d) {
					return d.key;
				});
			}

			var ret = [];
			data.forEach(function (item) {
				var tmp = [];
				item.values.forEach(function (value) {
					tmp.push(value.key);
				});
				ret = Array.from(new Set([].concat(tmp, toConsumableArray(ret))));
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
			data.forEach(function (item) {
				item.values.forEach(function (value) {
					var columnName = value.key;
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
		var columnTotalsMin = function () {
			if (dataType === MULTI_SERIES) {
				return d3.min(Object.values(columnTotals));
			}
		}();

		/**
	  * Column Totals Max
	  *
	  * @returns {Array}
	  */
		var columnTotalsMax = function () {
			if (dataType === MULTI_SERIES) {
				return d3.max(Object.values(columnTotals));
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
			data.forEach(function (item) {
				item.values.forEach(function (value) {
					ret = typeof ret === "undefined" ? value.value : Math.min(ret, +value.value);
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
				ret = Math.max.apply(Math, toConsumableArray(data.values.map(function (d) {
					return +d.value;
				})));
			} else {
				data.forEach(function (item) {
					item.values.forEach(function (value) {
						ret = typeof ret !== "undefined" ? Math.max(ret, +value.value) : +value.value;
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
	  * Value Extent Stacked
	  *
	  * @returns {Array}
	  */
		var valueExtentStacked = function () {
			var lowestNegativeSum = Infinity;
			var highestPositiveSum = -Infinity;

			if (dataType === MULTI_SERIES) {
				data.forEach(function (row) {
					var _row$values$reduce = row.values.reduce(function (acc, column) {
						var value = column.value;
						if (value < 0) {
							acc[0] += value;
						} else if (value > 0) {
							acc[1] += value;
						}
						return acc;
					}, [0, 0]),
					    _row$values$reduce2 = slicedToArray(_row$values$reduce, 2),
					    negativeSum = _row$values$reduce2[0],
					    positiveSum = _row$values$reduce2[1];

					lowestNegativeSum = Math.min(lowestNegativeSum, negativeSum);
					highestPositiveSum = Math.max(highestPositiveSum, positiveSum);
				});
			}
			// Check if lowestNegativeSum is still Infinity (no negative values found), if so, set it to 0
			var finalLowestNegativeSum = lowestNegativeSum === Infinity ? 0 : lowestNegativeSum;

			// Check if highestPositiveSum is still -Infinity (no positive values found), if so, set it to 0
			var finalHighestPositiveSum = highestPositiveSum === -Infinity ? 0 : highestPositiveSum;

			// Return the final results as an array
			return [finalLowestNegativeSum, finalHighestPositiveSum];
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
					ret[key] = Math.min.apply(Math, toConsumableArray(data.values.map(function (d) {
						return +d[key];
					})));
				});
				return ret;
			} else {
				data.forEach(function (item) {
					item.values.forEach(function (value) {
						coordinateKeys.forEach(function (key) {
							ret[key] = key in ret ? Math.min(ret[key], +value[key]) : +value[key];
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
					ret[key] = Math.max.apply(Math, toConsumableArray(data.values.map(function (d) {
						return +d[key];
					})));
				});
				return ret;
			} else {
				data.forEach(function (item) {
					item.values.forEach(function (value) {
						coordinateKeys.forEach(function (key) {
							ret[key] = key in ret ? Math.max(ret[key], +value[key]) : +value[key];
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
				data.forEach(function (item) {
					item.values.forEach(function (value) {
						ret = Math.max(ret, decimalPlaces(value.value));
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
			var bands = [0.25, 0.50, 0.75, 1.00];

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
	 * Reusable Stacked Bar Chart Component
	 *
	 * @module
	 */
	function componentBarsStacked () {

	    /* Default Properties */
	    var xScale = void 0;
	    var yScale = void 0;
	    var colorScale = void 0;
	    var opacity = 1;
	    var classed = "barsStacked";
	    var transition = { ease: d3.easeBounce, duration: 200 };
	    var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	    /**
	     * Constructor
	     *
	     * @constructor
	     * @alias barsStacked
	     * @param {d3.selection} selection - The chart holder D3 selection.
	     */
	    function my(selection) {
	        selection.each(function () {
	            var height = d3.max(yScale.range());
	            var width = xScale.bandwidth();

	            var _d3$extent = d3.extent(yScale.domain()),
	                _d3$extent2 = slicedToArray(_d3$extent, 2),
	                valueMin = _d3$extent2[0],
	                valueMax = _d3$extent2[1];

	            // Stack Generator


	            var stacker = function stacker(data) {
	                var series = [];
	                var y0 = 0;
	                var y1 = 0;
	                var yn0 = 0;
	                var yn1 = 0;
	                data.forEach(function (d, i) {
	                    if (d.value < 0) {
	                        // It's a negative bar - we want it to go down.
	                        yn1 = yn1 + d.value + 4;
	                        series[i] = {
	                            key: d.key,
	                            value: d.value,
	                            y1: yn0,
	                            y0: yn1
	                        };
	                        yn0 += d.value;
	                    } else {
	                        // It's a positive bar - we want it to go up.
	                        y1 = y0 + d.value;
	                        series[i] = {
	                            key: d.key,
	                            value: d.value,
	                            y0: y0,
	                            y1: y1
	                        };
	                        y0 += d.value;
	                    }
	                });

	                return series;
	            };

	            // Update series group
	            var seriesGroup = d3.select(this).classed(classed, true).attr("id", function (d) {
	                return d.key;
	            }).on("mouseover", function (e, d) {
	                dispatch.call("customSeriesMouseOver", this, d);
	            }).on("click", function (e, d) {
	                dispatch.call("customSeriesClick", this, d);
	            });

	            // Add bars to series group
	            var bars = seriesGroup.selectAll(".bar").data(function (d) {
	                return stacker(d.values);
	            });

	            bars.enter().append("rect").classed("bar", true).on("mouseover", function (e, d) {
	                dispatch.call("customValueMouseOver", this, d);
	            }).on("click", function (e, d) {
	                dispatch.call("customValueClick", this, d);
	            }).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", 0).attr("y", function (d) {
	                return yScale(d.y1);
	            }).attr("width", width).attr("height", function (d) {
	                var padding = 3;
	                return d.value < 0 ? yScale(d.value + valueMax) - padding : height - yScale(d.value + valueMin) - padding;
	            }).attr("fill", function (d) {
	                return colorScale(d.key);
	            }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	                return colorScale(d.key);
	            }).attr("stroke-width", "1px").attr("rx", 2).attr("ry", 2);

	            bars.exit().transition().style("opacity", 0).remove();
	        });
	    }

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
	     * Opacity Getter / Setter
	     *
	     * @param {number} _v - Opacity 0 -1.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
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
	 * Reusable Vertical Bar Chart Component
	 *
	 * @module
	 */
	function componentBarsVertical () {

		/* Default Properties */
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var opacity = 1;
		var classed = "barsVertical";
		var transition = { ease: d3.easeBounce, duration: 200 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias barsVertical
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function () {
				// Required to calculate negative bars
				var _d3$extent = d3.extent(yScale.domain()),
				    _d3$extent2 = slicedToArray(_d3$extent, 2),
				    valueMin = _d3$extent2[0],
				    valueMax = _d3$extent2[1];

				var height = d3.max(yScale.range());

				// Update series group
				var seriesGroup = d3.select(this).classed(classed, true).attr("id", function (d) {
					return d.key;
				}).on("mouseover", function (e, d) {
					dispatch.call("customSeriesMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customSeriesClick", this, d);
				});

				// Add bars to series group
				var bars = seriesGroup.selectAll(".bar").data(function (d) {
					return d.values;
				});

				bars.enter().append("rect").classed("bar", true).on("mouseover", function (e, d) {
					dispatch.call("customValueMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customValueClick", this, d);
				}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
					return xScale(d.key);
				}).attr("y", function (d) {
					return d.value < 0 ? yScale(0) : yScale(d.value);
				}).attr("width", xScale.bandwidth()).attr("height", function (d) {
					return d.value < 0 ? yScale(d.value + valueMax) : height - yScale(d.value + valueMin);
				}).attr("fill", function (d) {
					return colorScale(d.key);
				}).attr("fill-opacity", opacity).attr("stroke", function (d) {
					return colorScale(d.key);
				}).attr("stroke-width", "1px").attr("rx", 2).attr("ry", 2);

				bars.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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

				var circle = d3.select(this).classed(classed, true).selectAll("circle").data([data]);

				circle.enter().append("circle").merge(circle).transition().attr("r", function (d) {
					return sizeAccessor(d);
				}).attr("fill-opacity", opacity).style("stroke", color).style("stroke-width", strokeWidth).style("fill", color);

				var text = d3.select(this).classed(classed, true).selectAll("text").data([data]);

				text.enter().append("text").merge(text).transition().text(label).attr("dx", -r).attr("dy", -r).style("display", display).style("font-size", fontSize + "px").attr("fill", "currentColor").attr("alignment-baseline", "middle").style("text-anchor", "end");
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
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var sizeScale = void 0;
		var classed = "bubbles";
		var transition = { ease: d3.easeLinear, duration: 200 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
		var opacity = 1;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias bubbles
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {

				// Update series group
				var seriesGroup = d3.select(this);
				seriesGroup.classed(classed, true).attr("id", function (d) {
					return d.key;
				}).on("mouseover", function (e, d) {
					dispatch.call("customSeriesMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customSeriesClick", this, d);
				});

				// Add bubbles to series group
				var bubble = componentLabeledNode().radius(function (d) {
					return sizeScale(d.value);
				}).color(colorScale(data.key)).label(function (d) {
					return d.key;
				}).display("none").opacity(opacity).stroke(1, "white").dispatch(dispatch);

				var bubbles = seriesGroup.selectAll(".bubble").data(function (d) {
					return d.values;
				});

				bubbles.enter().append("g").classed("bubble", true).on("mouseover", function (e, d) {
					d3.select(this).select("text").style("display", "block");
					dispatch.call("customValueMouseOver", this, d);
				}).on("mouseout", function () {
					d3.select(this).select("text").style("display", "none");
				}).on("click", function (e, d) {
					dispatch.call("customValueClick", this, d);
				}).merge(bubbles).attr("transform", function (d) {
					return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
				}).call(bubble);

				bubbles.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	    var xScale = void 0;
	    var yScale = void 0;
	    var colorScale = void 0;
	    var classed = "candleSticks";
	    var transition = { ease: d3.easeBounce, duration: 0 };
	    var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	    var candleWidth = 4;
	    var opacity = 1;

	    /**
	     * Constructor
	     *
	     * @constructor
	     * @alias candleSticks
	     * @param {d3.selection} selection - The chart holder D3 selection.
	     */
	    function my(selection) {
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

	                paths.enter().append("path").classed("high-low-line", true).merge(paths).transition().ease(transition.ease).duration(transition.duration).attr("d", function (d) {
	                    return line([{ x: xScale(d.date), y: yScale(d.high) }, { x: xScale(d.date), y: yScale(d.low) }]);
	                });

	                return bars;
	            };

	            // Open Close Bars
	            var openCloseBars = function openCloseBars(bars) {
	                var rect = bars.selectAll(".open-close-bar").data(function (d) {
	                    return [d];
	                });

	                rect.enter().append("rect").classed("open-close-bar", true).merge(rect).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
	                    return xScale(d.date) - candleWidth;
	                }).attr("y", function (d) {
	                    return isUpDay(d) ? yScale(d.close) : yScale(d.open);
	                }).attr("width", candleWidth * 2).attr("height", function (d) {
	                    return isUpDay(d) ? yScale(d.open) - yScale(d.close) : yScale(d.close) - yScale(d.open);
	                });

	                return bars;
	            };

	            // Update series group
	            var seriesGroup = d3.select(this).classed(classed, true).attr("id", function (d) {
	                return d.key;
	            }).on("mouseover", function (e, d) {
	                dispatch.call("customSeriesMouseOver", this, d);
	            }).on("click", function (e, d) {
	                dispatch.call("customSeriesClick", this, d);
	            });

	            // Add candles to series group
	            var candles = seriesGroup.selectAll(".candle").data(function (d) {
	                return d.values;
	            });

	            candles.enter().append("g").classed("candle", true).on("mouseover", function (e, d) {
	                dispatch.call("customValueMouseOver", this, d);
	            }).on("click", function (e, d) {
	                dispatch.call("customValueClick", this, d);
	            }).merge(candles).attr("fill", function (d) {
	                return colorScale(isUpDay(d));
	            }).attr("stroke", function (d) {
	                return colorScale(isUpDay(d));
	            }).attr("fill-opacity", opacity).call(highLowLines).call(openCloseBars);
	            //.call(openCloseTicks);

	            // highLowLines(candles);
	            // openCloseBars(candles);
	            // openCloseTicks(candles);

	            candles.exit().remove();
	        });
	    }

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
	     * Opacity Getter / Setter
	     *
	     * @param {number} _v - Opacity 0 -1.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
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
	    var opacity = 1;

	    /**
	     * Constructor
	     *
	     * @constructor
	     * @alias donut
	     * @param {d3.selection} selection - The chart holder D3 selection.
	     */
	    function my(selection) {
	        selection.each(function (data) {
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

	            slices.enter().append("path").attr("class", "slice").on("mouseover", function (d) {
	                dispatch.call("customValueMouseOver", this, d);
	            }).on("click", function (d) {
	                dispatch.call("customValueClick", this, d);
	            }).merge(slices).transition().duration(transition.duration).ease(transition.ease).attr("fill", function (d) {
	                return colorScale(d.data.key);
	            }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	                return colorScale(d.data.key);
	            }).attr("stroke-width", "1px").attr("d", arc).attrTween("d", arcTween);

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
	     * Opacity Getter / Setter
	     *
	     * @param {Number} _v - Opacity level.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
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

				labels.enter().append("text").attr("class", "label").attr("dy", ".35em").attr("fill", "currentColor").merge(labels).transition().duration(transition.duration).text(function (d) {
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

				connectors.enter().append("polyline").attr("class", "connector").attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", "2px").merge(connectors).transition().duration(transition.duration).attrTween("points", function (d) {
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
	 * Reusable Heat Map Table Row Component
	 *
	 * @module
	 */
	function componentHeatMapRow () {

		/* Default Properties */
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var classed = "heatMapRow";
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
		var opacity = 1;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias heatMapRow
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function () {
				// Calculate cell sizes
				var cellHeight = yScale.bandwidth();
				var cellWidth = xScale.bandwidth();

				// Update series group
				var seriesGroup = d3.select(this);
				seriesGroup.classed(classed, true).attr("id", function (d) {
					return d.key;
				}).on("mouseover", function (e, d) {
					dispatch.call("customSeriesMouseOver", this, d);
				}).on("click", function (e, d) {
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

				cells.enter().append("rect").attr("class", "cell").on("mouseover", function (e, d) {
					dispatch.call("customValueMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customValueClick", this, d);
				}).merge(cells).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
					return xScale(d.key);
				}).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("width", cellWidth).attr("height", cellHeight).attr("fill", function (d) {
					return colorScale(d.value);
				}).style("fill-opacity", opacity).attr("stroke", function (d) {
					return colorScale(d.value);
				}).attr("stroke-width", "1px");

				cells.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
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
				    rowKeys = _dataTransform$summar.rowKeys,
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
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var opacity = 1;
		var classed = "lineChart";
		var transition = { ease: d3.easeLinear, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias lineChart
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
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
				var seriesGroup = d3.select(this).classed(classed, true).attr("id", function (d) {
					return d.key;
				}).on("mouseover", function (e, d) {
					dispatch.call("customSeriesMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customSeriesClick", this, d);
				});

				// Add lines to series group
				var seriesLine = seriesGroup.selectAll(".seriesLine").data(function (d) {
					return [d];
				});

				seriesLine.enter().append("path").attr("class", "seriesLine").attr("stroke-width", 1.5).attr("fill", "none").merge(seriesLine).transition().duration(transition.duration).attr("stroke", function (d) {
					return colorScale(d.key);
				}).attrTween("d", function (d) {
					return pathTween(d.values);
				}).attr("opacity", opacity);

				seriesLine.exit().transition().style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	 * Reusable Number Row Component
	 *
	 * @module
	 */
	function componentNumberCard () {

		/* Default Properties */
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var classed = "numberCard";
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
		var opacity = 1;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias numberCard
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
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

				numbers.enter().append("text").attr("class", "number").attr("text-anchor", "middle").attr("dominant-baseline", "central").on("mouseover", function (d) {
					dispatch.call("customValueMouseOver", this, d);
				}).on("click", function (d) {
					dispatch.call("customValueClick", this, d);
				}).merge(numbers).transition().ease(transition.ease).duration(transition.duration).text(function (d) {
					return d["value"];
				}).attr("fill", function (d) {
					return colorScale(d.value);
				}).attr("x", function (d) {
					return xScale(d.key) + cellWidth / 2;
				}).attr("y", cellHeight / 2);

				numbers.exit().transition().style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	 * Reusable Proportional Area Circles Component
	 *
	 * @module
	 */
	function componentProportionalAreaCircles () {

		/* Default Properties */
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var sizeScale = void 0;
		var classed = "proportionalAreaCircles";
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
		var opacity = 1;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias proportionalAreaCircles
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
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

				// Add spots to series
				var spot = componentLabeledNode().radius(function (d) {
					return sizeScale(d.value);
				}).color(function (d) {
					return colorScale(d.value);
				}).label(function (d) {
					return d.value;
				}).display("none").opacity(opacity).stroke(1, "currentColor").dispatch(dispatch);

				var spots = seriesGroup.selectAll(".punchSpot").data(function (d) {
					return d.values;
				});

				spots.enter().append("g").classed("punchSpot", true).on("mouseover", function (e, d) {
					d3.select(this).select("text").style("display", "block");
					dispatch.call("customValueMouseOver", this, d);
				}).on("mouseout", function () {
					d3.select(this).select("text").style("display", "none");
				}).on("click", function (e, d) {
					dispatch.call("customValueClick", this, d);
				}).merge(spots).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
					return "translate(" + (cellWidth / 2 + xScale(d.key)) + "," + cellHeight / 2 + ")";
				}).call(spot);

				spots.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	function componentScatterPlot () {

		/* Default Properties */
		var xScale = void 0;
		var yScale = void 0;
		var colorScale = void 0;
		var opacity = 1;
		var classed = "scatterPlot";
		var transition = { ease: d3.easeLinear, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias scatterPlot
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function () {
				// Update series group
				var seriesGroup = d3.select(this).classed(classed, true).attr("id", function (d) {
					return d.key;
				}).on("mouseover", function (d) {
					dispatch.call("customSeriesMouseOver", this, d);
				}).on("click", function (d) {
					dispatch.call("customSeriesClick", this, d);
				});

				// Add dots to series group
				var seriesDots = seriesGroup.selectAll(".seriesDots").data(function (d) {
					return [d];
				});

				var seriesDotsEnter = seriesDots.enter().append("g").classed("seriesDots", true).attr("fill", function (d) {
					return colorScale(d.key);
				}).merge(seriesDots);

				var dots = seriesDotsEnter.selectAll(".dot").data(function (d) {
					return d.values;
				});

				dots.enter().append("circle").attr("class", "dot").attr("r", 3).on("mouseover", function (e, d) {
					dispatch.call("customValueMouseOver", this, d);
				}).on("click", function (e, d) {
					dispatch.call("customValueClick", this, d);
				}).merge(dots).transition().ease(transition.ease).duration(transition.duration).attr("cx", function (d) {
					return xScale(d.key);
				}).attr("cy", function (d) {
					return yScale(d.value);
				}).attr("opacity", opacity);

				dots.exit().transition().style("opacity", 0).remove();
			});
		}

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
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	 * Reusable Size Legend Component
	 *
	 * @module
	 */
	function componentLegendSize () {

	    /* Default Properties */
	    var width = 100;
	    var height = 150;
	    var sizeScale = void 0;
	    var itemCount = 4;
	    var opacity = 1;
	    var transition = { ease: d3.easeLinear, duration: 0 };

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

	        var data = function () {
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

	            // '\u2014' = em dash '—'
	            return ranges.map(function (v, i) {
	                return {
	                    x: sizeScale(domainMax),
	                    y: yScale(i),
	                    r: sizeScale(ranges[i][0]),
	                    text: v[0].toFixed(0) + " \u2014 " + v[1].toFixed(0)
	                };
	            });
	        }();

	        // Legend Container
	        var legendContainer = selection.selectAll(".legendContainer").data([data]);

	        var legendContainerEnter = legendContainer.enter().append("g").classed("legendContainer", true).attr("width", width).attr("height", height).merge(legendContainer);

	        var items = legendContainerEnter.selectAll(".legendItem").data(function (d) {
	            return d;
	        });

	        var itemsEnter = items.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
	            return "translate(0," + d.y + ")";
	        });

	        items.exit().remove();

	        itemsEnter.append("circle").attr("r", function (d) {
	            return d.r;
	        }).attr("cx", function (d) {
	            return d.x;
	        }).attr("fill", "#cad4e7").attr("stroke", "#cad4e7").attr("stroke-width", 1).attr("fill-opacity", opacity / 2);

	        itemsEnter.append("text").attr("font-size", "0.9em").attr("fill", "currentColor").attr("dominant-baseline", "middle").attr("x", function (d) {
	            return d.x * 2 + 5;
	        }).text(function (d) {
	            return d.text;
	        });

	        var itemsTrans = items.transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
	            return "translate(0," + d.y + ")";
	        });

	        itemsTrans.select("text").text(function (d) {
	            return d.text;
	        });

	        itemsTrans.select("circle").attr("fill-opacity", opacity);
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

	    /**
	     * Opacity Getter / Setter
	     *
	     * @param {number} _v - Opacity 0 -1.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
	        return this;
	    };

	    /**
	     * Transition Getter / Setter
	     *
	     * @param {d3.transition} _v - Transition.
	     * @returns {*}
	     */
	    my.transition = function (_v) {
	        if (!arguments.length) return transition;
	        transition = _v;
	        return this;
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
		var height = 150;
		var colorScale = void 0;
		var itemCount = void 0;
		var itemType = "rect";
		var opacity = 1;
		var transition = { ease: d3.easeLinear, duration: 0 };

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

			var data = function () {
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
			}();

			// Legend Container
			var legendContainer = selection.selectAll(".legendContainer").data([data]);

			var legendContainerEnter = legendContainer.enter().append("g").classed("legendContainer", true).attr("width", width).attr("height", height).merge(legendContainer);

			var items = legendContainerEnter.selectAll(".legendItem").data(function (d) {
				return d;
			});

			var itemsEnter = items.enter().append("g").classed("legendItem", true).attr("transform", function (d) {
				return "translate(0," + d.y + ")";
			});

			items.exit().remove();

			switch (itemType) {
				case "line":
					itemsEnter.append("line").attr("x1", 0).attr("y1", function (d) {
						return d.height / 2;
					}).attr("x2", function (d) {
						return d.width;
					}).attr("y2", function (d) {
						return d.height / 2;
					}).attr("stroke", function (d) {
						return d.color;
					}).attr("opacity", opacity).attr("stroke-width", 2);

					items.transition().ease(transition.ease).duration(transition.duration).select("line").attr("x1", 0).attr("y1", function (d) {
						return d.height / 2;
					}).attr("x2", function (d) {
						return d.width;
					}).attr("y2", function (d) {
						return d.height / 2;
					}).attr("opacity", opacity).attr("stroke", function (d) {
						return d.color;
					}).attr("stroke-width", 2);
					break;

				case "rect":
				default:
					itemsEnter.append("rect").attr("rx", 2).attr("ry", 2).attr("width", function (d) {
						return d.width;
					}).attr("height", function (d) {
						return d.height;
					}).style("fill", function (d) {
						return d.color;
					}).attr("fill-opacity", opacity).attr("stroke", function (d) {
						return d.color;
					}).attr("stroke-width", 1);

					items.transition().ease(transition.ease).duration(transition.duration).select("rect").attr("width", function (d) {
						return d.width;
					}).attr("height", function (d) {
						return d.height;
					}).style("fill", function (d) {
						return d.color;
					}).attr("fill-opacity", opacity).attr("stroke", function (d) {
						return d.color;
					}).attr("stroke-width", 1);
					break;
			}

			itemsEnter.append("text").attr("font-size", "0.9em").text(function (d) {
				return d.text;
			}).attr("dominant-baseline", "middle").attr("x", 40).attr("y", function (d) {
				return d.height / 2;
			}).attr("fill", "currentColor");

			items.transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
				return "translate(0," + d.y + ")";
			}).select("text").text(function (d) {
				return d.text;
			}).attr("y", function (d) {
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

		/**
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Transition Getter / Setter
	  *
	  * @param {d3.transition} _v - Transition.
	  * @returns {*}
	  */
		my.transition = function (_v) {
			if (!arguments.length) return transition;
			transition = _v;
			return this;
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
		var height = 150;
		var thresholdScale = void 0;
		var opacity = 1;
		var transition = { ease: d3.easeLinear, duration: 0 };

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

			var domainMin = d3.min(thresholdScale.domain());
			var domainMax = d3.max(thresholdScale.domain());
			var domainMargin = (domainMax - domainMin) * 0.1;

			var x = d3.scaleLinear().domain([domainMin - domainMargin, domainMax + domainMargin]).range([0, height]);

			// Legend Container
			var legendContainer = selection.selectAll(".legendContainer").data([0]);

			var legendContainerEnter = legendContainer.enter().append("g").classed("legendContainer", true).attr("width", width).attr("height", height).merge(legendContainer);

			// Use D3 Axis to generate scale ticks
			var axis = d3.axisRight(x).tickSize(30).tickValues(thresholdScale.domain());

			legendContainerEnter.transition().ease(transition.ease).duration(transition.duration).call(axis).selectAll(".domain").attr("opacity", 0);

			var colors = legendContainerEnter.selectAll("rect").data(thresholdScale.range().map(function (color) {
				var d = thresholdScale.invertExtent(color);
				if (typeof d[0] === 'undefined') d[0] = x.domain()[0];
				if (typeof d[1] === 'undefined') d[1] = x.domain()[1];
				return d;
			}));

			colors.enter().append("rect").merge(colors).transition().ease(transition.ease).duration(transition.duration).attr("width", 20).attr("y", function (d) {
				return x(d[0]);
			}).attr("height", function (d) {
				return x(d[1]) - x(d[0]);
			}).attr("fill", function (d) {
				return thresholdScale(d[0]);
			}).attr("opacity", opacity);
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

		/**
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Transition Getter / Setter XX
	  *
	  * @param {d3.transition} _v - Transition.
	  * @returns {*}
	  */
		my.transition = function (_v) {
			if (!arguments.length) return transition;
			transition = _v;
			return this;
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
		var margin = { top: 35, right: 10, bottom: 10, left: 10 };
		var sizeScale = void 0;
		var colorScale = void 0;
		var title = "Key";
		var legend = void 0;
		var opacity = 1;
		var transition = { ease: d3.easeBounce, duration: 0 };
		var itemType = "rect";

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

			// Size Legend
			if (typeof sizeScale !== "undefined") {
				legend = componentLegendSize().sizeScale(sizeScale).itemCount(4);
			}

			// Colour Legend
			if (typeof colorScale !== "undefined") {
				if (scaleType(colorScale) === "threshold") {
					legend = componentLegendThreshold().thresholdScale(colorScale);
				} else {
					legend = componentLegendColor().colorScale(colorScale).itemType(itemType);
				}
			}
			legend.opacity(opacity).transition(transition);

			// Legend Box
			var legendBox = selection.selectAll(".legendBox").data([0]);

			var legendBoxEnter = legendBox.enter().append("g").attr("class", "legendBox");

			// Border Box
			legendBoxEnter.append("rect").classed("legendBorder", true).attr("width", width).attr("height", height).attr("fill-opacity", 0).attr("stroke-width", 1).attr("stroke", "currentcolor");

			legendBox.transition().ease(transition.ease).duration(transition.duration).selectAll(".legendBorder").attr("width", width).attr("height", height);

			// Legend Title
			legendBoxEnter.append("g").classed("legendTitle", true).attr("transform", "translate(10, 10)").append("text").style("font-weight", "bold").attr("dominant-baseline", "hanging").attr("fill", "currentColor").text(title);

			// Legend Component
			legend.width(width - (margin.left + margin.right)).height(height - (margin.top + margin.bottom));

			// Legend Items
			legendBoxEnter.append("g").classed("legendBox", true).attr("transform", "translate(" + margin.left + ", " + margin.top + ")").call(legend);

			legendBox.selectAll(".legendBox").call(legend);
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

		/**
	  * Item Type Getter / Setter
	  *
	  * @param {number} _v - Rect or Line
	  * @returns {*}
	  */
		my.itemType = function (_v) {
			if (!arguments.length) return itemType;
			itemType = _v;
			return this;
		};

		/**
	  * Opacity Getter / Setter
	  *
	  * @param {number} _v - Opacity 0 -1.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Transition Getter / Setter
	  *
	  * @param {d3.transition} _v - Transition.
	  * @returns {*}
	  */
		my.transition = function (_v) {
			if (!arguments.length) return transition;
			transition = _v;
			return this;
		};

		return my;
	}

	//import componentBarsCircular from "./component/barsCircular";

	var component = {
		//barsCircular: componentBarsCircular,
		barsStacked: componentBarsStacked,
		//barsHorizontal: componentBarsHorizontal,
		barsVertical: componentBarsVertical,
		bubbles: componentBubbles,
		candleSticks: componentCandleSticks,
		//circularAxis: componentCircularAxis,
		//circularRingLabels: componentCircularRingLabels,
		//circularSectorLabels: componentCircularSectorLabels,
		donut: componentDonut,
		donutLabels: componentDonutLabels,
		//heatMapRing: componentHeatMapRing,
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
		//polarArea: componentPolarArea,
		//radarArea: componentRadarArea,
		//roseChartSector: componentRoseChartSector,
		proportionalAreaCircles: componentProportionalAreaCircles,
		scatterPlot: componentScatterPlot
	};

	/**
	 * Bar Chart (Vertical) (also called: Bar Chart; Bar Graph)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/bar-chart/
	 * @see https://www.atlassian.com/data/charts/stacked-bar-chart-complete-guide
	 */
	function chartBarChart () {

		/* Default Properties */
		var classed = "barChart";
		var width = 700;
		var height = 400;
		var colors = palette.categorical(1);
		var margin = { top: 40, right: 40, bottom: 40, left: 40 };
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/* Other Customisation Options */
		var yAxisLabel = null;
		var stacked = false;
		var opacity = 1;
		var showAxis = true;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias barChartVertical
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {
				// Set up margins and dimensions for the chart
				var legendW = 120;
				var legendPad = 15;
				var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
				var chartH = Math.max(height - margin.top - margin.bottom, 100);
				var legendH = Math.max(chartH / 2, 100);

				// Create Scales and Axis
				data = dataTransform(data).rotate();

				var _dataTransform$summar = dataTransform(data).summary(),
				    rowKeys = _dataTransform$summar.rowKeys,
				    columnKeys = _dataTransform$summar.columnKeys,
				    valueExtent = _dataTransform$summar.valueExtent,
				    valueExtentStacked = _dataTransform$summar.valueExtentStacked;

				var _valueExtent = slicedToArray(valueExtent, 2),
				    valueMin = _valueExtent[0],
				    valueMax = _valueExtent[1];

				if (stacked) {
					var _valueExtentStacked = slicedToArray(valueExtentStacked, 2);
					// Sum negative stacked bars


					valueMin = _valueExtentStacked[0];
					valueMax = _valueExtentStacked[1];
				} else {
					// Set min to zero if min is more than zero
					valueMin = valueMin > 0 ? 0 : valueMin;
				}
				var yDomain = [valueMin, valueMax];

				var xScale2 = d3.scaleBand().domain(rowKeys).range([0, chartW]).padding(0.2);

				var xScale = d3.scaleBand().domain(columnKeys).range([0, xScale2.bandwidth()]).padding(0.05);

				var yScale = d3.scaleLinear().domain(yDomain).range([chartH, 0]);

				var colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);

				// Create SVG element (if it does not exist already)
				var svg = function (selection) {
					var el = selection._groups[0][0];
					if (!!el.ownerSVGElement || el.tagName === "svg") {
						return selection;
					} else {
						return selection.append("svg");
					}
				}(selection);

				svg.classed("d3ez", true).attr("width", width).attr("height", height);

				// Update the chart dimensions and add layer groups
				var container = svg.selectAll(".container").data([data]);

				container.exit().remove();

				// Chart Container
				var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

				// Update the chart dimensions and add layer groups
				var layers = ["chart", "xAxis", "yAxis", "legend"];
				containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
					return d;
				});

				// Bars Component
				var bars = stacked ? component.barsStacked().xScale(xScale2) : component.barsVertical().xScale(xScale);
				bars.colorScale(colorScale).yScale(yScale).opacity(opacity).dispatch(dispatch);

				// Series Group
				var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
					return d;
				});

				seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
					var x = xScale2(d.key);
					var y = chartH - yScale(valueMin);
					return "translate(" + x + "," + y + ")";
				}).call(bars);

				seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

				// X-Axis
				var xAxis = d3.axisBottom(xScale2);

				containerEnter.select(".xAxis").classed("axis", true).attr("transform", "translate(0," + chartH + ")").call(xAxis);

				// Y-Axis
				var yAxis = d3.axisLeft(yScale);

				containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

				// Y Axis Label
				containerEnter.select(".yAxis").selectAll(".yAxisLabel").data([yAxisLabel]).enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "currentColor").style("text-anchor", "end").transition().text(function (d) {
					return d;
				});

				containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

				// Legend
				var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);

				containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	  * Stacked Getter / Setter
	  *
	  * @param {Boolean} _v - Stacked or grouped bar chart.
	  * @returns {*}
	  */
		my.stacked = function (_v) {
			if (!arguments.length) return stacked;
			stacked = _v;
			return this;
		};

		/**
	  * Opacity Getter / Setter
	  *
	  * @param {Number} _v - Opacity level.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Show Axis Getter / Setter
	  *
	  * @param {Boolean} _v - Show axis true / false.
	  * @returns {*}
	  */
		my.showAxis = function (_v) {
			if (!arguments.length) return showAxis;
			showAxis = _v;
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
	 * @see https://www.atlassian.com/data/charts/bubble-chart-complete-guide
	 */
	function chartBubbleChart () {

		/* Default Properties */
		var classed = "bubbleChart";
		var width = 400;
		var height = 300;
		var colors = palette.categorical(1);
		var margin = { top: 40, right: 40, bottom: 40, left: 40 };
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/* Other Customisation Options */
		var minRadius = 3;
		var maxRadius = 20;
		var yAxisLabel = void 0;
		var showAxis = true;
		var opacity = 1;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias bubbleChart
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {
				// Set up margins and dimensions for the chart
				var legendW = 120;
				var legendPad = 15;
				var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
				var chartH = Math.max(height - margin.top - margin.bottom, 100);
				var legendH = Math.max(chartH / 2, 100);

				var _dataTransform$summar = dataTransform(data).summary(),
				    rowKeys = _dataTransform$summar.rowKeys,
				    _dataTransform$summar2 = _dataTransform$summar.coordinatesExtent,
				    xExtent = _dataTransform$summar2.x,
				    yExtent = _dataTransform$summar2.y,
				    valueExtent = _dataTransform$summar.valueExtent;

				var xScale = d3.scaleLinear().domain(xExtent).range([0, chartW]).nice();

				var yScale = d3.scaleLinear().domain(yExtent).range([chartH, 0]).nice();

				var colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);

				var sizeScale = d3.scaleLinear().domain(valueExtent).range([minRadius, maxRadius]);

				// Create SVG element (if it does not exist already)
				var svg = function (selection) {
					var el = selection._groups[0][0];
					if (!!el.ownerSVGElement || el.tagName === "svg") {
						return selection;
					} else {
						return selection.append("svg");
					}
				}(selection);

				svg.classed("d3ez", true).attr("width", width).attr("height", height);

				// Update the chart dimensions and add layer groups
				var container = svg.selectAll(".container").data([data]);

				container.exit().remove();

				// Chart Container
				var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

				// Update the chart dimensions and add layer groups
				var layers = ["zoomArea", "chart", "xAxis", "yAxis", "legend"];
				containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
					return d;
				});

				// Bubble Component
				var bubbles = component.bubbles().xScale(xScale).yScale(yScale).colorScale(colorScale).sizeScale(sizeScale).opacity(opacity).dispatch(dispatch);

				// Series Group
				var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
					return d;
				});

				seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).call(bubbles);

				seriesGroup.exit().remove();

				// X-Axis
				var xAxis = d3.axisBottom(xScale);

				containerEnter.select(".xAxis").classed("axis", true).attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

				// Y-Axis
				var yAxis = d3.axisLeft(yScale);

				containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

				containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

				// Legend
				var legend = component.legend().sizeScale(sizeScale).height(legendH).width(legendW).opacity(opacity);

				containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	  * Opacity Getter / Setter
	  *
	  * @param {Number} _v - Opacity level.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Show Axis Getter / Setter
	  *
	  * @param {Boolean} _v - Show axis true / false.
	  * @returns {*}
	  */
		my.showAxis = function (_v) {
			if (!arguments.length) return showAxis;
			showAxis = _v;
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
	 * @see https://www.atlassian.com/data/charts/box-plot-complete-guide
	 */
	function chartCandlestickChart () {

	    /* Default Properties */
	    var classed = "candlestickChart";
	    var width = 700;
	    var height = 400;
	    var colors = ["green", "red"];
	    var margin = { top: 20, right: 20, bottom: 40, left: 40 };
	    var transition = { ease: d3.easeBounce, duration: 500 };
	    var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	    /* Other Customisation Options */
	    var yAxisLabel = void 0;
	    var opacity = 1;
	    var showAxis = true;

	    /**
	     * Constructor
	     *
	     * @constructor
	     * @alias candlestickChart
	     * @param {d3.selection} selection - The chart holder D3 selection.
	     */
	    function my(selection) {
	        selection.each(function (data) {
	            var legendW = 120;
	            var legendPad = 15;
	            var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	            var chartH = Math.max(height - margin.top - margin.bottom, 100);
	            var legendH = Math.max(chartH / 2, 100);

	            data = data[0]; // FIXME: Convert input data to support multi-series.

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

	            var colorScale = d3.scaleOrdinal().domain([true, false]).range(colors);

	            var xScale = d3.scaleTime().domain(dateDomain).range([0, chartW]);

	            var yScale = d3.scaleLinear().domain(yDomain).range([chartH, 0]).nice();

	            // Create SVG element (if it does not exist already)
	            var svg = function (selection) {
	                var el = selection._groups[0][0];
	                if (!!el.ownerSVGElement || el.tagName === "svg") {
	                    return selection;
	                } else {
	                    return selection.append("svg");
	                }
	            }(selection);

	            svg.classed("d3ez", true).attr("width", width).attr("height", height);

	            // Update the chart dimensions and add layer groups
	            var container = svg.selectAll(".container").data([data]);

	            container.exit().remove();

	            // Chart Container
	            var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

	            // Update the chart dimensions and add layer groups
	            var layers = ["zoomArea", "chart", "xAxis", "yAxis", "legend"];
	            containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	                return d;
	            });

	            // Candle Stick Component
	            var candleSticks = component.candleSticks().xScale(xScale).yScale(yScale).colorScale(colorScale).dispatch(dispatch).opacity(opacity);

	            // Series Group
	            var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	                return [d];
	            }); // FIXME: Convert input data to support multi-series.

	            seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).call(candleSticks);

	            seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

	            // X Axis
	            var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%y"));

	            containerEnter.select(".xAxis").classed("axis", true).attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

	            // Y-Axis
	            var yAxis = d3.axisLeft(yScale);

	            containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

	            // Y-Axis Labels
	            var yLabel = container.select(".yAxis").selectAll(".yAxisLabel").data([data.key]);

	            yLabel.enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").merge(yLabel).transition().text(function (d) {
	                return d;
	            });

	            containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

	            // Experimental Brush
	            var brush = d3.brushX().extent([[0, 0], [chartW, chartH]]).on("brush start", brushStart).on("brush end", brushEnd);

	            containerEnter.select(".zoomArea").call(brush);

	            function brushStart() {
	                // console.log(this);
	            }

	            function brushEnd() {}
	            // console.log(this);


	            // Legend
	            var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("line").opacity(opacity);

	            containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	     * Opacity Getter / Setter
	     *
	     * @param {Number} _v - Opacity level.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
	        return this;
	    };

	    /**
	     * Show Axis Getter / Setter
	     *
	     * @param {Boolean} _v - Show axis true / false.
	     * @returns {*}
	     */
	    my.showAxis = function (_v) {
	        if (!arguments.length) return showAxis;
	        showAxis = _v;
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
	 * @see https://www.atlassian.com/data/charts/pie-chart-complete-guide
	 */
	function chartDonutChart () {

	    /* Default Properties */
	    var classed = "donutChart";
	    var width = 400;
	    var height = 300;
	    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
	    var transition = { ease: d3.easeCubic, duration: 0 };
	    var colors = palette.categorical(3);
	    var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	    var radius = void 0;
	    var innerRadius = void 0;
	    var opacity = 1;

	    /**
	     * Constructor
	     *
	     * @constructor
	     * @alias donutChart
	     * @param {d3.selection} selection - The chart holder D3 selection.
	     */
	    function my(selection) {
	        selection.each(function (data) {

	            var legendW = 120;
	            var legendPad = 15;
	            var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	            var chartH = Math.max(height - margin.top - margin.bottom, 100);
	            var legendH = Math.max(chartH / 2, 100);

	            data = dataTransform(data).rotate();

	            var _dataTransform$summar = dataTransform(data).summary(),
	                columnKeys = _dataTransform$summar.columnKeys;

	            if (typeof radius === "undefined") {
	                var w = chartW / data.length;
	                var h = chartH / data.length;
	                radius = Math.min(w, h) / 2;
	            }

	            if (typeof innerRadius === "undefined") {
	                innerRadius = radius / 2;
	            }

	            var colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);

	            function generateLayout(cellCount, width, height) {
	                var layout = [];
	                var cols = Math.ceil(Math.sqrt(cellCount));
	                var rows = Math.ceil(cellCount / cols);
	                var cellWidth = width / cols;
	                var cellHeight = height / rows;
	                var index = 0;

	                for (var i = 0; i < rows; i++) {
	                    for (var j = 0; j < cols; j++) {
	                        if (index < cellCount) {
	                            var x = j * cellWidth + cellWidth / 2;
	                            var y = i * cellHeight + cellHeight / 2;
	                            layout.push({
	                                x: x,
	                                y: y,
	                                width: cellWidth,
	                                height: cellHeight
	                            });
	                            index++;
	                        }
	                    }
	                }

	                return layout;
	            }

	            var layout = generateLayout(data.length, chartW, chartH);

	            // Create SVG element (if it does not exist already)
	            var svg = function (selection) {
	                var el = selection._groups[0][0];
	                if (!!el.ownerSVGElement || el.tagName === "svg") {
	                    return selection;
	                } else {
	                    return selection.append("svg");
	                }
	            }(selection);

	            svg.classed("d3ez", true).attr("width", width).attr("height", height);

	            // Update the chart dimensions and add layer groups
	            var container = svg.selectAll(".container").data([data]);

	            container.exit().remove();

	            // Chart Container
	            var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

	            // Update the chart dimensions and add layer groups
	            var layers = ["chart", "legend"];
	            containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	                return d;
	            });

	            // Donut Slice Component
	            var donutChart = component.donut().radius(radius).innerRadius(innerRadius).colorScale(colorScale).opacity(opacity).dispatch(dispatch);

	            // Donut Label Component
	            var donutLabels = component.donutLabels().radius(radius).innerRadius(innerRadius);

	            // Series Group
	            var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	                return d;
	            });

	            seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d, i) {
	                var x = layout[i].x;
	                var y = layout[i].y;
	                return "translate(" + x + "," + y + ")";
	            }).call(donutChart).call(donutLabels);

	            seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

	            // Legend
	            var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);

	            containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	     * Opacity Getter / Setter
	     *
	     * @param {Number} _v - Opacity level.
	     * @returns {*}
	     */
	    my.opacity = function (_v) {
	        if (!arguments.length) return opacity;
	        opacity = _v;
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
	 * Heat Map (also called: Heat Table; Density Table; Heat Map)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/heat-map/
	 * @see https://www.atlassian.com/data/charts/heatmap-complete-guide
	 */
	function chartHeatMap () {

		/* Default Properties */
		var classed = "heatMap";
		var width = 700;
		var height = 400;
		var colors = palette.diverging(2).slice(0, 5);
		var margin = { top: 40, right: 40, bottom: 40, left: 40 };
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/* Other Customisation Options */
		var thresholds = void 0;
		var opacity = 1;
		var showAxis = true;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias heatMap
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {
				// Set up margins and dimensions for the chart
				var legendW = 120;
				var legendPad = 15;
				var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
				var chartH = Math.max(height - margin.top - margin.bottom, 100);
				var legendH = Math.max(chartH / 2, 100);

				var _dataTransform$summar = dataTransform(data).summary(),
				    rowKeys = _dataTransform$summar.rowKeys,
				    columnKeys = _dataTransform$summar.columnKeys,
				    tmpThresholds = _dataTransform$summar.thresholds;

				if (typeof thresholds === "undefined") {
					thresholds = tmpThresholds;
				}

				var xScale = d3.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.1);

				var yScale = d3.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.1);

				var colorScale = d3.scaleThreshold().domain(thresholds).range(colors);

				// Create SVG element (if it does not exist already)
				var svg = function (selection) {
					var el = selection._groups[0][0];
					if (!!el.ownerSVGElement || el.tagName === "svg") {
						return selection;
					} else {
						return selection.append("svg");
					}
				}(selection);

				svg.classed("d3ez", true).attr("width", width).attr("height", height);

				// Update the chart dimensions and add layer groups
				var container = svg.selectAll(".container").data([data]);

				container.exit().remove();

				// Chart Container
				var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

				// Update the chart dimensions and add layer groups
				var layers = ["chart", "xAxis", "yAxis", "legend"];
				containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
					return d;
				});

				// Heat Map Row Component
				var heatMapRow = component.heatMapRow().xScale(xScale).yScale(yScale).colorScale(colorScale).opacity(opacity).dispatch(dispatch);

				// Series Group
				var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(data);

				seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
					return "translate(0, " + yScale(d.key) + ")";
				}).call(heatMapRow);

				seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

				// X-Axis
				var xAxis = d3.axisTop(xScale);

				containerEnter.select(".xAxis").classed("axis", true).call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

				// Y-Axis
				var yAxis = d3.axisLeft(yScale);

				containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

				containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

				// Legend
				var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).opacity(opacity);

				containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	  * Opacity Getter / Setter
	  *
	  * @param {Number} _v - Opacity level.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Show Axis Getter / Setter
	  *
	  * @param {Boolean} _v - Show axis true / false.
	  * @returns {*}
	  */
		my.showAxis = function (_v) {
			if (!arguments.length) return showAxis;
			showAxis = _v;
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
	 * @see https://www.atlassian.com/data/charts/line-chart-complete-guide
	 */
	function chartLineChart () {

		/* Default Properties */
		var classed = "lineChart";
		var width = 700;
		var height = 400;
		var colors = palette.categorical(1);
		var margin = { top: 40, right: 40, bottom: 40, left: 40 };
		var transition = { ease: d3.easeLinear, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/* Other Customisation Options */
		var yAxisLabel = null;
		var opacity = 1;
		var showAxis = true;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias lineChart
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {
				// Set up margins and dimensions for the chart
				var legendW = 120;
				var legendPad = 15;
				var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
				var chartH = Math.max(height - margin.top - margin.bottom, 100);
				var legendH = Math.max(chartH / 2, 100);

				// Create Scales and Axis
				// data = dataTransform(data).rotate();

				var _dataTransform$summar = dataTransform(data).summary(),
				    rowKeys = _dataTransform$summar.rowKeys,
				    columnKeys = _dataTransform$summar.columnKeys,
				    valueMin = _dataTransform$summar.valueMin,
				    valueMax = _dataTransform$summar.valueMax;
				// Set min to zero if min is more than zero


				valueMin = valueMin > 0 ? 0 : valueMin;
				var valueExtent = [valueMin, valueMax];

				var xScale = d3.scalePoint().domain(columnKeys).range([0, chartW]);

				var yScale = d3.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();

				var colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);

				// Create SVG element (if it does not exist already)
				var svg = function (selection) {
					var el = selection._groups[0][0];
					if (!!el.ownerSVGElement || el.tagName === "svg") {
						return selection;
					} else {
						return selection.append("svg");
					}
				}(selection);

				svg.classed("d3ez", true).attr("width", width).attr("height", height);

				// Update the chart dimensions and add layer groups
				var container = svg.selectAll(".container").data([data]);

				container.exit().remove();

				// Chart Container
				var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

				// Update the chart dimensions and add layer groups
				var layers = ["zoomArea", "chart", "xAxis", "yAxis", "legend"];
				containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
					return d;
				});

				// Line Chart Component
				var lineChart = component.lineChart().colorScale(colorScale).xScale(xScale).yScale(yScale).opacity(opacity).dispatch(dispatch);

				// Scatter Plot Component
				var scatterPlot = component.scatterPlot().colorScale(colorScale).yScale(yScale).xScale(xScale).opacity(opacity).dispatch(dispatch);

				// Series Group
				var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
					return d;
				});

				seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).call(lineChart).call(scatterPlot);

				seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

				// X-Axis
				var xAxis = d3.axisBottom(xScale);

				containerEnter.select(".xAxis").classed("axis", true).attr("transform", "translate(0," + chartH + ")").call(xAxis);

				// Y-Axis
				var yAxis = d3.axisLeft(yScale);

				containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

				// Y-Axis Label
				containerEnter.select(".yAxis").selectAll(".yAxisLabel").data([yAxisLabel]).enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "currentColor").style("text-anchor", "end").transition().text(function (d) {
					return d;
				});

				containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

				// Legend
				var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("line").opacity(opacity);

				containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	  * Opacity Getter / Setter
	  *
	  * @param {Number} _v - Opacity level.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
			return this;
		};

		/**
	  * Show Axis Getter / Setter
	  *
	  * @param {Boolean} _v - Show axis true / false.
	  * @returns {*}
	  */
		my.showAxis = function (_v) {
			if (!arguments.length) return showAxis;
			showAxis = _v;
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
		var classed = "punchCard";
		var width = 700;
		var height = 400;
		var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
		var margin = { top: 40, right: 40, bottom: 40, left: 40 };
		var transition = { ease: d3.easeBounce, duration: 0 };
		var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

		/* Other Customisation Options */
		var minRadius = 2;
		var maxRadius = 20;
		var useGlobalScale = true;
		var opacity = 1;
		var showAxis = true;

		/**
	  * Constructor
	  *
	  * @constructor
	  * @alias punchCard
	  * @param {d3.selection} selection - The chart holder D3 selection.
	  */
		function my(selection) {
			selection.each(function (data) {
				// Set up margins and dimensions for the chart
				var legendW = 120;
				var legendPad = 15;
				var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
				var chartH = Math.max(height - margin.top - margin.bottom, 100);
				var legendH = Math.max(chartH / 2, 100);

				var _dataTransform$summar = dataTransform(data).summary(),
				    rowKeys = _dataTransform$summar.rowKeys,
				    columnKeys = _dataTransform$summar.columnKeys,
				    valueExtent = _dataTransform$summar.valueExtent;

				var xScale = d3.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.05);

				var yScale = d3.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.05);

				var colorScale = d3.scaleLinear().domain(valueExtent).range(colors);

				var sizeExtent = useGlobalScale ? valueExtent : [0, d3.max(data[1].values, function (d) {
					return d.value;
				})];

				var sizeScale = d3.scaleLinear().domain(sizeExtent).range([minRadius, maxRadius]);

				// Create SVG element (if it does not exist already)
				var svg = function (selection) {
					var el = selection._groups[0][0];
					if (!!el.ownerSVGElement || el.tagName === "svg") {
						return selection;
					} else {
						return selection.append("svg");
					}
				}(selection);

				svg.classed("d3ez", true).attr("width", width).attr("height", height);

				// Update the chart dimensions and add layer groups
				var container = svg.selectAll(".container").data([data]);

				container.exit().remove();

				// Chart Container
				var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);

				// Update the chart dimensions and add layer groups
				var layers = ["chart", "xAxis", "yAxis", "legend"];
				containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
					return d;
				});

				// Proportional Area Circle Component
				var proportionalAreaCircles = component.proportionalAreaCircles().xScale(xScale).yScale(yScale).colorScale(colorScale).sizeScale(sizeScale).dispatch(dispatch).opacity(opacity);

				// Series Group
				var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(data);

				seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
					return "translate(0, " + yScale(d.key) + ")";
				}).call(proportionalAreaCircles);

				seriesGroup.exit().transition().ease(transition.ease).duration(transition.duration).remove();

				// X-Axis
				var xAxis = d3.axisTop(xScale);

				containerEnter.select(".xAxis").classed("axis", true).call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

				// Y-Axis
				var yAxis = d3.axisLeft(yScale);

				containerEnter.select(".yAxis").classed("axis", true).call(yAxis);

				containerEnter.selectAll(".axis").attr('opacity', showAxis ? 1 : 0);

				// Legend
				var legend = component.legend().sizeScale(sizeScale).height(legendH).width(legendW).opacity(opacity);

				containerEnter.select(".legend").attr("transform", "translate(" + (chartW + legendPad) + ", 0)").call(legend);
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
	  * Opacity Getter / Setter
	  *
	  * @param {Number} _v - Opacity level.
	  * @returns {*}
	  */
		my.opacity = function (_v) {
			if (!arguments.length) return opacity;
			opacity = _v;
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
	  * Show Axis Getter / Setter
	  *
	  * @param {Boolean} _v - Show axis true / false.
	  * @returns {*}
	  */
		my.showAxis = function (_v) {
			if (!arguments.length) return showAxis;
			showAxis = _v;
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

	//import chartBarChartCircular from "./chart/barChartCircular";
	//import chartRadarChart from "./chart/radarChart";
	//import chartRoseChart from "./chart/roseChart";


	var chart = {
		//barChartCircular: chartBarChartCircular,
		barChart: chartBarChart,
		//barChartHorizontal: chartBarChartHorizontal,
		bubbleChart: chartBubbleChart,
		candlestickChart: chartCandlestickChart,
		donutChart: chartDonutChart,
		//ganttChart: chartGanttChart,
		//heatMapRadial: chartHeatMapRadial,
		heatMap: chartHeatMap,
		lineChart: chartLineChart,
		//polarAreaChart: chartPolarAreaChart,
		punchCard: chartPunchCard
		//radarChart: chartRadarChart,
		//roseChart: chartRoseChart
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
		return {
			version: version,
			author: author$1,
			copyright: copyright,
			license: license,
			chart: chart,
			component: component,
			palette: palette,
			dataTransform: dataTransform
			//base: base
		};
	}();

	return ez;

}));
