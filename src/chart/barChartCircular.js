import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Circular Bar Chart (also called: Progress Chart)
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let svg;
	let chart;
	let classed = "barChartCircular";
	let width = 400;
	let height = 300;
	let margin = { top: 20, right: 20, bottom: 20, left: 20 };
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

	/**
	 * Chart Dimensions
	 */
	let chartW;
	let chartH;
	let radius;
	let innerRadius;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Other Customisation Options
	 */
	let startAngle = 0;
	let endAngle = 270;

	/**
	 * Initialise Data, Scales and Series
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(chartW, chartH) / 2) :
			radius;

		innerRadius = (typeof innerRadius === "undefined") ?
			(radius / 4) :
			innerRadius;

		// Slice Data, calculate totals, max etc.
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// X & Y Scales
		xScale = d3.scaleBand()
			.domain(seriesNames)
			.rangeRound([innerRadius, radius])
			.padding(0.15);

		yScale = d3.scaleLinear()
			.domain([maxValue, 0])
			.range([startAngle, endAngle]);
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
		let layers = ["circularAxis", "barsCircular", "circularSectorLabels", "circularRingLabels"];
		chart.classed(classed, true)
			.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
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

			// Circular Axis
			let circularAxis = component.circularAxis()
				.radius(radius)
				.radialScale(yScale)
				.ringScale(xScale);

			chart.select(".circularAxis")
				.call(circularAxis);

			// Radial Bars
			let barsCircular = component.barsCircular()
				.radius(radius)
				.innerRadius(innerRadius)
				.colorScale(colorScale)
				.xScale(xScale)
				.dispatch(dispatch);

			chart.select(".barsCircular")
				.datum(data)
				.call(barsCircular);

			// Outer Labels
			let circularSectorLabels = component.circularSectorLabels()
				.radius(radius * 1.04)
				.radialScale(yScale)
				.textAnchor("middle");

			chart.select(".circularSectorLabels")
				.call(circularSectorLabels);

			// Ring Labels
			let circularRingLabels = component.circularRingLabels()
				.radialScale(xScale)
				.textAnchor("middle");

			chart.select(".circularRingLabels")
				.call(circularRingLabels);

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

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	my.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
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
