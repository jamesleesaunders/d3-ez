import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Candlestick Chart (also called: Japanese Candlestick; OHLC Chart; Box Plot)
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let svg;
	let chart;
	let classed = "candlestickChart";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 40, left: 40 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = ["green", "red"];
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Chart Dimensions
	 */
	let chartW;
	let chartH;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Other Customisation Options
	 */
	let yAxisLabel;

	/**
	 * Initialise Data, Scales and Series
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// Convert dates
		data.values.forEach(function(d, i) {
			data.values[i].date = Date.parse(d.date);
		});

		// Slice Data, calculate totals, max etc.
		let maxDate = d3.max(data.values, function(d) {
			return d.date;
		});
		let minDate = d3.min(data.values, function(d) {
			return d.date;
		});
		let xDomain = [
			new Date(minDate - 8.64e7),
			new Date(maxDate + 8.64e7)
		];
		let yDomain = [
			d3.min(data.values, function(d) { return d.low; }),
			d3.max(data.values, function(d) { return d.high; })
		];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain([true, false]).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleTime()
			.domain(xDomain)
			.range([0, chartW]);

		yScale = d3.scaleLinear()
			.domain(yDomain)
			.range([chartH, 0])
			.nice();
	}

	/**
	 * Constructor
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
		let layers = ["zoomArea", "candleSticks", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
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

			// Candle Sticks
			let candleSticks = component.candleSticks()
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
			let xAxis = d3.axisBottom(xScale)
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
			let yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis")
				.call(yAxis);

			// Y Axis Labels
			let yLabel = chart.select(".yAxis")
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
				.text(function(d) {
					return (d);
				});

			// Experimental Brush
			let brush = d3.brushX()
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
	 * Configuration Getters & Setters
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return this;
	};

	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};

	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
