import * as d3 from "d3";
import component from "../component.js";
import palette from "../palette.js";
import dataTransform from "../dataTransform.js";

/**
 * Rose Chart (aka: Coxcomb Chart; Circumplex Chart; Nightingale Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
export default function() {

	/* Default Properties */
	let classed = "roseChart";
	let width = 700;
	let height = 400;
	let margin = { top: 40, right: 40, bottom: 40, left: 40 };
	let colors = palette.categorical(3);
	let transition = { ease: d3.easeLinear, duration: 100 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Other Customisation Options */
	let title = null;
	let subTitle = null;
	let legendTitle = "Key";
	let opacity = 1;
	let showLegend = false;
	let showAxis = true;
	let stacking = true;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias roseChart
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
			const radius = Math.min(chartW, chartH) / 2.3;
			const innerRadius = 0;

			let { rowKeys, columnKeys, valueMin, valueMax, valueExtentStacked } = dataTransform(data).summary();
			valueMax = stacking ? valueExtentStacked[1] : valueMax;
			valueMin = 0;

			const yDomain = [valueMin, valueMax];

			const xScale = d3.scaleBand()
				.domain(rowKeys)
				.rangeRound([0, 360]);

			const yScale = d3.scaleLinear()
				.domain(yDomain)
				.range([innerRadius, radius]);

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
			const chartLayers = ["axis", "seriesGroup"];
			chartSelect.classed(classed, true)
				.attr("width", chartW)
				.attr("height", chartH)
				.attr("transform", `translate(${margin.left},${margin.top + titleH})`)
				.selectAll("g")
				.data(chartLayers)
				.enter()
				.append("g")
				.attr("class", (d) => d);

			// Rose Sectors
			const componentRoseChartSector = component.roseChartSector()
				.xScale(xScale)
				.yScale(yScale)
				.colorScale(colorScale)
				.stacking(stacking)
				.opacity(opacity)
				.dispatch(dispatch)
				.transition(transition);

			// Circular Axis
			const componentCircularAxis = component.circularAxis()
				.radialScale(xScale)
				.ringScale(yScale);

			// Circular Labels
			const componentCircularSectorLabels = component.circularSectorLabels()
				.ringScale(yScale)
				.radialScale(xScale)
				.textAnchor("middle")
				.capitalizeLabels(true);

			// Create Series Group
			const series = chartSelect.select(".seriesGroup")
				.selectAll(".series")
				.data(data);

			series.enter()
				.append("g")
				.classed("series", true)
				.merge(series)
				.attr("data-name", (d) => d.key)
				.attr("transform", `translate(${chartW / 2},${(chartH / 2)})`)
				.each(function() {
					d3.select(this).call(componentRoseChartSector);
				});

			series.exit()
				.remove();

			// Axis Labels
			if (showAxis) {
				chartSelect.select(".axis")
					.attr("transform", `translate(${chartW / 2},${(chartH / 2)})`)
					.call(componentCircularSectorLabels)
					.call(componentCircularAxis);
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
