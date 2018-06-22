import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 * @see http://datavizproject.com/data-type/line-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let svg;
	let chart;
	let classed = "lineChart";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 40, left: 40 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
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
	let xScale2;
	let colorScale;

	/**
	 * Other Customisation Options
	 */
	let yAxisLabel = null;

	/**
	 * Initialise Data, Scales and Series
	 */
	function init(data) {
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;

		// Slice Data, calculate totals, max etc.
		let slicedData = dataParse(data);
		let maxValue = slicedData.maxValue;
		let groupNames = slicedData.groupNames;

		// Convert dates
		data.forEach(function(d, i) {
			d.values.forEach(function(b, j) {
				data[i].values[j].key = new Date(b.key * 1000);
			});
		});
		let dateDomain = d3.extent(data[0].values, function(d) { return d.key; });

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(groupNames).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleTime()
			.domain(dateDomain)
			.range([0, chartW]);
			
		xScale2 = d3.scaleTime()
			.domain(dateDomain)
			.range([0, chartW]);
			

		yScale = d3.scaleLinear()
			.domain([0, maxValue])
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
		let layers = ["lineGroups", "xAxis axis", "yAxis axis", "zoomArea"];
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

			// Add Clip Path - Still Proof of Concept
			chart.append('defs')
				.append('clipPath')
				.attr('id', 'plotAreaClip')
				.append('rect')
				.attr('width', chartW)
				.attr('height', chartH);

			// Line Chart
			let lineChart = component.lineChart()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.dispatch(dispatch);

			// Scatter Plot
			let scatterPlot = component.scatterPlot()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.yScale(yScale)
				.xScale(xScale)
				.dispatch(dispatch);

			let lineChartGroup = chart.select(".lineGroups")
				.attr('clip-path', function() { return "url(" + window.location + "#plotAreaClip)" })
				.append("g");

			let seriesGroup = lineChartGroup.selectAll(".seriesGroup")
				.data(function(d) { return d; });

			seriesGroup.enter().append("g")
				.attr("class", "seriesGroup")
				.style("fill", function(d) { return colorScale(d.key); })
				.datum(function(d) { return d; })
				.merge(seriesGroup)
				.call(lineChart)
				.call(scatterPlot);

			seriesGroup.exit()
				.remove();

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
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -40)
				.attr("dy", ".71em")
				.attr("fill", "#000000")
				.style("text-anchor", "end")
				.text(yAxisLabel);

			// Experimental Zoom
			let zoom = d3.zoom()
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

			var line = d3.line().curve(d3.curveCardinal).x(function (d) {
				return xScale(d.key);
			}).y(function (d) {
				return yScale(d.value);
			});
			
			var pathTween = function pathTween(data) {
				var interpolate = d3.scaleQuantile().domain([0, 1]).range(d3.range(1, data.length + 1));
				return function (t) {
					return line(data.slice(0, interpolate(t)));
				};
			};

			function zoomed() {
				var xk = d3.event.transform.rescaleX(xScale2);
				xScale.domain(xk.domain());
				
				chart.select(".xAxis").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");

				lineChartGroup.selectAll(".seriesGroup").selectAll("circle").attr("cx", function (d) {
					return xScale(d.key);
				}).attr("cy", function (d) {
					return yScale(d.value);
				});

				lineChartGroup.selectAll(".seriesGroup").selectAll("path").attr("stroke-width", function () {
					return 1 / d3.event.transform.k;
				}).transition().duration(0).attrTween("d", function(d){
					return pathTween(d.values);
				});
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

	my.yAxisLabel = function(_) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _;
		return this;
	};

	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
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
