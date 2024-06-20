import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";
import { wrap } from "../utils.js";

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
	let margin = { top: 40, right: 40, bottom: 70, left: 70 };
	let colors = palette.categorical(1);
	let transition = { ease: d3.easeLinear, duration: 100 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let title = null;
	let subTitle = null;
	let legendTitle = "Key";
	let opacity = 1;
	let showLegend = false;
	let showAxis = true;
	let yAxisLabel = null;
	let stacking = false;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartVertical
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
			const legendW = showLegend ? 120 : 0;
			const legendH = Math.max(height / 2.5, 100);
			const legendPad = showLegend ? 15 : 0;
			const titleH = title ? 40 : 0;
			const chartW = Math.max((width - margin.left - legendPad - legendW - margin.right), 100);
			const chartH = Math.max((height - margin.top - titleH - margin.bottom), 100);

			// Create Scales and Axis
			let { rowKeys, columnKeys, valueExtent, valueExtentStacked } = dataTransform(data).summary();
			let [valueMin, valueMax] = valueExtent;
			if (stacking) {
				// Sum negative stacked bars
				[valueMin, valueMax] = valueExtentStacked;
			} else {
				// Set min to zero if min is more than zero
				valueMin = valueMin > 0 ? 0 : valueMin;
			}
			const yDomain = [valueMin, valueMax];

			const xScale = d3.scaleLinear()
				.domain(yDomain)
				.range([0, chartW]);

			const yScale2 = d3.scaleBand()
				.domain(rowKeys)
				.range([0, chartH])
				.padding(0.1);

			const yScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, yScale2.bandwidth()])
				.padding(0.15);

			const colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);

			// Add Title, Chart and Legend main layer groups
			const mainLayers = ["title", "chart", "legend"];
			svg.classed("d3ez", true)
				.attr("width", width)
				.attr("height", height)
				.selectAll("g")
				.data(mainLayers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			const titleSelect = svg.select(".title");
			const chartSelect = svg.select(".chart");
			const legendSelect = svg.select(".legend");

			// Update the chart dimensions and layer groups
			const chartLayers = ["xAxis axis", "yAxis axis", "seriesGroup"];
			chartSelect.classed(classed, true)
				.attr("width", chartW)
				.attr("height", chartH)
				.attr("transform", `translate(${margin.left},${margin.top + titleH})`)
				.selectAll("g")
				.data(chartLayers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Bars Component
			const componentBars = component.barsHorizontal()
				.xScale(xScale)
				.colorScale(colorScale)
				.yScale(yScale)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Series Group
			const series = chartSelect.select(".seriesGroup")
				.selectAll(".series")
				.data(data);

			series.enter()
				.append("g")
				.classed("series", true)
				.merge(series)
				.attr("data-name", (d) => d.key)
				.attr("transform", (d) => `translate(${xScale(valueMin)},${yScale2(d.key)})`)
				.call(componentBars);

			series.exit()
				.remove();

			// Axis
			const xAxis = d3.axisBottom(xScale);
			const yAxis = d3.axisLeft(yScale2);
			if (showAxis) {
				// X-Axis
				chartSelect.select(".xAxis")
					.attr("transform", `translate(0,${chartH})`)
					.call(xAxis);

				// Y-Axis
				chartSelect.select(".yAxis")
					.call(yAxis)
					.selectAll("text")
					.call(wrap, margin.left);
			} else {
				chartSelect.selectAll(".axis").selectAll('*').remove();
			}

			// Title
			if (title) {
				const componentTitle = component.title()
					.mainText(title)
					.subText(subTitle);

				titleSelect.attr("transform", `translate(${width / 2},${margin.top})`)
					.call(componentTitle);
			} else {
				titleSelect.selectAll("*").remove();
			}

			// Legend
			if (showLegend) {
				const componentLegend = component.legend()
					.colorScale(colorScale)
					.height(legendH)
					.width(legendW)
					.itemType("rect")
					.opacity(opacity);

				legendSelect.attr("transform", `translate(${margin.left + chartW + legendPad},${margin.top})`)
					.call(componentLegend);
			} else {
				legendSelect.selectAll("*").remove();
			}
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
	 * Show Legend Getter / Setter
	 *
	 * @param {Boolean} _v - Show legend true / false.
	 * @returns {*}
	 */
	my.showLegend = function(_v) {
		if (!arguments.length) return showLegend;
		showLegend = _v;
		return this;
	};

	/**
	 * Title Getter / Setter
	 *
	 * @param {string} _v - Title text.
	 * @returns {*}
	 */
	my.title = function(_v) {
		if (!arguments.length) return title;
		title = _v;
		return this;
	};

	/**
	 * SubTitle Getter / Setter
	 *
	 * @param {string} _v - SubTitle text.
	 * @returns {*}
	 */
	my.subTitle = function(_v) {
		if (!arguments.length) return subTitle;
		subTitle = _v;
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
	 * Stacked Getter / Setter
	 *
	 * @param {Boolean} _v - Stacked or grouped bar chart.
	 * @returns {*}
	 */
	my.stacking = function(_v) {
		if (!arguments.length) return stacking;
		stacking = _v;
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
	 * Y-Axis Label Getter / Setter
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
		const value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
