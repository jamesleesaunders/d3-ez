import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Bubble Chart
 * @see http://datavizproject.com/data-type/bubble-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let svg;
	let chart;
	let classed = "bubbleChart";
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
	let sizeScale;
	let colorScale;

	/**
	 * Other Customisation Options
	 */
	let minRadius = 3;
	let maxRadius = 20;
	let yAxisLabel;

	/**
	 * Initialise Data, Scales and Series
	 */
	function init(data) {
		chartW = width - (margin.left + margin.right);
		chartH = height - (margin.top + margin.bottom);

		// Calculate the extents for each series.
		// TODO: Use dataParse() ?
		function extents(key) {
			let serExts = [];
			d3.map(data).values().forEach(function(d) {
				let vals = d.values.map(function(e) {
					return +e[key];
				});
				serExts.push(d3.extent(vals));
			});
			// Merge all the series extents into one array.
			// Calculate overall extent.
			return d3.extent([].concat.apply([], serExts));
		}

		let xDomain = extents("x");
		let yDomain = extents("y");
		let sizeDomain = extents("value");
		let categoryNames = data.map(function(d) {
			return d.key;
		});

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(categoryNames).range(colors) :
			colorScale;

		// If the sizeScale has not been passed then attempt to calculate.
		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain(sizeDomain).range([minRadius, maxRadius]) :
			sizeScale;

		// X & Y Scales
		xScale = d3.scaleLinear()
			.domain(xDomain)
			.range([0, chartW])
			.nice();

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
		let layers = ["zoomArea", "bubbleGroups", "xAxis axis", "yAxis axis"];
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

			// Bubble Chart
			let bubbles = component.bubbles()
				.width(chartW)
				.height(chartH)
				.colorScale(colorScale)
				.xScale(xScale)
				.yScale(yScale)
				.minRadius(minRadius)
				.maxRadius(maxRadius)
				.dispatch(dispatch);

			let bubbleGroups = chart.select(".bubbleGroups")
				.attr('clip-path', function() { return "url(" + window.location + "#plotAreaClip)" })
				.append("g");

			let seriesGroup = bubbleGroups.selectAll(".seriesGroup")
				.data(data);

			seriesGroup.enter()
				.append("g")
				.attr("class", "seriesGroup")
				.merge(seriesGroup)
				.call(bubbles);

			seriesGroup.exit()
				.remove();

			// X Axis
			let xAxis = d3.axisBottom(xScale);

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

			// Zoom
			let zoom = d3.zoom()
				.extent([[0, 0], [chartW, chartH]])
				.scaleExtent([1, 20])
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
				let xScaleZoomed = d3.event.transform.rescaleX(xScale);
				let yScaleZoomed = d3.event.transform.rescaleY(yScale);

				xAxis.scale(xScaleZoomed);
				yAxis.scale(yScaleZoomed);
				bubbles.xScale(xScaleZoomed).yScale(yScaleZoomed);

				chart.select(".xAxis")
					.call(xAxis)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", "rotate(-65)");
				chart.select(".yAxis").call(yAxis);

				bubbleGroups.selectAll(".seriesGroup")
					.call(bubbles);
			}

			chart.select(".yAxis")
				.call(yAxis);
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

	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
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
