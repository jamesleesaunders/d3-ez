import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Heat Map (aka: Heat Table; Density Table; Heat Map)
 *
 * @module
 * @see http://datavizproject.com/data-type/heat-map/
 * @see https://www.atlassian.com/data/charts/heatmap-complete-guide
 */
export default function() {

	/* Default Properties */
	let classed = "heatMap";
	let width = 700;
	let height = 400;
	let margin = { top: 40, right: 40, bottom: 40, left: 40 };
	let colors = palette.diverging(2).slice(0, 5);
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let showAxis = true;
	let thresholds;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMap
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

			const { rowKeys, columnKeys, thresholds: tmpThresholds } = dataTransform(data).summary();

			if (typeof thresholds === "undefined") {
				thresholds = tmpThresholds;
			}

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, chartW])
				.padding(0.15);

			const yScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, chartH])
				.padding(0.15);

			const colorScale = d3.scaleThreshold()
				.domain(thresholds)
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

			const layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Heat Map Row Component
			const heatMapRow = component.heatMapRow()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.merge(seriesGroup)
				.attr("transform", (d) => `translate(0,${yScale(d.key)})`)
				.call(heatMapRow);

			seriesGroup.exit()
				.remove();

			// X-Axis
			const xAxis = d3.axisTop(xScale);

			containerEnter.select(".xAxis")
				.call(xAxis)
				.selectAll("text")
				.attr("y", 0)
				.attr("x", -8)
				.attr("transform", "rotate(60)")
				.style("text-anchor", "end");

			// Y-Axis
			const yAxis = d3.axisLeft(yScale);

			containerEnter.select(".yAxis")
				.call(yAxis);

			containerEnter.selectAll(".axis")
				.attr("opacity", showAxis ? 1 : 0);

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
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
	 * @param {Number} _v - Opacity level.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
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
	my.thresholds = function(_v) {
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
	my.showAxis = function(_v) {
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
