import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Gantt Chart
 * @see http://datavizproject.com/data-type/gannt-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	var svg;
	var chart;
	var classed = "ganttChart";
	var width = 600;
	var height = 400;
	var margin = { top: 20, right: 20, bottom: 40, left: 80 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = d3.ez.palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Chart Dimensions
	 */
	var chartW;
	var chartH;

	/**
	 * Scales
	 */
	var xScale;
	var yScale;
	var colorScale;

	/**
	 * Other Customisation Options
	 */
	var tickFormat = "%d-%b-%y";
	var dateDomainMin;
	var dateDomainMax;

	/**
	 * Initialise Data, Scales and Series
	 */
	var init = function(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		var dataSummary = dataTransform(data).summary();
		var categoryNames = dataSummary.rowKeys;
		var seriesNames = dataSummary.columnKeys;

		// Calculate Start and End Dates
		data.forEach(function(d) {
			d.values.forEach(function(b) {
				dateDomainMin = d3.min([b.startDate, dateDomainMin]);
				dateDomainMax = d3.max([b.endDate, dateDomainMax]);
			});
		});
		var dateDomain = [dateDomainMin, dateDomainMax];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleTime()
			.domain(dateDomain)
			.range([0, chartW])
			.clamp(true);

		yScale = d3.scaleBand()
			.domain(categoryNames)
			.rangeRound([0, chartH])
			.padding(0.1);
	};

	/**
	 * Constructor
	 */
	var my = function(selection) {
		// Create SVG element (if it does not exist already)
		svg = selection.append("svg");
		svg.classed("d3ez", true)
			.attr("width", width)
			.attr("height", height);

		chart = svg.append("g").classed("chart", true);

		// Update the chart dimensions and add layer groups
		var layers = ["ganttBarGroup", "xAxis axis", "yAxis axis"];
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

			// Create bar groups
			var seriesGroup = chart.select(".ganttBarGroup")
				.selectAll(".seriesGroup")
				.data(data)
				.enter()
				.append("g")
				.classed("seriesGroup", true)
				.attr("id", function(d) { return d.key; })
				.attr("transform", function(d) {
					return "translate(0," + yScale(d.key) + ")";
				});

			// Add bars
			var bars = seriesGroup.selectAll(".bar").data(function(d) {
				return d.values;
			});

			bars.enter()
				.append("rect")
				.attr("rx", 3)
				.attr("ry", 3)
				.attr("class", "bar")
				.attr("y", 0)
				.attr("x", function(d) { return xScale(d.startDate); })
				.attr("height", function(d) { return yScale.bandwidth(); })
				.attr("fill", function(d) { return colorScale(d.key); })
				.attr("width", function(d) { return Math.max(1, (xScale(d.endDate) - xScale(d.startDate))); })
				.on("mouseover", function(d) {
					dispatch.call("customValueMouseOver", this, d);
				})
				.on("click", function(d) {
					dispatch.call("customValueClick", this, d);
				})
				.merge(bars)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("x", function(d) { return xScale(d.startDate); })
				.attr("width", function(d) { return Math.max(1, (xScale(d.endDate) - xScale(d.startDate))); });

			var xAxis = d3.axisBottom()
				.scale(xScale)
				.tickFormat(d3.timeFormat(tickFormat))
				.tickSize(8).tickPadding(8);

			chart.select(".xAxis")
				.attr("transform", "translate(0, " + chartH + ")")
				.call(xAxis);

			var yAxis = d3.axisLeft()
				.scale(yScale)
				.tickSize(0);

			chart.select(".yAxis")
				.call(yAxis);
		});
	};

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

	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};

	my.timeDomain = function(_) {
		if (!arguments.length) return [dateDomainMin, dateDomainMax];
		dateDomainMin = _[0];
		dateDomainMax = _[1];
		return this;
	};

	my.tickFormat = function(_) {
		if (!arguments.length) return tickFormat;
		tickFormat = _;
		return this;
	};

	my.dispatch = function(_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	my.on = function() {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
