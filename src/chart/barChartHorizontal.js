import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Bar Chart (horizontal) (also called: Bar Chart; Bar Graph)
 * @see http://datavizproject.com/data-type/bar-chart/
 */
export default function() {

	/**
  * Default Properties
  */
	var svg = void 0;
	var chart = void 0;
	var classed = "barChartHorizontal";
	var width = 400;
	var height = 300;
	var margin = { top: 20, right: 20, bottom: 20, left: 40 };
	var transition = { ease: d3.easeBounce, duration: 500 };
	var colors = palette.categorical(3);
	var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
  * Chart Dimensions
  */
	var chartW = void 0;
	var chartH = void 0;

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data, Scales and Series
  */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// Slice Data, calculate totals, max etc.
		var slicedData = dataParse(data);
		var categoryNames = slicedData.categoryNames;
		var maxValue = slicedData.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(categoryNames).range(colors) : colorScale;

		// X & Y Scales
		
		yScale = d3.scaleBand().domain(categoryNames).rangeRound([0, chartH]).padding(0.15);

		xScale = d3.scaleLinear().domain([0, maxValue]).range([chartW, 0]).nice();
	}

	/**
  * Constructor
  */
	function my(selection) {
		// Create SVG element (if it does not exist already)
		if (!svg) {
			svg = function (selection) {
				var el = selection._groups[0][0];
				if (!!el.ownerSVGElement || el.tagName === "svg") {
					return selection;
				} else {
					return selection.append("svg");
				}
			}(selection);

			svg.classed("d3ez", true).attr("width", width).attr("height", height);

			chart = svg.append("g").classed("chart", true);
		} else {
			chart = selection.select(".chart");
		}

		// Update the chart dimensions and add layer groups
		var layers = ["barsHorizontal", "xAxis axis", "yAxis axis"];
		chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH).selectAll("g").data(layers).enter().append("g").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			// Initialise Data
			init(data);

			// Horizontal Bars
			var barsHorizontal = component.barsHorizontal().width(chartW).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale)
			.dispatch(dispatch);

			
			chart.select(".barsHorizontal").datum(data).call(barsHorizontal);

			// X Axis
			var xAxis = d3.axisBottom(xScale);

			chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);

			// Y Axis
			var yAxis = d3.axisLeft(yScale);

			chart.select(".yAxis").call(yAxis);

			// Y Axis Label
			var ylabel = chart.select(".yAxis").selectAll(".yAxisLabel").data([data.key]);

			ylabel.enter().append("text").classed("yAxisLabel", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").merge(ylabel).transition().text(function (d) {
				return d;
			});
		});
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return this;
	};

	my.transition = function (_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};

	my.dispatch = function (_) {
		if (!arguments.length) return dispatch();
		dispatch = _;
		return this;
	};

	my.on = function () {
		var value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
