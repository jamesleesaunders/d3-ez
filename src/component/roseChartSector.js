import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Rose Chart Sector
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let radius;
	let startAngle = 0;
	let endAngle = 45;
	let colors = palette.categorical(3);
	let colorScale;
	let xScale;
	let yScale;
	let stacked = false;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "roseChartSector";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = stacked ? dataSummary.rowTotalsMax : dataSummary.maxValue;

		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, radius]) :
			yScale;

		// If the xScale has been passed then re-calculate the start and end angles.
		if (typeof xScale !== "undefined") {
			startAngle = xScale(data.key);
			endAngle = xScale(data.key) + xScale.bandwidth();
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
		selection.each(function() {
			// Stack Generator
			let stacker = function(data) {
				// Calculate inner and outer radius values
				let series = [];
				let innerRadius = 0;
				let outerRadius = 0;
				data.forEach(function(d, i) {
					outerRadius = innerRadius + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						innerRadius: yScale(innerRadius),
						outerRadius: yScale(outerRadius)
					};
					innerRadius += (stacked ? d.value : 0);
				});

				return series;
			};

			// Arc Generator
			let arc = d3.arc()
				.innerRadius(function(d) { return d.innerRadius; })
				.outerRadius(function(d) { return d.outerRadius; })
				.startAngle(startAngle * (Math.PI / 180))
				.endAngle(endAngle * (Math.PI / 180));

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add arcs to series group
			let arcs = seriesGroup.selectAll(".arc")
				.data(function(d) { return stacker(d.values); });

			arcs.enter()
				.append("path")
				.classed("arc", true)
				.attr("fill", function(d) { return colorScale(d.key); })
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(arcs)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("d", arc);

			arcs.exit()
				.transition()
				.style("opacity", 0)
				.remove();
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _ - Width in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _ - Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
	 * Radius Getter / Setter
	 *
	 * @param {number} _ - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	/**
	 * Start Angle Getter / Setter
	 *
	 * @param {number} _ - Angle in degrees.
	 * @returns {*}
	 */
	my.startAngle = function(_) {
		if (!arguments.length) return startAngle;
		startAngle = _;
		return this;
	};

	/**
	 * End Angle Getter / Setter
	 *
	 * @param {number} _ - Angle in degrees.
	 * @returns {*}
	 */
	my.endAngle = function(_) {
		if (!arguments.length) return endAngle;
		endAngle = _;
		return this;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Stacked Getter / Setter
	 *
	 * @param {boolean} _ - Stacked bars or grouped?
	 * @returns {*}
	 */
	my.stacked = function(_) {
		if (!arguments.length) return stacked;
		stacked = _;
		return my;
	};

	/**
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _ - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	/**
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
