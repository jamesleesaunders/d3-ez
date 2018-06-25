import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Horizontal Bar Chart Component
 *
 */
export default function() {

	/**
  * Default Properties
  */
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
  */
	function init(data) {
		var slicedData = dataParse(data);
		var categoryNames = slicedData.categoryNames;
		var maxValue = slicedData.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(categoryNames).range(colors) : colorScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = typeof yScale === "undefined" ? d3.scaleBand().domain(categoryNames).rangeRound([0, width]).padding(0.15) : yScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, height]).nice() : xScale;
	}

	/**
  * Constructor
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
			}).attr("height", function (d) {
				return yScale.bandwidth();
			}).on("mouseover", function (d) {
				dispatch.call("customValueMouseOver", this, d);
			}).on("click", function (d) {
				dispatch.call("customValueClick", this, d);
			}).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function (d) {
				return 0;
			}).attr("width", function (d) {
				return xScale(d.value);
			});

			bars.exit().transition().style("opacity", 0).remove();
		});
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.dispatch = function (_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
