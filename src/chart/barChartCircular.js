import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Circular Bar Chart (also called: Progress Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "barChartCircular";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	let chartW;
	let chartH;
	let radius;
	let innerRadius;

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let startAngle = 0;
	let endAngle = 270;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [valueMax, 0];

		if (typeof radius === "undefined") {
			radius = Math.min(chartW, chartH) / 2;
		}

		if (typeof innerRadius === "undefined") {
			innerRadius = radius / 4;
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);
		}

		xScale = d3.scaleBand()
			.domain(columnKeys)
			.rangeRound([innerRadius, radius])
			.padding(0.15);

		yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([startAngle, endAngle]);
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
		const layers = ["circularAxis", "barsCircular", "circularSectorLabels", "circularRingLabels"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
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

			// Circular Axis
			const circularAxis = component.circularAxis()
				.radius(radius)
				.radialScale(yScale)
				.ringScale(xScale);

			chart.select(".circularAxis")
				.call(circularAxis);

			// Radial Bars
			const barsCircular = component.barsCircular()
				.radius(radius)
				.innerRadius(innerRadius)
				.colorScale(colorScale)
				.xScale(xScale)
				.dispatch(dispatch);

			chart.select(".barsCircular")
				.datum(data)
				.call(barsCircular);

			// Outer Labels
			const circularSectorLabels = component.circularSectorLabels()
				.radius(radius * 1.04)
				.radialScale(yScale)
				.textAnchor("middle");

			chart.select(".circularSectorLabels")
				.call(circularSectorLabels);

			// Ring Labels
			const circularRingLabels = component.circularRingLabels()
				.radialScale(xScale)
				.textAnchor("middle");

			chart.select(".circularRingLabels")
				.call(circularRingLabels);

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
	 * Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_v) {
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
	my.innerRadius = function(_v) {
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
	my.colors = function(_v) {
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
	my.colorScale = function(_v) {
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
