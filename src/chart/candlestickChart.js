import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Candlestick Chart (also called: Japanese Candlestick; OHLC Chart; Box Plot)
 *
 * @module
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
export default function() {

	/* Default Properties */
	let svg;
	let chart;
	let classed = "candlestickChart";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 40, left: 40 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = ["green", "red"];
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/* Chart Dimensions */
	let chartW;
	let chartH;

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	/* Other Customisation Options */
	let yAxisLabel;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);


		// TODO: Use dataTransform() to calculate date domains?
		data.values.forEach(function(d, i) {
			// Convert to date
			data.values[i].date = Date.parse(d.date);
		});
		const maxDate = d3.max(data.values, (d) => d.date);
		const minDate = d3.min(data.values, (d) => d.date);

		const ONE_DAY_IN_MILLISECONDS = 86400000;
		const dateDomain = [
			new Date(minDate - ONE_DAY_IN_MILLISECONDS),
			new Date(maxDate + ONE_DAY_IN_MILLISECONDS)
		];


		// TODO: Use dataTransform() to calculate candle min/max?
		const yDomain = [
			d3.min(data.values, (d) => d.low),
			d3.max(data.values, (d) => d.high)
		];


		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain([true, false])
				.range(colors);
		}

		xScale = d3.scaleTime()
			.domain(dateDomain)
			.range([0, chartW]);

		yScale = d3.scaleLinear()
			.domain(yDomain)
			.range([chartH, 0])
			.nice();
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias candlestickChart
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
		const layers = ["zoomArea", "candleSticks", "xAxis axis", "yAxis axis"];
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

			// Candle Sticks
			const candleSticks = component.candleSticks()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.dispatch(dispatch);

			chart.select(".candleSticks")
				.datum(data)
				.call(candleSticks);

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
				.call(yAxis);

			// Y Axis Labels
			const yLabel = chart.select(".yAxis")
				.selectAll(".yAxisLabel")
				.data([data.key]);

			yLabel.enter()
				.append("text")
				.classed("yAxisLabel", true)
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "#000000")
				.style("text-anchor", "end")
				.merge(yLabel)
				.transition()
				.text((d) => d);

			// Experimental Brush
			const brush = d3.brushX()
				.extent([[0, 0], [chartW, chartH]])
				.on("brush start", brushStart)
				.on("brush end", brushEnd);

			chart.select(".zoomArea")
				.call(brush);

			function brushStart() {
				// console.log(this);
			}

			function brushEnd() {
				// console.log(this);
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
