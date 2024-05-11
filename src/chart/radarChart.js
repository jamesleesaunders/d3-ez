import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Radar Chart (aka: Spider Chart; Web Chart; Star Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/radar-diagram/
 */
export default function() {

	/* Default Properties */
	let classed = "radarChart";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.categorical(3);
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let startAngle = 0;
	let endAngle = 360;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias radarChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		const svg = (function(selection) {
			const el = selection._groups[0][0];
			if (!!el.ownerSVGElement || el.tagName === "svg") {
				return selection;
			} else {
				let svgSelection = selection.selectAll("svg").data((d) => [d]);
				return svgSelection.enter().append("svg").merge(svgSelection);
			}
		})(selection);

		selection.each(function(data) {
			// Set up margins and dimensions for the chart
			const legendW = 120;
			const legendPad = 15;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);
			const radius = Math.min(chartW, chartH) / 2.5;

			const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
			const valueExtent = [0, valueMax];

			const xScale = d3.scalePoint()
				.domain(columnKeys)
				.range([startAngle, endAngle]);

			const yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, radius])
				.nice();

			const colorScale = d3.scaleOrdinal()
				.domain(rowKeys)
				.range(colors);

			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height);

			// Update the chart dimensions and container and layer groups
			const container = svg.selectAll(".container")
				.data([data]);

			container.exit()
				.remove();

			const containerEnter = container.enter()
				.append("g")
				.classed("container", true)
				.classed(classed, true)
				.merge(container)
				.attr("transform", `translate(${margin.left},${margin.top})`)
				.attr("width", chartW)
				.attr("height", chartH);

			// Update the chart dimensions and container and layer groups
			const layers = ["axis", "chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Radar Component
			const radarArea = component.radarArea()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Circular Axis
			const circularAxis = component.circularAxis()
				.radialScale(xScale)
				.ringScale(yScale)
				.showAxis(false);

			// Circular Labels
			const circularSectorLabels = component.circularSectorLabels()
				.ringScale(yScale)
				.radialScale(xScale)
				.textAnchor("middle");

			// Create Radars
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.classed("seriesGroup", true)
				.attr("fill", (d) => colorScale(d.key))
				.style("stroke", (d) => colorScale(d.key))
				.merge(seriesGroup)
				.call(radarArea)
				.attr("transform", `translate(${chartW / 2},${chartH / 2})`);

			containerEnter.select(".axis")
				.attr("transform", `translate(${chartW / 2},${chartH / 2})`)
				.call(circularSectorLabels)
				.call(circularAxis);

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.itemType("rect")
				.opacity(opacity);

			containerEnter.select(".legend")
				.attr("transform", `translate(${chartW + legendPad},0)`)
				.call(legend);
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
	 * Opacity Getter / Setter
	 *
	 * @param {number} _v - Opacity 0 -1.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
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
	 * On Event Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
