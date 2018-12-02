import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Radar Chart (also called: Spider Chart; Web Chart; Star Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/radar-diagram/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "radarChart";
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
		radius = typeof radius === "undefined" ? Math.min(chartW, chartH) / 2 : radius;

		// Slice Data, calculate totals, max etc.
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.rowKeys;
		let categoryNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// X & Y Scales
		xScale = d3.scaleBand()
			.domain(categoryNames)
			.range([startAngle, endAngle]);

		yScale = d3.scaleLinear()
			.domain([0, maxValue])
			.range([0, radius])
			.nice();
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
			svg = function(selection) {
				let el = selection._groups[0][0];
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
		let layers = ["circularAxis", "circularSectorLabels", "verticalAxis axis", "radarGroup"];
		chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function(d) {
			return d;
		});

		selection.each(function(data) {
			// Initialise Data
			init(data);

			// Create Circular Axis
			let circularAxis = component.circularAxis()
				.radialScale(xScale)
				.ringScale(yScale)
				.radius(radius);

			chart.select(".circularAxis")
				.call(circularAxis);

			let radarArea = component.radarArea()
				.radius(radius)
				.colorScale(colorScale)
				.yScale(yScale)
				.xScale(xScale)
				.dispatch(dispatch);

			// Create Radars
			let seriesGroup = chart.select(".radarGroup")
				.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter()
				.append("g")
				.classed("seriesGroup", true)
				.attr("fill", function(d) { return colorScale(d.key); })
				.style("stroke", function(d) { return colorScale(d.key); })
				.merge(seriesGroup)
				.call(radarArea);

			// Creating vertical scale
			let axisScale = d3.scaleLinear()
				.domain(yScale.domain())
				.range(yScale.range().reverse())
				.nice();

			// Render vertical scale on circle
			let verticalAxis = d3.axisLeft(axisScale);
			chart.select(".verticalAxis")
				.attr("transform", "translate(0," + -radius + ")")
				.call(verticalAxis);

			// Adding Circular Labels on Page
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
