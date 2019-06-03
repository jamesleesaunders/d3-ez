import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 *
 * @module
 * @see http://datavizproject.com/data-type/line-chart/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "lineChart";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 40, left: 40 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	let chartW;
	let chartH;

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let yAxisLabel = null;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		const { rowKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];


		// TODO: Use dataTransform() to calculate date domains?
		data.forEach((d, i) => {
			d.values.forEach((b, j) => {
				data[i].values[j].key = new Date(b.key * 1000);
			});
		});
		const dateDomain = d3.extent(data[0].values, (d) => d.key);


		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(rowKeys)
				.range(colors);
		}

		xScale = d3.scaleTime()
			.domain(dateDomain)
			.range([0, chartW]);

		yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([chartH, 0])
			.nice();
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias lineChart
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
		const layers = ["zoomArea", "lineGroups", "xAxis axis", "yAxis axis"];
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

			// Add Clip Path (Proof of Concept)
			chart.append('defs')
				.append('clipPath')
				.attr('id', 'plotAreaClip')
				.append('rect')
				.attr('width', chartW)
				.attr('height', chartH);

			// Line Chart
			const lineChart = component.lineChart()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.dispatch(dispatch);

			// Scatter Plot
			const scatterPlot = component.scatterPlot()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.yScale(yScale)
				.xScale(xScale)
				.dispatch(dispatch);

			const lineGroups = chart.select(".lineGroups")
				.attr('clip-path', "url(" + window.location + "#plotAreaClip)")
				.append("g");

			const seriesGroup = lineGroups.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.style("fill", (d) => colorScale(d.key))
				.merge(seriesGroup)
				.call(lineChart)
				.call(scatterPlot);

			seriesGroup.exit()
				.remove();

			// X Axis
			const xAxis = d3.axisBottom(xScale)
				.tickFormat(d3.timeFormat("%d-%b-%y"));

			chart.select(".xAxis")
				.attr("transform", "translate(0," + chartH + ")")
				.call(xAxis)
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");

			// Y Axis
			const yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "#000000")
				.style("text-anchor", "end")
				.text(yAxisLabel);

			// Zoom
			const zoom = d3.zoom()
				.extent([[0, 0], [chartW, chartH]])
				.scaleExtent([1, 8])
				.translateExtent([[0, 0], [chartW, chartH]])
				.on("zoom", zoomed);

			chart.select(".zoomArea")
				.append("rect")
				.attr("width", chartW)
				.attr("height", chartH)
				.attr("fill", "none")
				.attr("pointer-events", "all")
				.call(zoom);

			function zoomed() {
				const xScaleZoomed = d3.event.transform.rescaleX(xScale);

				xAxis.scale(xScaleZoomed);
				lineChart.xScale(xScaleZoomed);
				scatterPlot.xScale(xScaleZoomed);

				chart.select(".xAxis")
					.call(xAxis)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", "rotate(-65)");

				lineGroups.selectAll(".seriesGroup")
					.call(lineChart)
					.call(scatterPlot);
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
