import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Polar Area Chart (also called: Coxcomb Chart; Rose Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "polarAreaChart";
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

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let startAngle = 0;
	let endAngle = 360;
	let capitalizeLabels = false;
	let colorLabels = false;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(chartW, chartH) / 2) :
			radius;

		// Slice Data, calculate totals, max etc.
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleBand()
			.domain(seriesNames)
			.rangeRound([startAngle, endAngle])
			.padding(0.15);

		yScale = d3.scaleLinear()
			.domain([0, maxValue])
			.range([0, radius])
			.nice();
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
			svg = (function(selection) {
				let el = selection._groups[0][0];
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
		let layers = ["circularAxis", "polarArea", "circularSectorLabels", "verticalAxis axis"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
			.attr("width", chartW)
			.attr("height", chartH)
			.selectAll("g")
			.data(layers)
			.enter()
			.append("g")
			.attr("class", function(d) { return d; });

		selection.each(function(data) {
			// Initialise Data
			init(data);

			// Circular Axis
			let circularAxis = component.circularAxis()
				.radialScale(xScale)
				.ringScale(yScale)
				.radius(radius);

			chart.select(".circularAxis")
				.call(circularAxis);

			// Radial Bar Chart
			let polarArea = component.polarArea()
				.radius(radius)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.dispatch(dispatch);

			chart.select(".polarArea")
				.datum(data)
				.call(polarArea);

			// Vertical Axis
			// We reverse the yScale
			let axisScale = d3.scaleLinear()
				.domain(yScale.domain())
				.range(yScale.range().reverse())
				.nice();

			let verticalAxis = d3.axisLeft(axisScale);

			chart.select(".verticalAxis")
				.attr("transform", "translate(0," + -radius + ")")
				.call(verticalAxis);

			// Circular Labels
			let circularSectorLabels = component.circularSectorLabels()
				.radius(radius * 1.04)
				.radialScale(xScale)
				.textAnchor("start");

			chart.select(".circularSectorLabels")
				.call(circularSectorLabels);

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
	 * Margin Getter / Setter
	 *
	 * @param {number} _ - Margin in px.
	 * @returns {*}
	 */
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
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
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
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
		return this;
	};

	/**
	 * Capital Labels Getter / Setter
	 *
	 * @param {boolean} _ - Display capital labels or not?
	 * @returns {*}
	 */
	my.capitalizeLabels = function(_) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _;
		return this;
	};

	/**
	 * Color Labels Getter / Setter
	 *
	 * @param {Array} _ - Array of color labels.
	 * @returns {*}
	 */
	my.colorLabels = function(_) {
		if (!arguments.length) return colorLabels;
		colorLabels = _;
		return this;
	};

	/**
	 * Transition Getter / Setter
	 *
	 * @param {d3.transition} _ - D3 transition style.
	 * @returns {*}
	 */
	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
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
