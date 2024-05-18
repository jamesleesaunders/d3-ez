/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2024 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.d3 = global.d3 || {}, global.d3.ez = factory(global.d3)));
})(this, (function (d3) { 'use strict';

	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n.default = e;
		return Object.freeze(n);
	}

	var d3__namespace = /*#__PURE__*/_interopNamespaceDefault(d3);

	var name = "d3-ez";
	var version$1 = "4.0.3";
	var description = "D3 Easy Reusable Chart Library";
	var license$1 = "GPL-2.0";
	var keywords = [
		"d3",
		"d3-module",
		"visualization",
		"chart",
		"graph",
		"data",
		"svg",
		"dataviz"
	];
	var homepage = "http://d3-ez.net";
	var author$1 = "James Saunders (james@saunders-family.net)";
	var repository = {
		type: "git",
		url: "https://github.com/jamesleesaunders/d3-ez.git"
	};
	var bugs = {
		url: "https://github.com/jamesleesaunders/d3-ez/issues"
	};
	var type = "module";
	var files = [
		"dist/**/*.js",
		"src/**/*.js"
	];
	var module = "src/index.js";
	var main = "src/index.js";
	var jsdelivr = "dist/d3-ez.min.js";
	var unpkg = "dist/d3-ez.min.js";
	var exports$1 = {
		umd: "./dist/d3-ez.min.js",
		"default": "./src/index.js"
	};
	var scripts = {
		build: "make",
		pretest: "make",
		test: "tape 'test/**/*Test.js' | tap-arc",
		"build:docs": "jsdoc -c config/jsdoc.conf.json",
		"deploy:docs": "npm run build:docs && gh-pages -d docs"
	};
	var devDependencies = {
		"@babel/core": "^7.24.5",
		"@babel/plugin-external-helpers": "^7.24.1",
		"@babel/plugin-transform-object-assign": "^7.24.1",
		"@babel/plugin-syntax-import-attributes": "^7.24.1",
		"@babel/preset-env": "^7.24.5",
		"@rollup/plugin-babel": "^6.0.4",
		"@rollup/plugin-json": "^6.1.0",
		"@rollup/plugin-node-resolve": "^15.2.3",
		eslint: "^9.3.0",
		"gh-pages": "^6.1.1",
		jsdoc: "^4.0.3",
		jsdom: "^24.0.0",
		rollup: "^4.17.2",
		"tap-arc": "^1.2.2",
		tape: "^5.7.5",
		"toast-jsdoc": "^1.0.2",
		"uglify-js": "^3.17.4",
		vows: "^0.8.3"
	};
	var dependencies = {
		d3: "^7.9.0"
	};
	var peerDependencies = {
		d3: "^7.9.0"
	};
	var packageJson = {
		name: name,
		version: version$1,
		description: description,
		license: license$1,
		keywords: keywords,
		homepage: homepage,
		author: author$1,
		repository: repository,
		bugs: bugs,
		type: type,
		files: files,
		module: module,
		main: main,
		jsdelivr: jsdelivr,
		unpkg: unpkg,
		exports: exports$1,
		scripts: scripts,
		devDependencies: devDependencies,
		dependencies: dependencies,
		peerDependencies: peerDependencies
	};

	/**
	 * Reusable Circular Bar Chart Component
	 *
	 * @module
	 */
	function componentBarsCircular () {
	  /* Default Properties */
	  var classed = "barsCircular";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barsCircular
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var startAngle = d3__namespace.min(yScale.range());

	      // Arc Generator
	      var arc = d3__namespace.arc().startAngle(startAngle * Math.PI / 180).endAngle(function (d) {
	        return yScale(d.value) * Math.PI / 180;
	      }).outerRadius(function (d) {
	        return xScale(d.key) + xScale.bandwidth();
	      }).innerRadius(function (d) {
	        return xScale(d.key);
	      }).cornerRadius(cornerRadius);

	      // Arc Tween
	      var arcTween = function arcTween(d, j) {
	        this._current || (this._current = {
	          key: d.key,
	          value: 0
	        });
	        var i = d3__namespace.interpolate(this._current, d);
	        this._current = i(0);
	        return function (t) {
	          return arc(i(t));
	        };
	      };

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add bars to series
	      var bars = componentGroup.selectAll(".bar").data(function (d) {
	        return d.values;
	      });
	      bars.enter().append("path").classed("bar", true).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("d", arc).attrTween("d", arcTween).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.key);
	      }).attr("stroke-width", "1px");
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
	   * On Event Getter
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
	  var classed = "bars";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barsHorizontal
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add bars to series
	      var bars = componentGroup.selectAll(".bar").data(function (d) {
	        return d.values;
	      });
	      bars.enter().append("rect").classed("bar", true).attr("stroke-width", "1px").attr("rx", cornerRadius).attr("ry", cornerRadius).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("x", 0).attr("y", function (d) {
	        return yScale(d.key);
	      }).attr("height", yScale.bandwidth()).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.key);
	      }).attr("width", yScale.bandwidth()).attr("y", function (d) {
	        return yScale(d.key);
	      }).attr("height", yScale.bandwidth()).attr("width", function (d) {
	        return xScale(d.value);
	      });
	      bars.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
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
	   * On Event Getter
	   *
	   * @returns {*}
	   */
	  my.on = function () {
	    var value = dispatch.on.apply(dispatch, arguments);
	    return value === dispatch ? my : value;
	  };
	  return my;
	}

	function _iterableToArrayLimit(r, l) {
	  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	  if (null != t) {
	    var e,
	      n,
	      i,
	      u,
	      a = [],
	      f = !0,
	      o = !1;
	    try {
	      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
	    } catch (r) {
	      o = !0, n = r;
	    } finally {
	      try {
	        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
	      } finally {
	        if (o) throw n;
	      }
	    }
	    return a;
	  }
	}
	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}
	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}
	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}
	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}
	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	/**
	 * Reusable Vertical Bar Chart Component
	 *
	 * @module
	 */
	function componentBarsVertical () {
	  /* Default Properties */
	  var classed = "bars";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

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
	      var _d3$extent = d3__namespace.extent(yScale.domain()),
	        _d3$extent2 = _slicedToArray(_d3$extent, 2),
	        valueMin = _d3$extent2[0],
	        valueMax = _d3$extent2[1];
	      var height = d3__namespace.max(yScale.range());

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add bars to series group
	      var bars = componentGroup.selectAll(".bar").data(function (d) {
	        return d.values;
	      });
	      bars.enter().append("rect").classed("bar", true).attr("stroke-width", "1px").attr("rx", cornerRadius).attr("ry", cornerRadius).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("height", 0).attr("width", xScale.bandwidth()).attr("x", function (d) {
	        return xScale(d.key);
	      }).attr("y", height).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
	        return xScale(d.key);
	      }).attr("y", function (d) {
	        return d.value < 0 ? yScale(0) : yScale(d.value);
	      }).attr("width", xScale.bandwidth()).attr("height", function (d) {
	        return d.value < 0 ? yScale(d.value + valueMax) : height - yScale(d.value + valueMin);
	      }).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.key);
	      });
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
	   * On Event Getter
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
	 * Reusable Vertical Stacked Bar Chart Component
	 *
	 * @module
	 */
	function componentBarsVerticalStacked () {
	  /* Default Properties */
	  var classed = "bars";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barsVerticalStacked
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var height = d3__namespace.max(yScale.range());
	      var width = xScale.bandwidth();
	      var _d3$extent = d3__namespace.extent(yScale.domain()),
	        _d3$extent2 = _slicedToArray(_d3$extent, 2),
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
	            yn1 = yn1 + d.value;
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
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add bars to series group
	      var bars = componentGroup.selectAll(".bar").data(function (d) {
	        return stacker(d.values);
	      });
	      bars.enter().append("rect").classed("bar", true).attr("stroke-width", "1px").attr("rx", cornerRadius).attr("ry", cornerRadius).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("height", 0).attr("width", xScale.bandwidth()).attr("x", 0).attr("y", height).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", 0).attr("y", function (d) {
	        return yScale(d.y1);
	      }).attr("width", width).attr("height", function (d) {
	        var padding = 3;
	        return (d.value < 0 ? yScale(d.value + valueMax) : height - yScale(d.value + valueMin)) - padding;
	      }).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.key);
	      });
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
	   * On Event Getter
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
	  var classed = "labeledNode";
	  var color = "steelblue";
	  var opacity = 1;
	  var strokeColor = "#000000";
	  var strokeWidth = 1;
	  var radius = 8;
	  var label;
	  var display = "block";
	  var fontSize = 10;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick");

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
	      var circle = d3__namespace.select(this).classed(classed, true).selectAll("circle").data([data]);
	      circle.enter().append("circle").merge(circle).transition().ease(transition.ease).duration(transition.duration).attr("r", function (d) {
	        return sizeAccessor(d);
	      }).attr("fill-opacity", opacity).style("stroke", color).style("stroke-width", strokeWidth).style("fill", color);
	      var text = d3__namespace.select(this).classed(classed, true).selectAll("text").data([data]);
	      text.enter().append("text").merge(text).attr("fill", "currentColor").attr("alignment-baseline", "middle").style("text-anchor", "end").transition().ease(transition.ease).duration(transition.duration).text(label).attr("dx", -r).attr("dy", -r).style("display", display).style("font-size", fontSize + "px");
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
	   * On Event Getter
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
	 * Reusable Bubble Plot Component
	 *
	 * @module
	 */
	function componentBubbles () {
	  /* Default Properties */
	  var classed = "bubbles";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var sizeScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
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
	      d3__namespace.max(yScale.range());

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add bubbles to series group
	      var bubble = componentLabeledNode().radius(function (d) {
	        return sizeScale(d.value);
	      }).color(colorScale(data.key)).label(function (d) {
	        return d.key;
	      }).display("none").opacity(opacity).stroke(1, "white").transition(transition).dispatch(dispatch);
	      var bubbles = componentGroup.selectAll(".bubble").data(function (d) {
	        return d.values;
	      });
	      bubbles.enter().append("g").classed("bubble", true).on("mouseover", function (e, d) {
	        d3__namespace.select(this).select("text").style("display", "block");
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("mouseout", function () {
	        d3__namespace.select(this).select("text").style("display", "none");
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("transform", function (d) {
	        return "translate(".concat(xScale(d.x), ",").concat(yScale(d.y), ")");
	      }).merge(bubbles).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
	        return "translate(".concat(xScale(d.x), ",").concat(yScale(d.y), ")");
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
	   * On Event Getter
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
	  var classed = "candleSticks";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var candleWidth = 8;
	  var opacity = 1;
	  var cornerRadius = 2;

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
	      var line = d3__namespace.line().x(function (d) {
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
	          return line([{
	            x: xScale(d.date),
	            y: yScale(d.high)
	          }, {
	            x: xScale(d.date),
	            y: yScale(d.low)
	          }]);
	        });
	        return bars;
	      };

	      // Open Close Bars
	      var openCloseBars = function openCloseBars(candle) {
	        var rect = candle.selectAll(".open-close-bar").data(function (d) {
	          return [d];
	        });
	        rect.enter().append("rect").classed("open-close-bar", true).attr("x", function (d) {
	          return xScale(d.date) - candleWidth / 2;
	        }).attr("y", function (d) {
	          var isUp = isUpDay(d);
	          var base = isUp ? yScale(d.close) : yScale(d.open);
	          var difference = isUp ? yScale(d.open) - yScale(d.close) : 0;
	          return base + difference;
	        }).attr("width", candleWidth).attr("rx", cornerRadius).attr("ry", cornerRadius).merge(rect).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
	          return xScale(d.date) - candleWidth / 2;
	        }).attr("y", function (d) {
	          return isUpDay(d) ? yScale(d.close) : yScale(d.open);
	        }).attr("width", candleWidth).attr("height", function (d) {
	          return isUpDay(d) ? yScale(d.open) - yScale(d.close) : yScale(d.close) - yScale(d.open);
	        });
	        return candle;
	      };

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add candles to series group
	      var candles = componentGroup.selectAll(".candle").data(function (d) {
	        return d.values;
	      });
	      candles.enter().append("g").classed("candle", true).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(candles).attr("fill", function (d) {
	        return colorScale(isUpDay(d));
	      }).attr("stroke", function (d) {
	        return colorScale(isUpDay(d));
	      }).attr("fill-opacity", opacity).call(highLowLines)
	      // .call(openCloseTicks)
	      .call(openCloseBars);

	      // OR:
	      // highLowLines(candles);
	      // openCloseTicks(candles);
	      // openCloseBars(candles);

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
	   * On Event Getter
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
	  var classed = "circularAxis";
	  var radialScale;
	  var ringScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var showAxis = false;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias circularAxis
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var _ringScale$range = ringScale.range(),
	        _ringScale$range2 = _slicedToArray(_ringScale$range, 2);
	        _ringScale$range2[0];
	        var radius = _ringScale$range2[1];

	      // Create axis group
	      var axisSelect = d3__namespace.select(this).selectAll("g.".concat(classed)).data([0]);
	      var axis = axisSelect.enter().append("g").classed(classed, true).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(axisSelect);

	      // Outer circle
	      var outerCircle = axis.selectAll(".outerCircle").data([radius]);
	      outerCircle.enter().append("circle").classed("outerCircle", true).merge(outerCircle).transition().ease(transition.ease).duration(transition.duration).attr("r", function (d) {
	        return d;
	      }).style("fill", "none").attr("stroke-width", 2).attr("stroke", "currentColor");

	      // Tick Data Generator
	      var tickData = function tickData() {
	        var tickArray, tickPadding;
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
	      tickCircles.enter().append("circle").style("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 1).attr("stroke-dasharray", "1,1").attr("opacity", 0.5).merge(tickCircles).transition().ease(transition.ease).duration(transition.duration).attr("r", function (d) {
	        return d.radius + d.padding;
	      });
	      tickCircles.exit().remove();

	      // Spoke Data Generator
	      var spokeData = function spokeData() {
	        var spokeArray = [];
	        var spokeCount = 0;
	        if (typeof radialScale.ticks === "function") {
	          // scaleLinear
	          var min = d3__namespace.min(radialScale.domain());
	          var max = d3__namespace.max(radialScale.domain());
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
	        var spokeScale = d3__namespace.scaleLinear().domain([0, spokeCount]).range(radialScale.range());
	        return spokeArray.map(function (d, i) {
	          return {
	            value: d,
	            rotate: spokeScale(i)
	          };
	        });
	      };
	      var spokeGroup = axis.selectAll(".spokes").data(function () {
	        return [spokeData()];
	      });
	      var spokeGroupEnter = spokeGroup.enter().append("g").classed("spokes", true).merge(spokeGroup);
	      var spokes = spokeGroupEnter.selectAll("line").data(function (d) {
	        return d;
	      });
	      spokes.enter().append("line").attr("stroke", "currentColor").attr("stroke-width", 1).attr("stroke-dasharray", "2,2").attr("opacity", 0.5).merge(spokes).attr("transform", function (d) {
	        return "rotate(".concat(d.rotate, ")");
	      }).attr("y2", -radius);
	      spokes.exit().remove();
	      if (showAxis) {
	        var verticalAxis = d3__namespace.axisLeft(ringScale);
	        axis.call(verticalAxis);
	      }
	    });
	  }

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

	  /**
	   * Show Axis Labels
	   *
	   * @param {boolean} _v - True / False.
	   * @returns {*}
	   */
	  my.showAxis = function (_v) {
	    if (!arguments.length) return showAxis;
	    showAxis = _v;
	    return my;
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
	 * Reusable Circular Ring Labels Component
	 *
	 * @module
	 */
	function componentCircularRingLabels () {
	  /* Default Properties */
	  var classed = "circularRingLabels";
	  var radialScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var capitalizeLabels = false;
	  var textAnchor = "middle";

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias circularRingLabels
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var pathGen = function pathGen(d) {
	        var r = radialScale(d);
	        var arc = d3__namespace.arc().outerRadius(r).innerRadius(r);
	        var pathConf = {
	          startAngle: 0 * Math.PI / 180,
	          endAngle: 360 * Math.PI / 180
	        };
	        var pathStr = arc(pathConf).split(/[A-Z]/);
	        return "M" + pathStr[1] + "A" + pathStr[2];
	      };
	      var element = d3__namespace.select(this);
	      var uId = "uid-" + Math.floor(1000 + Math.random() * 9000);
	      var labels = element.selectAll("g.".concat(classed)).data([0]);
	      var labelsEnter = labels.enter().append("g").classed(classed, true).merge(labels);
	      var radData = radialScale.domain();
	      var def = labelsEnter.selectAll("def").data(radData);
	      def.enter().append("def").append("path").attr("id", function (d, i) {
	        return "".concat(uId, "-path-").concat(i);
	      }).attr("d", function (d) {
	        return pathGen(d);
	      }).merge(def).transition().ease(transition.ease).duration(transition.duration).select("path").attr("d", function (d) {
	        return pathGen(d);
	      }).attr("id", function (d, i) {
	        return "".concat(uId, "-path-").concat(i);
	      });
	      var text = labelsEnter.selectAll("text").data(radData);
	      text.enter().append("text").style("text-anchor", "start").attr("dy", -2).attr("dx", 5).append("textPath").attr("xlink:href", function (d, i) {
	        return "#".concat(uId, "-path-").concat(i);
	      }).attr("startOffset", "0%").attr("font-size", function (d) {
	        var fontPx = radialScale.bandwidth() * 0.5;
	        return "".concat(fontPx, "px");
	      }).text(function (d) {
	        return d;
	      }).merge(text).transition().ease(transition.ease).duration(transition.duration).select("textPath").attr("font-size", function (d) {
	        var fontPx = radialScale.bandwidth() * 0.5;
	        return "".concat(fontPx, "px");
	      }).attr("xlink:href", function (d, i) {
	        return "#".concat(uId, "-path-").concat(i);
	      });
	      text.exit().remove();
	    });
	  }

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
	 * Reusable Circular Sector Labels Component
	 *
	 * @module
	 */
	function componentCircularSectorLabels () {
	  /* Default Properties */
	  var classed = "circularSectorLabels";
	  var radialScale;
	  var ringScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var capitalizeLabels = false;
	  var textAnchor = "middle";

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias circularSectorLabels
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      textAnchor = "start"; // FIXME: Temporarily forcing labels to start as they get chopped off with 'middle'.

	      var _ringScale$range = ringScale.range(),
	        _ringScale$range2 = _slicedToArray(_ringScale$range, 2);
	        _ringScale$range2[0];
	        var radius = _ringScale$range2[1];

	      // Tick Data Generator
	      var tickData = function tickData() {
	        var tickCount = 0;
	        var tickArray = [];
	        if (typeof radialScale.ticks === "function") {
	          // scaleLinear
	          var min = d3__namespace.min(radialScale.domain());
	          var max = d3__namespace.max(radialScale.domain());
	          tickCount = radialScale.ticks().length;
	          var tickIncrement = (max - min) / tickCount;
	          for (var i = 0; i <= tickCount; i++) {
	            tickArray[i] = (tickIncrement * i).toFixed(0);
	          }
	        } else {
	          // scaleBand / scalePoint
	          tickArray = radialScale.domain();
	          tickCount = tickArray.length;
	        }
	        var tickScale = d3__namespace.scaleLinear().domain([0, tickCount]).range(radialScale.range());
	        return tickArray.map(function (d, i) {
	          return {
	            value: d,
	            offset: tickScale(i) / 360 * 100
	          };
	        });
	      };
	      var element = d3__namespace.select(this);

	      // Unique id so that the text path defs are unique - is there a better way to do this?
	      var uId = "uid-" + Math.floor(1000 + Math.random() * 9000);
	      var labels = element.selectAll("g.".concat(classed)).data(function () {
	        return [tickData()];
	      });
	      var labelsEnter = labels.enter().append("g").classed(classed, true).attr("transform", function () {
	        var offset = typeof radialScale.ticks !== "function" ? radialScale.bandwidth() / 2 : 0;
	        return "rotate(".concat(offset, ")");
	      }).merge(labels);

	      // Labels
	      var def = labelsEnter.selectAll("def").data([radius]);
	      def.enter().append("def").append("path").attr("id", function () {
	        return "".concat(uId, "-path");
	      }).attr("d", function (d) {
	        // Add a little padding
	        var r = d * 1.04;
	        return "m0 " + -r + " a" + r + " " + r + " 0 1,1 -0.01 0";
	      }).merge(def).transition().ease(transition.ease).duration(transition.duration).select("path").attr("id", function () {
	        return "".concat(uId, "-path");
	      }).attr("d", function (d) {
	        // Add a little padding
	        var r = d * 1.04;
	        return "m0 " + -r + " a" + r + " " + r + " 0 1,1 -0.01 0";
	      });
	      def.exit().remove();
	      var text = labelsEnter.selectAll(".label").data(function (d) {
	        return d;
	      });
	      text.enter().append("text").classed("label", true).attr("font-size", "0.9em").attr("color", "currentColor").style("text-anchor", textAnchor).append("textPath").attr("xlink:href", function () {
	        return "#".concat(uId, "-path");
	      }).text(function (d) {
	        var text = d.value;
	        return capitalizeLabels ? text.toUpperCase() : text;
	      }).attr("startOffset", function (d) {
	        return d.offset + "%";
	      }).attr("fill", "currentColor").merge(text).transition().ease(transition.ease).duration(transition.duration).select("textPath").text(function (d) {
	        var text = d.value;
	        return capitalizeLabels ? text.toUpperCase() : text;
	      }).attr("xlink:href", function () {
	        return "#".concat(uId, "-path");
	      }).attr("startOffset", function (d) {
	        return d.offset + "%";
	      }).attr("id", function (d) {
	        return d.value;
	      });
	      text.exit().remove();
	    });
	  }

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
	 * Reusable Donut Chart Component
	 *
	 * @module
	 */
	function componentDonut () {
	  /* Default Properties */
	  var classed = "donut";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias donut
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var _xScale$range = xScale.range(),
	        _xScale$range2 = _slicedToArray(_xScale$range, 2),
	        innerRadius = _xScale$range2[0],
	        radius = _xScale$range2[1];
	      var _yScale$range = yScale.range(),
	        _yScale$range2 = _slicedToArray(_yScale$range, 2),
	        startAngle = _yScale$range2[0],
	        endAngle = _yScale$range2[1];

	      // Pie Generator
	      var pie = d3__namespace.pie().startAngle(startAngle * Math.PI / 180).endAngle(endAngle * Math.PI / 180).value(function (d) {
	        return d.value;
	      }).sort(null).padAngle(0.015);

	      // Arc Generator
	      var arc = d3__namespace.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(cornerRadius);

	      // Arc Tween
	      var arcTween = function arcTween(d) {
	        var i = d3__namespace.interpolate(d.startAngle, d.endAngle);
	        return function (t) {
	          d.endAngle = i(t);
	          return arc(d);
	        };
	      };

	      // Update Series Group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add Donut Slices
	      var slices = componentGroup.selectAll("path.slice").data(function (d) {
	        return pie(d.values);
	      });
	      slices.enter().append("path").attr("class", "slice").on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(slices).transition().duration(transition.duration).ease(transition.ease).attr("d", arc).attrTween("d", arcTween).attr("fill", function (d) {
	        return colorScale(d.data.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.data.key);
	      }).attr("stroke-width", "1px");
	      slices.exit().remove();
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
	   * @param {Number} _v - Opacity level.
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
	   * On Event Getter
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
	 * Reusable Donut Chart Labels Component
	 *
	 * @module
	 */
	function componentDonutLabels () {
	  /* Default Properties */
	  var classed = "donutLabels";
	  var xScale;
	  var yScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias donutLabels
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var _xScale$range = xScale.range(),
	        _xScale$range2 = _slicedToArray(_xScale$range, 2),
	        innerRadius = _xScale$range2[0],
	        radius = _xScale$range2[1];
	      var _yScale$range = yScale.range(),
	        _yScale$range2 = _slicedToArray(_yScale$range, 2),
	        startAngle = _yScale$range2[0],
	        endAngle = _yScale$range2[1];

	      // Pie Generator
	      var pie = d3__namespace.pie().startAngle(startAngle * Math.PI / 180).endAngle(endAngle * Math.PI / 180).value(function (d) {
	        return d.value;
	      }).sort(null).padAngle(0.015);

	      // Arc Generator
	      var arc = d3__namespace.arc().innerRadius(innerRadius).outerRadius(radius);

	      // Outer Arc Generator
	      var outerArc = d3__namespace.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

	      // Mid Angle
	      var midAngle = function midAngle(d) {
	        return d.startAngle + (d.endAngle - d.startAngle) / 2;
	      };

	      // Update Series Group
	      var seriesGroup = d3__namespace.select(this);

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Text Labels
	      var labelsGroup = componentGroup.selectAll("g.labels").data(function (d) {
	        return [d];
	      });
	      var labelsGroupEnter = labelsGroup.enter().append("g").attr("class", "labels").merge(labelsGroup);
	      var labels = labelsGroupEnter.selectAll("text.label").data(function (d) {
	        return pie(d.values);
	      });
	      labels.enter().append("text").attr("class", "label").attr("font-size", "0.9em").attr("dy", ".35em").attr("fill", "currentColor").merge(labels).transition().duration(transition.duration).text(function (d) {
	        return d.data.key;
	      }).attrTween("transform", function (d) {
	        this._current = this._current || d;
	        var interpolate = d3__namespace.interpolate(this._current, d);
	        this._current = interpolate(0);
	        return function (t) {
	          var d2 = interpolate(t);
	          var pos = outerArc.centroid(d2);
	          pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
	          return "translate(".concat(pos, ")");
	        };
	      }).styleTween("text-anchor", function (d) {
	        this._current = this._current || d;
	        var interpolate = d3__namespace.interpolate(this._current, d);
	        this._current = interpolate(0);
	        return function (t) {
	          var d2 = interpolate(t);
	          return midAngle(d2) < Math.PI ? "start" : "end";
	        };
	      });
	      labels.exit().remove();

	      // Label to Slice Connectors
	      var connectorsGroupSelect = componentGroup.selectAll("g.connectors").data(function (d) {
	        return [d];
	      });
	      var connectorsGroup = connectorsGroupSelect.enter().append("g").attr("class", "connectors").merge(connectorsGroupSelect);
	      var connectors = connectorsGroup.selectAll("polyline.connector").data(function (d) {
	        return pie(d.values);
	      });
	      connectors.enter().append("polyline").attr("class", "connector").attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", "1.5px").merge(connectors).transition().duration(transition.duration).attrTween("points", function (d) {
	        this._current = this._current || d;
	        var interpolate = d3__namespace.interpolate(this._current, d);
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
	 * Reusable Heat Map Ring Component
	 *
	 * @module
	 */
	function componentHeatMapRing () {
	  /* Default Properties */
	  var classed = "heatMapRing";
	  var colorScale;
	  var xScale;
	  var yScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias heatMapRing
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function (data) {
	      var innerRadius = yScale(data.key);
	      var radius = yScale(data.key) + yScale.bandwidth();
	      var _xScale$range = xScale.range(),
	        _xScale$range2 = _slicedToArray(_xScale$range, 2),
	        startAngle = _xScale$range2[0],
	        endAngle = _xScale$range2[1];

	      // Pie Generator
	      var pie = d3__namespace.pie().value(1).sort(null).startAngle(startAngle * (Math.PI / 180)).endAngle(endAngle * (Math.PI / 180)).padAngle(0.015);

	      // Arc Generator
	      var arc = d3__namespace.arc().outerRadius(radius).innerRadius(innerRadius).cornerRadius(cornerRadius);

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add segments to series group
	      var segments = componentGroup.selectAll(".segment").data(function (d) {
	        var key = d.key;
	        var data = pie(d.values);
	        data.forEach(function (d, i) {
	          data[i].key = key;
	        });
	        return data;
	      });
	      segments.enter().append("path").classed("segment", true).attr("d", arc).attr("stroke-width", "1px").on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d.data);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d.data);
	      }).merge(segments).transition().duration(transition.duration).attr("fill", function (d) {
	        return colorScale(d.data.value);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.data.value);
	      }).attr("d", arc);
	      segments.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
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
	   * @param {Number} _v - Opacity level.
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
	   * On Event Getter
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
	  var classed = "heatMapRow";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

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
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add cells to series group
	      var cells = componentGroup.selectAll(".cell").data(function (d) {
	        var seriesName = d.key;
	        var seriesValues = d.values;
	        return seriesValues.map(function (el) {
	          var o = Object.assign({}, el);
	          o.series = seriesName;
	          return o;
	        });
	      });
	      cells.enter().append("rect").attr("class", "cell").attr("stroke-width", "1px").attr("rx", cornerRadius).attr("ry", cornerRadius).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("x", function (d) {
	        return xScale(d.key);
	      }).attr("y", 0).attr("width", cellWidth).attr("height", cellHeight).merge(cells).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
	        return xScale(d.key);
	      }).attr("width", cellWidth).attr("height", cellHeight).attr("fill", function (d) {
	        return colorScale(d.value);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.value);
	      });
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
	   * On Event Getter
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
	  /* Default Properties */
	  var classed = "htmlList";
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias htmlList
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var list = d3__namespace.select(this).selectAll("ul").data(function (d) {
	        return [d];
	      });
	      var listEnter = list.enter().append("ul").classed(classed, true).merge(list);
	      var seriesGroup = listEnter.selectAll("li").data(function (d) {
	        return d;
	      });
	      seriesGroup.exit().remove();
	      seriesGroup.enter().append("li").text(function (d) {
	        return d.key;
	      }).on("click", expand).merge(seriesGroup).transition().text(function (d) {
	        return d.key;
	      });
	      function expand(e, d) {
	        e.stopPropagation();
	        dispatch.call("customValueMouseOver", this, e, d);
	        if (typeof d.values === "undefined") {
	          return 0;
	        }
	        var ul = d3__namespace.select(this).on("click", collapse).append("ul");
	        var li = ul.selectAll("li").data(d.values);
	        li.exit().remove();
	        li.enter().append("li").text(function (d) {
	          if (typeof d.value !== "undefined") {
	            return d.key + " : " + d.value;
	          } else {
	            return d.key;
	          }
	        }).on("click", expand);
	      }
	      function collapse(e, d) {
	        e.stopPropagation();
	        d3__namespace.select(this).on("click", expand).selectAll("*").remove();
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
	   * On Event Getter
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
	 * Data Transform
	 *
	 * @module
	 * @returns {Array}
	 */
	function dataTransform(data) {
	  var SINGLE_SERIES = 1;
	  var MULTI_SERIES = 2;
	  var coordinateKeys = ["x", "y", "z"];

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
	      return d3__namespace.sum(data.values, function (d) {
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
	      return d3__namespace.min(Object.values(rowTotals));
	    }
	  }();

	  /**
	   * Row Totals Max
	   *
	   * @returns {number}
	   */
	  var rowTotalsMax = function () {
	    if (dataType === MULTI_SERIES) {
	      return d3__namespace.max(Object.values(rowTotals));
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
	      ret = Array.from(new Set([].concat(tmp, _toConsumableArray(ret))));
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
	      return d3__namespace.min(Object.values(columnTotals));
	    }
	  }();

	  /**
	   * Column Totals Max
	   *
	   * @returns {Array}
	   */
	  var columnTotalsMax = function () {
	    if (dataType === MULTI_SERIES) {
	      return d3__namespace.max(Object.values(columnTotals));
	    }
	  }();

	  /**
	   * Value Min
	   *
	   * @returns {number}
	   */
	  var valueMin = function () {
	    if (dataType === SINGLE_SERIES) {
	      return d3__namespace.min(data.values, function (d) {
	        return +d.value;
	      });
	    }
	    var ret;
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
	    var ret;
	    if (dataType === SINGLE_SERIES) {
	      ret = Math.max.apply(Math, _toConsumableArray(data.values.map(function (d) {
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
	          _row$values$reduce2 = _slicedToArray(_row$values$reduce, 2),
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
	        ret[key] = Math.min.apply(Math, _toConsumableArray(data.values.map(function (d) {
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
	        ret[key] = Math.max.apply(Math, _toConsumableArray(data.values.map(function (d) {
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
	    (match[1] ? match[1].length : 0
	    // Adjust for scientific notation.
	    ) - (match[2] ? +match[2] : 0));
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
	        var values = Object.assign({}, data[columnIndex].values[rowIndex]);
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
	 * Simple HTML Table
	 *
	 * @module
	 */
	function componentHtmlTable () {
	  /* Default Properties */
	  var classed = "htmlTable";
	  var width = 800;
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

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
	      var table = d3__namespace.select(this).selectAll("table").data(function (d) {
	        return [d];
	      });
	      var tableEnter = table.enter().append("table").classed("d3ez", true).classed(classed, true).attr("width", width).merge(table);
	      tableEnter.append("thead");
	      tableEnter.append("tfoot");
	      tableEnter.append("tbody");

	      // Add table headings
	      var head = tableEnter.select("thead").selectAll("tr").data([columnKeys]);
	      head.exit().remove();
	      var headEnter = head.enter().append("tr").merge(head);
	      var th = headEnter.selectAll("th").data(function (d) {
	        // Tack a blank cell at the beginning this is the empty 'A1' cell.
	        d.unshift("");
	        return d;
	      });
	      th.exit().remove();
	      th.enter().append("th").merge(th).html(function (d) {
	        return d;
	      });

	      // Add table body
	      var body = tableEnter.select("tbody").selectAll("tr").data(data);
	      body.exit().remove();
	      var bodyEnter = body.enter().append("tr").attr("class", function (d) {
	        return d.key;
	      }).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      }).merge(body);

	      // Add the main data values
	      var td = bodyEnter.selectAll("td").data(function (d) {
	        // Add key name to first column.
	        d.values.unshift({
	          key: d.key,
	          value: d.key
	        });
	        return d.values;
	      });
	      td.exit().remove();
	      td.enter().append("td").on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(td).html(function (d) {
	        return d.value;
	      });
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
	   * On Event Getter
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
	  var sizeScale;
	  var itemCount = 4;
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };

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
	      var domainMin = parseFloat(d3__namespace.min(sizeScale.domain()));
	      var domainMax = parseFloat(d3__namespace.max(sizeScale.domain()));
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
	      var yScale = d3__namespace.scaleLinear().domain(yDomain).range(yRange);

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
	      return "translate(0,".concat(d.y, ")");
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
	      return "translate(0,".concat(d.y, ")");
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
	function componentLegendCategorical () {
	  /* Default Properties */
	  var width = 100;
	  var height = 150;
	  var colorScale;
	  var itemCount;
	  var itemType = "rect";
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var cornerRadius = 2;

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
	      return "translate(0,".concat(d.y, ")");
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
	        }).attr("stroke-width", 2);
	        items.transition().ease(transition.ease).duration(transition.duration).select("line").attr("x1", 0).attr("y1", function (d) {
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
	        itemsEnter.append("rect").attr("rx", cornerRadius).attr("ry", cornerRadius).attr("width", function (d) {
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
	      return "translate(0,".concat(d.y, ")");
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
	  var thresholdScale;
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };

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
	    var domainMin = d3__namespace.min(thresholdScale.domain());
	    var domainMax = d3__namespace.max(thresholdScale.domain());
	    var domainMargin = (domainMax - domainMin) * 0.1;
	    var x = d3__namespace.scaleLinear().domain([domainMin - domainMargin, domainMax + domainMargin]).range([0, height]);

	    // Legend Container
	    var legendContainer = selection.selectAll(".legendContainer").data([0]);
	    var legendContainerEnter = legendContainer.enter().append("g").classed("legendContainer", true).attr("width", width).attr("height", height).merge(legendContainer);

	    // Use D3 Axis to generate scale ticks
	    var axis = d3__namespace.axisRight(x).tickSize(30).tickValues(thresholdScale.domain());
	    legendContainerEnter.transition().ease(transition.ease).duration(transition.duration).call(axis).selectAll(".domain").attr("opacity", 0);
	    var colors = legendContainerEnter.selectAll("rect").data(thresholdScale.range().map(function (color) {
	      var d = thresholdScale.invertExtent(color);
	      if (typeof d[0] === "undefined") d[0] = x.domain()[0];
	      if (typeof d[1] === "undefined") d[1] = x.domain()[1];
	      return d;
	    }));
	    colors.enter().append("rect").merge(colors).transition().ease(transition.ease).duration(transition.duration).attr("width", 20).attr("y", function (d) {
	      return x(d[0]);
	    }).attr("height", function (d) {
	      return x(d[1]) - x(d[0]);
	    }).style("fill", function (d) {
	      return thresholdScale(d[0]);
	    }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	      return thresholdScale(d[0]);
	    }).attr("stroke-width", 1);
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
	 * Reusable Legend Component
	 *
	 * @module
	 */
	function componentLegend () {
	  /* Default Properties */
	  var width = 100;
	  var height = 150;
	  var margin = {
	    top: 35,
	    right: 10,
	    bottom: 10,
	    left: 10
	  };
	  var sizeScale;
	  var colorScale;
	  var title = "Key";
	  var legend;
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
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

	    // Thereshold or Categorical Legend
	    if (typeof colorScale !== "undefined") {
	      if (scaleType(colorScale) === "threshold") {
	        legend = componentLegendThreshold().thresholdScale(colorScale);
	      } else {
	        legend = componentLegendCategorical().colorScale(colorScale).itemType(itemType);
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
	    legendBoxEnter.append("g").classed("legendTitle", true).attr("transform", "translate(10,10)").append("text").style("font-weight", "bold").attr("dominant-baseline", "hanging").attr("fill", "currentColor").text(title);

	    // Legend Component
	    legend.width(width - (margin.left + margin.right)).height(height - (margin.top + margin.bottom));

	    // Legend Items
	    legendBoxEnter.append("g").classed("legendBox", true).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).call(legend);
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

	/**
	 * Reusable Line Chart Component
	 *
	 * @module
	 */
	function componentLineChart () {
	  /* Default Properties */
	  var classed = "lineChart";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias lineChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      // Line animation tween
	      var line = d3__namespace.line().curve(d3__namespace.curveCardinal).x(function (d) {
	        return xScale(d.key);
	      }).y(function (d) {
	        return yScale(d.value);
	      });
	      var pathTween = function pathTween(d) {
	        var i = d3__namespace.interpolate(1, d.length + 1);
	        return function (t) {
	          return line(d.slice(0, i(t)));
	        };
	      };

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add lines to series group
	      var path = componentGroup.selectAll(".line").data(function (d) {
	        return [d];
	      });
	      path.enter().append("path").attr("class", "line").attr("stroke-width", 1.5).attr("fill", "none").attr("d", function (d) {
	        return line(d.values);
	      }).merge(path).transition().duration(transition.duration).attrTween("d", function (d) {
	        return pathTween(d.values);
	      }).attr("stroke", function (d) {
	        return colorScale(d.key);
	      }).attr("opacity", opacity);
	      path.exit().transition().style("opacity", 0).remove();
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
	   * On Event Getter
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
	  var classed = "numberCard";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
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
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add numbers to series
	      var numbers = componentGroup.selectAll(".number").data(function (d) {
	        return d.values;
	      });
	      numbers.enter().append("text").attr("class", "number").attr("text-anchor", "middle").attr("dominant-baseline", "central").on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
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
	   * On Event Getter
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
	  var classed = "polarArea";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias polarArea
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      var _xScale$range = xScale.range(),
	        _xScale$range2 = _slicedToArray(_xScale$range, 2),
	        startAngle = _xScale$range2[0],
	        endAngle = _xScale$range2[1];

	      // Pie Generator
	      var pie = d3__namespace.pie().value(1).sort(null).startAngle(startAngle * Math.PI / 180).endAngle(endAngle * Math.PI / 180).padAngle(0);

	      // Arc Generator
	      var arc = d3__namespace.arc().outerRadius(function (d) {
	        return yScale(d.data.value);
	      }).innerRadius(0).cornerRadius(cornerRadius);

	      // Arc Tween
	      var arcTween = function arcTween(d) {
	        var i = d3__namespace.interpolate(0, d.data.value);
	        return function (t) {
	          d.data.value = i(t);
	          return arc(d);
	        };
	      };

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add segments to series
	      var segments = componentGroup.selectAll(".segment").data(function (d) {
	        return pie(d.values);
	      });
	      segments.enter().append("path").classed("segment", true).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d.data);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d.data);
	      }).merge(segments).transition().ease(transition.ease).duration(transition.duration).attr("d", arc).attrTween("d", arcTween).style("fill", function (d) {
	        return colorScale(d.data.key);
	      }).attr("fill-opacity", opacity).attr("stroke", function (d) {
	        return colorScale(d.data.key);
	      }).attr("stroke-width", "1px");
	      segments.exit().transition().style("opacity", 0).remove();
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
	   * @param {Number} _v - Opacity level.
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
	   * On Event Getter
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
	  var classed = "proportionalAreaCircles";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var sizeScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
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
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add spots to series
	      var spot = componentLabeledNode().radius(function (d) {
	        return sizeScale(d.value);
	      }).color(function (d) {
	        return colorScale(d.value);
	      }).label(function (d) {
	        return d.value;
	      }).display("none").opacity(opacity).stroke(1, "currentColor").dispatch(dispatch).transition(transition);
	      var spots = componentGroup.selectAll(".punchSpot").data(function (d) {
	        return d.values;
	      });
	      spots.enter().append("g").classed("punchSpot", true).on("mouseover", function (e, d) {
	        d3__namespace.select(this).select("text").style("display", "block");
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("mouseout", function () {
	        d3__namespace.select(this).select("text").style("display", "none");
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).attr("transform", function (d) {
	        var x = cellWidth / 2 + xScale(d.key);
	        var y = cellHeight / 2;
	        return "translate(".concat(x, ",").concat(y, ")");
	      }).merge(spots).transition().ease(transition.ease).duration(transition.duration).attr("transform", function (d) {
	        var x = cellWidth / 2 + xScale(d.key);
	        var y = cellHeight / 2;
	        return "translate(".concat(x, ",").concat(y, ")");
	      }).call(spot);
	      spots.exit().transition().ease(transition.ease).duration(transition.duration).style("opacity", 0).remove();
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
	   * @param {d3.scale} _v - D3 color scale.
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
	   * On Event Getter
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
	 * Reusable Radar Area Component
	 *
	 * @module
	 */
	function componentRadarArea () {
	  /* Default Properties */
	  var classed = "radarArea";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var opacity = 1;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias radarArea
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function (data) {
	      // Slice calculation on circle
	      var angleSlice = Math.PI * 2 / data.values.length;

	      // Function to generate radar line points
	      var radarLine = d3__namespace.lineRadial().radius(function (d) {
	        return yScale(d.value);
	      }).angle(function (d, i) {
	        return i * angleSlice;
	      }).curve(d3__namespace.curveBasis).curve(d3__namespace.curveCardinalClosed);

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add radar path line
	      var path = componentGroup.selectAll("path").data(function (d) {
	        return [d];
	      });
	      path.enter().append("path").on("mouseover", function () {
	        d3__namespace.select(this).transition().duration(200).style("fill-opacity", opacity);
	      }).on("mouseout", function () {
	        d3__namespace.select(this).transition().duration(200).style("fill-opacity", opacity / 2);
	      }).merge(path).transition().ease(transition.ease).duration(transition.duration).style("fill-opacity", opacity / 2).attr("d", function (d) {
	        return radarLine(d.values);
	      });

	      // Add radar points
	      var dots = componentGroup.selectAll("circle").data(function (d) {
	        return d.values;
	      });
	      dots.enter().append("circle").attr("class", "radarCircle").attr("r", 4).style("fill-opacity", 0.8).merge(dots)
	      //.transition()
	      //.ease(transition.ease)
	      //.duration(transition.duration)
	      .attr("cx", function (d, i) {
	        return yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
	      }).attr("cy", function (d, i) {
	        return yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
	      });
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
	   * On Event Getter
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
	  var classed = "roseChartSector";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	  var stacked = false;
	  var opacity = 1;
	  var cornerRadius = 2;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias roseChartSector
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function (data) {
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
	      var startAngle = xScale(data.key);
	      var endAngle = xScale(data.key) + xScale.bandwidth();
	      var arc = d3__namespace.arc().innerRadius(function (d) {
	        return d.innerRadius;
	      }).outerRadius(function (d) {
	        return d.outerRadius;
	      }).startAngle(startAngle * (Math.PI / 180)).endAngle(endAngle * (Math.PI / 180)).cornerRadius(cornerRadius);

	      // Arc Tween
	      var arcTween = function arcTween(d) {
	        var i = d3__namespace.interpolate(d.innerRadius, d.outerRadius);
	        return function (t) {
	          d.outerRadius = i(t);
	          return arc(d);
	        };
	      };

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);

	      // Add arcs to series group
	      var arcs = componentGroup.selectAll(".arc").data(function (d) {
	        return stacker(d.values);
	      });
	      arcs.enter().append("path").classed("arc", true).attr("stroke-width", "1px").on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
	      }).merge(arcs).transition().ease(transition.ease).duration(transition.duration).attr("d", arc).attrTween("d", arcTween).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).attr("stroke", function (d) {
	        return colorScale(d.key);
	      }).attr("fill-opacity", opacity);
	      arcs.exit().transition().style("opacity", 0).remove();
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
	   * On Event Getter
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
	  var classed = "scatterPlot";
	  var xScale;
	  var yScale;
	  var colorScale;
	  var opacity = 1;
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias scatterPlot
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    selection.each(function () {
	      d3__namespace.max(yScale.range());

	      // Update series group
	      var seriesGroup = d3__namespace.select(this).on("mouseover", function (e, d) {
	        dispatch.call("customSeriesMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customSeriesClick", this, e, d);
	      });

	      // Add Component Level Group
	      var componentGroup = seriesGroup.selectAll("g.".concat(classed)).data(function (d) {
	        return [d];
	      }).enter().append("g").classed(classed, true).merge(seriesGroup);
	      var dots = componentGroup.attr("fill", function (d) {
	        return colorScale(d.key);
	      }).selectAll(".dot").data(function (d) {
	        return d.values;
	      });
	      dots.enter().append("circle").attr("class", "dot").attr("r", 3).attr("cx", 0).attr("cy", function (d) {
	        return yScale(d.value);
	      }).on("mouseover", function (e, d) {
	        dispatch.call("customValueMouseOver", this, e, d);
	      }).on("click", function (e, d) {
	        dispatch.call("customValueClick", this, e, d);
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
	   * On Event Getter
	   *
	   * @returns {*}
	   */
	  my.on = function () {
	    var value = dispatch.on.apply(dispatch, arguments);
	    return value === dispatch ? my : value;
	  };
	  return my;
	}

	var component = {
	  barsCircular: componentBarsCircular,
	  barsHorizontal: componentBarsHorizontal,
	  barsVertical: componentBarsVertical,
	  barsVerticalStacked: componentBarsVerticalStacked,
	  bubbles: componentBubbles,
	  candleSticks: componentCandleSticks,
	  circularAxis: componentCircularAxis,
	  circularRingLabels: componentCircularRingLabels,
	  circularSectorLabels: componentCircularSectorLabels,
	  donut: componentDonut,
	  donutLabels: componentDonutLabels,
	  heatMapRing: componentHeatMapRing,
	  heatMapRow: componentHeatMapRow,
	  htmlList: componentHtmlList,
	  htmlTable: componentHtmlTable,
	  labeledNode: componentLabeledNode,
	  legend: componentLegend,
	  legendSize: componentLegendSize,
	  legendColor: componentLegendCategorical,
	  legendThreshold: componentLegendThreshold,
	  lineChart: componentLineChart,
	  numberCard: componentNumberCard,
	  polarArea: componentPolarArea,
	  proportionalAreaCircles: componentProportionalAreaCircles,
	  radarArea: componentRadarArea,
	  roseChartSector: componentRoseChartSector,
	  scatterPlot: componentScatterPlot
	};

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
	    var lumScale = d3__namespace.scaleLinear().domain([1, count]).range([lumMin, lumMax]);
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

	/**
	 * Circular Bar Chart (aka: Progress Chart)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/circular-bar-chart/
	 */
	function chartBarChartCircular () {
	  /* Default Properties */
	  var classed = "barChartCircular";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.categorical(3);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var startAngle = 0;
	  var endAngle = 270;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barChartCircular
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / data.length / 2;
	      var innerRadius = radius / 4;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueMax = _dataTransform$summar.valueMax;
	      var valueExtent = [0, valueMax];
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).rangeRound([innerRadius, radius]).padding(0.15);
	      var yScale = d3__namespace.scaleLinear().domain(valueExtent).range([startAngle, endAngle]);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
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
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Radial Bars
	      var barsCircular = component.barsCircular().colorScale(colorScale).xScale(xScale).opacity(opacity).yScale(yScale).dispatch(dispatch).transition(transition);

	      // Circular Axis
	      var circularAxis = component.circularAxis().radialScale(yScale).ringScale(xScale);

	      // Outer Labels
	      var circularSectorLabels = component.circularSectorLabels().ringScale(xScale).radialScale(yScale).textAnchor("middle");

	      // Ring Labels
	      var circularRingLabels = component.circularRingLabels().radialScale(xScale).textAnchor("middle");

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", function (d, i) {
	        return "translate(".concat(layout[i].x, ",").concat(layout[i].y, ")");
	      }).call(circularAxis).call(barsCircular).call(circularSectorLabels).call(circularRingLabels);
	      seriesGroup.exit().remove();

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Bar Chart (Vertical) (aka: Bar Chart; Bar Graph)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/bar-chart/
	 * @see https://www.atlassian.com/data/charts/stacked-bar-chart-complete-guide
	 */
	function chartBarChartVertical () {
	  /* Default Properties */
	  var classed = "barChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = palette.categorical(1);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var yAxisLabel = null;
	  var stacked = false;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barChartVertical
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);

	      // Create Scales and Axis
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueExtent = _dataTransform$summar.valueExtent,
	        valueExtentStacked = _dataTransform$summar.valueExtentStacked;
	      var _valueExtent = _slicedToArray(valueExtent, 2),
	        valueMin = _valueExtent[0],
	        valueMax = _valueExtent[1];
	      if (stacked) {
	        // Sum negative stacked bars
	        var _valueExtentStacked = _slicedToArray(valueExtentStacked, 2);
	        valueMin = _valueExtentStacked[0];
	        valueMax = _valueExtentStacked[1];
	      } else {
	        // Set min to zero if min is more than zero
	        valueMin = valueMin > 0 ? 0 : valueMin;
	      }
	      var yDomain = [valueMin, valueMax];
	      var xScale2 = d3__namespace.scaleBand().domain(rowKeys).range([0, chartW]).padding(0.05);
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, xScale2.bandwidth()]).padding(0.05);
	      var yScale = d3__namespace.scaleLinear().domain(yDomain).range([chartH, 0]);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Bars Component
	      var bars = stacked ? component.barsVerticalStacked().xScale(xScale2) : component.barsVertical().xScale(xScale);
	      bars.colorScale(colorScale).yScale(yScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", function (d) {
	        return "translate(".concat(xScale2(d.key), ",").concat(chartH - yScale(valueMin), ")");
	      }).call(bars);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisBottom(xScale2);
	      containerEnter.select(".xAxis").attr("transform", "translate(0,".concat(chartH, ")")).call(xAxis);

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);

	      // Y Axis Label
	      containerEnter.select(".yAxis").selectAll(".yAxisLabel").data([yAxisLabel]).enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "currentColor").style("text-anchor", "end").transition().text(function (d) {
	        return d;
	      });
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Bar Chart (Vertical) (aka: Bar Chart; Bar Graph)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/bar-chart/
	 * @see https://www.atlassian.com/data/charts/stacked-bar-chart-complete-guide
	 */
	function chartBarChartHorizontal () {
	  /* Default Properties */
	  var classed = "barChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = palette.categorical(1);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var yAxisLabel = null;
	  var stacked = false;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias barChartVertical
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);

	      // Create Scales and Axis
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueExtent = _dataTransform$summar.valueExtent,
	        valueExtentStacked = _dataTransform$summar.valueExtentStacked;
	      var _valueExtent = _slicedToArray(valueExtent, 2),
	        valueMin = _valueExtent[0],
	        valueMax = _valueExtent[1];
	      if (stacked) {
	        // Sum negative stacked bars
	        var _valueExtentStacked = _slicedToArray(valueExtentStacked, 2);
	        valueMin = _valueExtentStacked[0];
	        valueMax = _valueExtentStacked[1];
	      } else {
	        // Set min to zero if min is more than zero
	        valueMin = valueMin > 0 ? 0 : valueMin;
	      }
	      var yDomain = [valueMin, valueMax];
	      var xScale = d3__namespace.scaleLinear().domain(yDomain).range([0, chartW]);
	      var yScale2 = d3__namespace.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.1);
	      var yScale = d3__namespace.scaleBand().domain(columnKeys).range([0, yScale2.bandwidth()]).padding(0.15);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Bars Component
	      var bars = component.barsHorizontal().xScale(xScale).colorScale(colorScale).yScale(yScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", function (d) {
	        return "translate(".concat(xScale(valueMin), ",").concat(yScale2(d.key), ")");
	      }).call(bars);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisBottom(xScale);
	      containerEnter.select(".xAxis").attr("transform", "translate(0,".concat(chartH, ")")).call(xAxis);

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale2);
	      containerEnter.select(".yAxis").call(yAxis);
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Bubble Chart (aka: Bubble Plot)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/bubble-chart/
	 * @see https://www.atlassian.com/data/charts/bubble-chart-complete-guide
	 */
	function chartBubbleChart () {
	  /* Default Properties */
	  var classed = "bubbleChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = palette.categorical(1);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var yAxisLabel = null;
	  var minRadius = 3;
	  var maxRadius = 20;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias bubbleChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
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
	      var xScale = d3__namespace.scaleLinear().domain(xExtent).range([0, chartW]).nice();
	      var yScale = d3__namespace.scaleLinear().domain(yExtent).range([chartH, 0]).nice();
	      var colorScale = d3__namespace.scaleOrdinal().domain(rowKeys).range(colors);
	      var sizeScale = d3__namespace.scaleLinear().domain(valueExtent).range([minRadius, maxRadius]);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend", "zoomArea", "clipArea"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Bubble Component
	      var bubbles = component.bubbles().xScale(xScale).yScale(yScale).colorScale(colorScale).sizeScale(sizeScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").attr("class", "seriesGroup").attr('clip-path', "url(#plotAreaClip)").merge(seriesGroup).call(bubbles);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisBottom(xScale);
	      containerEnter.select(".xAxis").attr("transform", "translate(0,".concat(chartH, ")")).call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().sizeScale(sizeScale).height(legendH).width(legendW).opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);

	      // Zoom Clip Path
	      var clipPath = containerEnter.select(".clipArea").selectAll("defs").data([0]);
	      clipPath.enter().append("defs").append("clipPath").attr("id", "plotAreaClip").append("rect").attr("width", chartW).attr("height", chartH).merge(clipPath).select("clipPath").select("rect").attr("width", chartW).attr("height", chartH);

	      // Zoom Event Area
	      var zoom = d3__namespace.zoom().extent([[0, 0], [chartW, chartH]]).scaleExtent([1, 8]).translateExtent([[0, 0], [chartW, chartH]]).on("zoom", zoomed);
	      function zoomed(e) {
	        var xScaleZoomed = e.transform.rescaleX(xScale);
	        var yScaleZoomed = e.transform.rescaleY(yScale);
	        xAxis.scale(xScaleZoomed);
	        containerEnter.select(".xAxis").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
	        yAxis.scale(yScaleZoomed);
	        containerEnter.select(".yAxis").call(yAxis);
	        bubbles.xScale(xScaleZoomed).yScale(yScaleZoomed).transition({
	          ease: d3__namespace.easeLinear,
	          duration: 0
	        });
	        containerEnter.select(".chart").selectAll(".seriesGroup").call(bubbles);
	      }
	      var zoomArea = containerEnter.select(".zoomArea").selectAll("rect").data([0]);
	      zoomArea.enter().append("rect").attr("fill", "none").attr("pointer-events", "all").merge(zoomArea).call(zoom).attr("width", chartW).attr("height", chartH);
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
	   * On Event Getter
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
	 * Candlestick Chart (aka: Japanese Candlestick; OHLC Chart; Box Plot)
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
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = ["green", "red"];
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var yAxisLabel = null;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias candlestickChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
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
	      var maxDate = d3__namespace.max(data.values, function (d) {
	        return d.date;
	      });
	      var minDate = d3__namespace.min(data.values, function (d) {
	        return d.date;
	      });
	      var ONE_DAY_IN_MILLISECONDS = 86400000;
	      var dateDomain = [new Date(minDate - ONE_DAY_IN_MILLISECONDS), new Date(maxDate + ONE_DAY_IN_MILLISECONDS)];

	      // TODO: Use dataTransform() to calculate candle min/max?
	      var yDomain = [d3__namespace.min(data.values, function (d) {
	        return d.low;
	      }), d3__namespace.max(data.values, function (d) {
	        return d.high;
	      })];
	      var xScale = d3__namespace.scaleTime().domain(dateDomain).range([0, chartW]);
	      var yScale = d3__namespace.scaleLinear().domain(yDomain).range([chartH, 0]).nice();
	      var colorScale = d3__namespace.scaleOrdinal().domain([true, false]).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["zoomArea", "xAxis axis", "yAxis axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Candle Stick Component
	      var candleSticks = component.candleSticks().xScale(xScale).yScale(yScale).colorScale(colorScale).dispatch(dispatch).opacity(opacity).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return [d];
	      }); // FIXME: Convert input data to support multi-series.

	      seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).call(candleSticks);
	      seriesGroup.exit().remove();

	      // X Axis
	      var xAxis = d3__namespace.axisBottom(xScale).tickFormat(d3__namespace.timeFormat("%d-%b-%y"));
	      containerEnter.select(".xAxis").attr("transform", "translate(0,".concat(chartH, ")")).call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);

	      // Y-Axis Label
	      containerEnter.select(".yAxis").selectAll(".yAxisLabel").data([yAxisLabel]).enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "currentColor").style("text-anchor", "end").transition().text(function (d) {
	        return d;
	      });
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("line").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);

	      // Experimental Brush
	      var brush = d3__namespace.brushX().extent([[0, 0], [chartW, chartH]]).on("brush start", brushStart).on("brush end", brushEnd);
	      containerEnter.select(".zoomArea").call(brush);
	      function brushStart(e) {
	        console.log(e);
	      }
	      function brushEnd(e) {
	        console.log(e);
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
	   * On Event Getter
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
	 * Donut Chart (aka: Doughnut Chart; Pie Chart)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/donut-chart/
	 * @see https://www.atlassian.com/data/charts/pie-chart-complete-guide
	 */
	function chartDonutChart () {
	  /* Default Properties */
	  var classed = "donutChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.categorical(3);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var startAngle = 0;
	  var endAngle = 360;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias donutChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / data.length / 2;
	      var innerRadius = radius / 2;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueExtent = _dataTransform$summar.valueExtent;
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).range([innerRadius, radius]);
	      var yScale = d3__namespace.scaleLinear().domain(valueExtent).range([startAngle, endAngle]);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
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
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Donut Slice Component
	      var donut = component.donut().xScale(xScale).yScale(yScale).colorScale(colorScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Donut Label Component
	      var donutLabels = component.donutLabels().xScale(xScale).yScale(yScale).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", function (d, i) {
	        return "translate(".concat(layout[i].x, ",").concat(layout[i].y, ")");
	      }).call(donut).call(donutLabels);
	      seriesGroup.exit().remove();

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Radial Heat Map (aka: Circular Heat Map)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/radial-heatmap/
	 */
	function chartHeatMapRadial () {
	  /* Default Properties */
	  var classed = "heatMapRadial";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.diverging(2).slice(0, 5);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var startAngle = 0;
	  var endAngle = 270;
	  var thresholds;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias heatMapRadial
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / 2;
	      var innerRadius = radius / 4;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        tmpThresholds = _dataTransform$summar.thresholds;
	      if (typeof thresholds === "undefined") {
	        thresholds = tmpThresholds;
	      }
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]).padding(0.1);
	      var yScale = d3__namespace.scaleBand().domain(rowKeys).rangeRound([innerRadius, radius]).padding(0.1);
	      var colorScale = d3__namespace.scaleThreshold().domain(thresholds).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Heat Map Rings
	      var heatMapRing = component.heatMapRing().colorScale(colorScale).xScale(xScale).yScale(yScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Circular Labels
	      var circularSectorLabels = component.circularSectorLabels().ringScale(yScale).radialScale(xScale).textAnchor("start");

	      // Ring Labels
	      var circularRingLabels = component.circularRingLabels().radialScale(yScale).textAnchor("middle");

	      // Create Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")")).call(heatMapRing).call(circularRingLabels);
	      seriesGroup.exit().remove();

	      // Outer Ring Labels
	      containerEnter.select(".axis").attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")")).call(circularSectorLabels);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Heat Map (aka: Heat Table; Density Table; Heat Map)
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
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = palette.diverging(2).slice(0, 5);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var thresholds;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias heatMap
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
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
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.15);
	      var yScale = d3__namespace.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.15);
	      var colorScale = d3__namespace.scaleThreshold().domain(thresholds).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Heat Map Row Component
	      var heatMapRow = component.heatMapRow().xScale(xScale).yScale(yScale).colorScale(colorScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(data);
	      seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).attr("transform", function (d) {
	        return "translate(0,".concat(yScale(d.key), ")");
	      }).call(heatMapRow);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisTop(xScale);
	      containerEnter.select(".xAxis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Line Chart (aks: Line Graph; Spline Chart)
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
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = palette.categorical(1);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var yAxisLabel = null;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias lineChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);

	      // Create Scales and Axis
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueMin = _dataTransform$summar.valueMin,
	        valueMax = _dataTransform$summar.valueMax;
	      // Set min to zero if min is more than zero
	      valueMin = valueMin > 0 ? 0 : valueMin;
	      var valueExtent = [valueMin, valueMax];
	      var xScale = d3__namespace.scalePoint().domain(columnKeys).range([0, chartW]);
	      {
	        // TODO: Use dataTransform() to calculate date domains?
	        data.forEach(function (d, i) {
	          d.values.forEach(function (b, j) {
	            data[i].values[j].key = new Date(b.key);
	          });
	        });
	        var dateExtent = d3__namespace.extent(data[0].values, function (d) {
	          return d.key;
	        });
	        xScale = d3__namespace.scaleTime().domain(dateExtent).range([0, chartW]);
	      }
	      var yScale = d3__namespace.scaleLinear().domain(valueExtent).range([chartH, 0]).nice();
	      var colorScale = d3__namespace.scaleOrdinal().domain(rowKeys).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend", "zoomArea", "clipArea"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Line Chart Component
	      var lineChart = component.lineChart().colorScale(colorScale).xScale(xScale).yScale(yScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Line Dots Component
	      var scatterPlot = component.scatterPlot().colorScale(colorScale).yScale(yScale).xScale(xScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").attr("class", "seriesGroup").attr('clip-path', "url(#plotAreaClip)").merge(seriesGroup).call(lineChart).call(scatterPlot);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisBottom(xScale);
	      containerEnter.select(".xAxis").attr("transform", "translate(0,".concat(chartH, ")")).call(xAxis);

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);

	      // Y-Axis Label
	      containerEnter.select(".yAxis").selectAll(".yAxisLabel").data([yAxisLabel]).enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "currentColor").style("text-anchor", "end").text(function (d) {
	        return d;
	      });
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("line").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);

	      // Zoom Clip Path
	      var clipPath = containerEnter.select(".clipArea").selectAll("defs").data([0]);
	      clipPath.enter().append("defs").append("clipPath").attr("id", "plotAreaClip").append("rect").attr("width", chartW).attr("height", chartH).merge(clipPath).select("clipPath").select("rect").attr("width", chartW).attr("height", chartH);

	      // Zoom Event Area
	      var zoom = d3__namespace.zoom().extent([[0, 0], [chartW, chartH]]).scaleExtent([1, 8]).translateExtent([[0, 0], [chartW, chartH]]).on("zoom", zoomed);
	      function zoomed(e) {
	        var xScaleZoomed = e.transform.rescaleX(xScale);
	        xAxis.scale(xScaleZoomed);
	        containerEnter.select(".xAxis").call(xAxis);
	        lineChart.xScale(xScaleZoomed).transition({
	          ease: d3__namespace.easeLinear,
	          duration: 0
	        });
	        scatterPlot.xScale(xScaleZoomed).transition({
	          ease: d3__namespace.easeLinear,
	          duration: 0
	        });
	        containerEnter.select(".chart").selectAll(".seriesGroup").call(lineChart).call(scatterPlot);
	      }
	      var zoomArea = containerEnter.select(".zoomArea").selectAll(".rect").data([0]);
	      zoomArea.enter().append("rect").classed("zoomArea", true).attr("fill", "none").attr("pointer-events", "all").merge(zoomArea).call(zoom).attr("width", chartW).attr("height", chartH);
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
	   * On Event Getter
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
	 * Polar Area Chart (aka: Coxcomb Chart; Rose Chart)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/polar-area-chart/
	 */
	function chartPolarAreaChart () {
	  /* Default Properties */
	  var classed = "polarAreaChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.categorical(3);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var startAngle = 0;
	  var endAngle = 360;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias polarAreaChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / data.length / 2;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueMax = _dataTransform$summar.valueMax;
	      var valueExtent = [0, valueMax];
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).rangeRound([startAngle, endAngle]);
	      var yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, radius]);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
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
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Radial Bar Chart
	      var polarArea = component.polarArea().xScale(xScale).yScale(yScale).colorScale(colorScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Circular Axis
	      var circularAxis = component.circularAxis().radialScale(xScale).ringScale(yScale);

	      // Circular Labels
	      var circularSectorLabels = component.circularSectorLabels().ringScale(yScale).radialScale(xScale).textAnchor("middle");

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", function (d, i) {
	        return "translate(".concat(layout[i].x, ",").concat(layout[i].y, ")");
	      }).call(circularAxis).call(circularSectorLabels).call(polarArea);
	      seriesGroup.exit().remove();

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Punch Card (aka: Proportional Area Chart)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
	 */
	function chartPunchCard () {
	  /* Default Properties */
	  var classed = "punchCard";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 40,
	    right: 40,
	    bottom: 40,
	    left: 40
	  };
	  var colors = [d3__namespace.rgb("steelblue").brighter(), d3__namespace.rgb("steelblue").darker()];
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var showAxis = true;
	  var minRadius = 2;
	  var maxRadius = 20;
	  var useGlobalScale = true;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias punchCard
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
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
	      var xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, chartW]).padding(0.05);
	      var yScale = d3__namespace.scaleBand().domain(rowKeys).range([0, chartH]).padding(0.05);
	      var colorScale = d3__namespace.scaleLinear().domain(valueExtent).range(colors);
	      var sizeExtent = useGlobalScale ? valueExtent : [0, d3__namespace.max(data[1].values, function (d) {
	        return d.value;
	      })];
	      var sizeScale = d3__namespace.scaleLinear().domain(sizeExtent).range([minRadius, maxRadius]);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);
	      var layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Proportional Area Circles
	      var proportionalAreaCircles = component.proportionalAreaCircles().xScale(xScale).yScale(yScale).colorScale(colorScale).sizeScale(sizeScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(data);
	      seriesGroup.enter().append("g").attr("class", "seriesGroup").merge(seriesGroup).attr("transform", function (d) {
	        return "translate(0,".concat(yScale(d.key), ")");
	      }).call(proportionalAreaCircles);
	      seriesGroup.exit().remove();

	      // X-Axis
	      var xAxis = d3__namespace.axisTop(xScale);
	      containerEnter.select(".xAxis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");

	      // Y-Axis
	      var yAxis = d3__namespace.axisLeft(yScale);
	      containerEnter.select(".yAxis").call(yAxis);
	      containerEnter.selectAll(".axis").attr("opacity", showAxis ? 1 : 0);

	      // Legend
	      var legend = component.legend().sizeScale(sizeScale).height(legendH).width(legendW).opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Radar Chart (aka: Spider Chart; Web Chart; Star Plot)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/radar-diagram/
	 */
	function chartRadarChart () {
	  /* Default Properties */
	  var classed = "radarChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.categorical(3);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var startAngle = 0;
	  var endAngle = 360;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias radarChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / 2.5;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueMax = _dataTransform$summar.valueMax;
	      var valueExtent = [0, valueMax];
	      var xScale = d3__namespace.scalePoint().domain(columnKeys).range([startAngle, endAngle]);
	      var yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, radius]).nice();
	      var colorScale = d3__namespace.scaleOrdinal().domain(rowKeys).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);

	      // Update the chart dimensions and container and layer groups
	      var layers = ["axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Radar Component
	      var radarArea = component.radarArea().xScale(xScale).yScale(yScale).colorScale(colorScale).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Circular Axis
	      var circularAxis = component.circularAxis().radialScale(xScale).ringScale(yScale).showAxis(false);

	      // Circular Labels
	      var circularSectorLabels = component.circularSectorLabels().ringScale(yScale).radialScale(xScale).textAnchor("middle");

	      // Create Radars
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).attr("fill", function (d) {
	        return colorScale(d.key);
	      }).style("stroke", function (d) {
	        return colorScale(d.key);
	      }).merge(seriesGroup).call(radarArea).attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")"));
	      containerEnter.select(".axis").attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")")).call(circularSectorLabels).call(circularAxis);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	 * Rose Chart (aka: Coxcomb Chart; Circumplex Chart; Nightingale Chart)
	 *
	 * @module
	 * @see http://datavizproject.com/data-type/polar-area-chart/
	 */
	function chartRoseChart () {
	  /* Default Properties */
	  var classed = "roseChart";
	  var width = 700;
	  var height = 400;
	  var margin = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 20
	  };
	  var colors = palette.categorical(3);
	  var transition = {
	    ease: d3__namespace.easeLinear,
	    duration: 0
	  };
	  var dispatch = d3__namespace.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	  /* Other Customisation Options */
	  var opacity = 1;
	  var stacked = true;

	  /**
	   * Constructor
	   *
	   * @constructor
	   * @alias roseChart
	   * @param {d3.selection} selection - The chart holder D3 selection.
	   */
	  function my(selection) {
	    // Create SVG element (if it does not exist already)
	    var svg = function (selection) {
	      var el = selection._groups[0][0];
	      if (!!el.ownerSVGElement || el.tagName === "svg") {
	        return selection;
	      } else {
	        var svgSelection = selection.selectAll("svg").data(function (d) {
	          return [d];
	        });
	        return svgSelection.enter().append("svg").merge(svgSelection);
	      }
	    }(selection);
	    selection.each(function (data) {
	      // Set up margins and dimensions for the chart
	      var legendW = 120;
	      var legendPad = 15;
	      var chartW = Math.max(width - margin.left - legendPad - legendW - margin.right, 100);
	      var chartH = Math.max(height - margin.top - margin.bottom, 100);
	      var legendH = Math.max(chartH / 2, 100);
	      var radius = Math.min(chartW, chartH) / 2;
	      var innerRadius = 0;
	      var _dataTransform$summar = dataTransform(data).summary(),
	        rowKeys = _dataTransform$summar.rowKeys,
	        columnKeys = _dataTransform$summar.columnKeys,
	        valueMin = _dataTransform$summar.valueMin,
	        valueMax = _dataTransform$summar.valueMax,
	        valueExtentStacked = _dataTransform$summar.valueExtentStacked;
	      valueMax = stacked ? valueExtentStacked[1] : valueMax;
	      valueMin = 0;
	      var yDomain = [valueMin, valueMax];
	      var xScale = d3__namespace.scaleBand().domain(rowKeys).rangeRound([0, 360]);
	      var yScale = d3__namespace.scaleLinear().domain(yDomain).range([innerRadius, radius]);
	      var colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(colors);
	      svg.classed("d3ez", true).attr("width", width).attr("height", height);

	      // Update the chart dimensions and container and layer groups
	      var container = svg.selectAll(".container").data([data]);
	      container.exit().remove();
	      var containerEnter = container.enter().append("g").classed("container", true).classed(classed, true).merge(container).attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")).attr("width", chartW).attr("height", chartH);

	      // Update the chart dimensions and container and layer groups
	      var layers = ["axis", "chart", "legend"];
	      containerEnter.selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
	        return d;
	      });

	      // Rose Sectors
	      var roseChartSector = component.roseChartSector().xScale(xScale).yScale(yScale).colorScale(colorScale).stacked(stacked).opacity(opacity).dispatch(dispatch).transition(transition);

	      // Circular Axis
	      var circularAxis = component.circularAxis().radialScale(xScale).ringScale(yScale);

	      // Circular Labels
	      var circularSectorLabels = component.circularSectorLabels().ringScale(yScale).radialScale(xScale).textAnchor("middle").capitalizeLabels(true);

	      // Create Series Group
	      var seriesGroup = containerEnter.select(".chart").selectAll(".seriesGroup").data(function (d) {
	        return d;
	      });
	      seriesGroup.enter().append("g").classed("seriesGroup", true).merge(seriesGroup).attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")")).each(function () {
	        d3__namespace.select(this).call(roseChartSector);
	      });
	      seriesGroup.exit().remove();

	      // Outer Ring Labels
	      containerEnter.select(".axis").attr("transform", "translate(".concat(chartW / 2, ",").concat(chartH / 2, ")")).call(circularSectorLabels).call(circularAxis);

	      // Legend
	      var legend = component.legend().colorScale(colorScale).height(legendH).width(legendW).itemType("rect").opacity(opacity);
	      containerEnter.select(".legend").attr("transform", "translate(".concat(chartW + legendPad, ",0)")).call(legend);
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
	   * On Event Getter
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
	  barChartHorizontal: chartBarChartHorizontal,
	  barChartVertical: chartBarChartVertical,
	  bubbleChart: chartBubbleChart,
	  candlestickChart: chartCandlestickChart,
	  donutChart: chartDonutChart,
	  heatMap: chartHeatMap,
	  heatMapRadial: chartHeatMapRadial,
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
	 * @copyright Copyright (C) 2024 James Saunders
	 * @license GPLv2
	 */

	var author = "James Saunders";
	var year = new Date().getFullYear();
	var copyright = "Copyright (C) ".concat(year, " ").concat(author);
	var version = packageJson.version;
	var license = packageJson.license;
	var index = {
	  version: version,
	  author: author,
	  copyright: copyright,
	  license: license,
	  chart: chart,
	  component: component,
	  palette: palette,
	  dataTransform: dataTransform
	};

	return index;

}));
