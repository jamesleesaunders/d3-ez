import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";
import palette from "../palette";

/**
 * Radial Heat Map (aka: Circular Heat Map)
 *
 * @module
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
export default function() {

	/* Default Properties */
	let classed = "heatMapRadial";
	let width = 700;
	let height = 400;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let colors = palette.diverging(2).slice(0, 5);
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let startAngle = 0;
	let endAngle = 270;
	let thresholds;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias heatMapRadial
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function(data) {
			// Set up margins and dimensions for the chart
			const legendW = 120;
			const legendPad = 15;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - margin.bottom), 100);
			const legendH = Math.max(chartH / 2, 100);
			const radius = Math.min(chartW, chartH) / 2;
			const innerRadius = radius / 4;

			const { rowKeys, columnKeys, thresholds: tmpThresholds } = dataTransform(data).summary();

			if (typeof thresholds === "undefined") {
				thresholds = tmpThresholds;
			}

			const colorScale = d3.scaleThreshold()
				.domain(thresholds)
				.range(colors);

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([startAngle, endAngle])
				.padding(0.1);

			const yScale = d3.scaleBand()
				.domain(rowKeys)
				.rangeRound([innerRadius, radius])
				.padding(0.1);

			// Create SVG element (if it does not exist already)
			const svg = (function(selection) {
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

			// Update the chart dimensions and container and layer groups
			const container = svg.selectAll(".container")
				.data([data]);

			container.exit().remove();

			const containerEnter = container.enter()
				.append("g")
				.classed("container", true)
				.classed(classed, true)
				.merge(container)
				.attr("transform", `translate(${margin.left},${margin.top})`)
				.attr("width", chartW)
				.attr("height", chartH);

			const layers = ["axis", "chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Heat Map Rings
			const heatMapRing = component.heatMapRing()
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.opacity(opacity)
				.dispatch(dispatch);

			// Circular Labels
			const circularSectorLabels = component.circularSectorLabels()
				.ringScale(yScale)
				.radialScale(xScale)
				.textAnchor("start");

			// Ring Labels
			const circularRingLabels = component.circularRingLabels()
				.radialScale(yScale)
				.textAnchor("middle");

			// Create Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.merge(seriesGroup)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", "translate(" + (chartW / 2) + "," + (chartH / 2) + ")")
				.call(heatMapRing)
				.call(circularRingLabels);

			seriesGroup.exit()
				.remove();

			// Outer Ring Labels
			containerEnter.select(".axis")
				.attr("transform", "translate(" + (chartW / 2) + "," + (chartH / 2) + ")")
				.call(circularSectorLabels);

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.opacity(opacity);

			containerEnter.select(".legend")
				.attr("transform", `translate(${chartW + legendPad}, 0)`)
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
	 * Thresholds Getter / Setter
	 *
	 * @param {Array} _v - Array of thresholds.
	 * @returns {*}
	 */
	my.thresholds = function(_v) {
		if (!arguments.length) return thresholds;
		thresholds = _v;
		return my;
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
