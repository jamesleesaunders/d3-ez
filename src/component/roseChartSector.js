import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Rose Chart Sector
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let radius;
	let startAngle = 0;
	let endAngle = 45;
	let colors = palette.categorical(3);
	let colorScale;
	let xScale;
	let yScale;
	let stacked = false;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "roseChartSector";

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let slicedData = dataParse(data);
		let categoryNames = slicedData.categoryNames;
		let maxValue = stacked ? slicedData.groupTotalsMax : slicedData.maxValue;

		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(categoryNames).range(colors) :
			colorScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, radius]) :
			yScale;

		// If the xScale has been passed then re-calculate the start and end angles.
		if (typeof xScale !== "undefined") {
			startAngle = xScale(data.key);
			endAngle = xScale(data.key) + xScale.bandwidth();
		}
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {
			// Stack Generator
			let stacker = function(data) {
				// Calculate inner and outer radius values
				let series = [];
				let innerRadius = 0;
				let outerRadius = 0;
				data.forEach(function(d, i) {
					outerRadius = innerRadius + d.value;
					series[i] = {
						key: d.key,
						value: d.value,
						innerRadius: yScale(innerRadius),
						outerRadius: yScale(outerRadius)
					};
					innerRadius += (stacked ? d.value : 0);
				});

				return series;
			};

			// Arc Generator
			let arc = d3.arc()
				.innerRadius(function(d) { return d.innerRadius; })
				.outerRadius(function(d) { return d.outerRadius; })
				.startAngle(startAngle * (Math.PI / 180))
				.endAngle(endAngle * (Math.PI / 180));

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add arcs to series group
			let arcs = seriesGroup.selectAll(".arc")
				.data(function(d) { return stacker(d.values); });

			arcs.enter()
				.append("path")
				.classed("arc", true)
				.attr("fill", function(d) { return colorScale(d.key); })
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d); })
				.merge(arcs)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("d", arc);

			arcs.exit()
				.transition()
				.style("opacity", 0)
				.remove();
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

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	my.startAngle = function(_) {
		if (!arguments.length) return startAngle;
		startAngle = _;
		return this;
	};

	my.endAngle = function(_) {
		if (!arguments.length) return endAngle;
		endAngle = _;
		return this;
	};

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.stacked = function(_) {
		if (!arguments.length) return stacked;
		stacked = _;
		return my;
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
