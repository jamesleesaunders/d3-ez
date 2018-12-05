import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Punch Card
 *
 * @module
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "punchCard";
	let width = 400;
	let height = 300;
	let margin = { top: 50, right: 20, bottom: 20, left: 50 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	let chartW;
	let chartH;

	/* Scales */
	let sizeScale;
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let minRadius = 2;
	let maxRadius = 20;
	let useGlobalScale = true;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		const { rowKeys, columnKeys, valueExtent } = dataTransform(data).summary();

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(colors);
		}

		xScale = d3.scaleBand()
			.domain(columnKeys)
			.range([0, chartW])
			.padding(0.05);

		yScale = d3.scaleBand()
			.domain(rowKeys)
			.range([0, chartH])
			.padding(0.05);

		const sizeExtent = useGlobalScale ? valueExtent : [0, d3.max(data[1].values, (d) => d.value)];

		sizeScale = d3.scaleLinear()
			.domain(sizeExtent)
			.range([minRadius, maxRadius]);
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
			svg = (function(selection) {
				const el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			})(selection);

			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		const layers = ["punchRowGroups", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("width", chartW)
			.attr("height", chartH)
			.selectAll("g")
			.data(layers)
			.enter()
			.append("g")
			.attr("class", (d) => d);

		selection.each(function(data) {
			// Initialise Data
			init(data);

			// Proportional Area Circles
			const proportionalAreaCircles = component.proportionalAreaCircles()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.sizeScale(sizeScale)
				.dispatch(dispatch);

			const seriesGroup = chart.select(".punchRowGroups")
				.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter().append("g")
				.attr("class", "seriesGroup")
				.attr("transform", (d) => "translate(0, " + yScale(d.key) + ")")
				.merge(seriesGroup)
				.call(proportionalAreaCircles);

			seriesGroup.exit()
				.remove();

			// X Axis
			const xAxis = d3.axisTop(xScale);

			chart.select(".xAxis")
				.call(xAxis)
				.selectAll("text")
				.attr("y", 0)
				.attr("x", -8)
				.attr("transform", "rotate(60)")
				.style("text-anchor", "end");

			// Y Axis
			const yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis")
				.call(yAxis);
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
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
	my.height = function(_v) {
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
	my.margin = function(_v) {
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
	my.minRadius = function(_v) {
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
	my.maxRadius = function(_v) {
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
	my.sizeScale = function(_v) {
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
	my.colors = function(_v) {
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
	my.useGlobalScale = function(_v) {
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
	my.transition = function(_v) {
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
	my.dispatch = function(_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
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
