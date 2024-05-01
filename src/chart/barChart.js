import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Bar Chart (Vertical) (aka: Bar Chart; Bar Graph)
 *
 * @module
 * @see http://datavizproject.com/data-type/bar-chart/
 * @see https://www.atlassian.com/data/charts/stacked-bar-chart-complete-guide
 */
export default function() {

	/* Default Properties */
	let classed = "barChart";
	let width = 700;
	let height = 400;
	let margin = { top: 40, right: 40, bottom: 40, left: 40 };
	let colors = palette.categorical(1);
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let opacity = 1;
	let showAxis = true;
	let yAxisLabel = null;
	let stacked = false;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartVertical
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

			// Create Scales and Axis
			let { rowKeys, columnKeys, valueExtent, valueExtentStacked } = dataTransform(data).summary();
			let [valueMin, valueMax] = valueExtent;
			if (stacked) {
				// Sum negative stacked bars
				[valueMin, valueMax] = valueExtentStacked;
			} else {
				// Set min to zero if min is more than zero
				valueMin = valueMin > 0 ? 0 : valueMin;
			}
			const yDomain = [valueMin, valueMax];

			const xScale2 = d3.scaleBand()
				.domain(rowKeys)
				.range([0, chartW])
				.padding(0.2);

			const xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, xScale2.bandwidth()])
				.padding(0.05);

			const yScale = d3.scaleLinear()
				.domain(yDomain)
				.range([chartH, 0]);

			const colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);

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

			const layers = ["xAxis axis", "yAxis axis", "chart", "legend"];
			containerEnter.selectAll("g")
				.data(layers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Bars Component
			const bars = stacked ? component.barsStacked().xScale(xScale2) : component.barsVertical().xScale(xScale)
			bars.colorScale(colorScale)
				.yScale(yScale)
				.opacity(opacity)
				.dispatch(dispatch);

			// Series Group
			const seriesGroup = containerEnter.select(".chart")
				.selectAll(".seriesGroup")
				.data((d) => d);

			seriesGroup.enter()
				.append("g")
				.classed("seriesGroup", true)
				.merge(seriesGroup)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", (d) => {
					const x = xScale2(d.key);
					const y = chartH - yScale(valueMin);
					return `translate(${x},${y})`
				})
				.call(bars);

			seriesGroup.exit()
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.remove();

			// X-Axis
			const xAxis = d3.axisBottom(xScale2);

			containerEnter.select(".xAxis")
				.attr("transform", `translate(0,${chartH})`)
				.call(xAxis);

			// Y-Axis
			const yAxis = d3.axisLeft(yScale);

			containerEnter.select(".yAxis")
				.call(yAxis);

			// Y Axis Label
			containerEnter.select(".yAxis")
				.selectAll(".yAxisLabel")
				.data([yAxisLabel])
				.enter()
				.append("text")
				.classed("yAxisLabel", true)
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "currentColor")
				.style("text-anchor", "end")
				.transition()
				.text((d) => d);

			containerEnter.selectAll(".axis")
				.attr('opacity', showAxis ? 1 : 0);

			// Legend
			const legend = component.legend()
				.colorScale(colorScale)
				.height(legendH)
				.width(legendW)
				.itemType("rect")
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
	 * Stacked Getter / Setter
	 *
	 * @param {Boolean} _v - Stacked or grouped bar chart.
	 * @returns {*}
	 */
	my.stacked = function(_v) {
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
	my.showAxis = function(_v) {
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
	my.yAxisLabel = function(_v) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _v;
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
		const value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
