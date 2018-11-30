import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import componentLabeledNode from "./labeledNode";

/**
 * Reusable Proportional Area Circles Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 400;
	let height = 100;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
	let colorScale;
	let xScale;
	let yScale;
	let sizeScale;
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let classed = "proportionalAreaCircles";

	let minRadius = 2;
	let maxRadius = 20;
	let useGlobalScale = true;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesNames = dataSummary.columnKeys;
		let minValue = dataSummary.minValue;
		let maxValue = dataSummary.maxValue;

		let valDomain = [minValue, maxValue];
		let sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[1]["values"], function(d) {
			return d["value"];
		})];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain(valDomain).range(colors) :
			colorScale;

		// If the sizeScale has not been passed then attempt to calculate.
		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain(sizeDomain).range([minRadius, maxRadius]) :
			sizeScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).range([0, width]).padding(0.05) :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).range([0, height]).padding(0.05) :
			yScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Calculate cell sizes
			let cellHeight = yScale.bandwidth();
			let cellWidth = xScale.bandwidth();

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			let spot = componentLabeledNode()
				.radius(function(d) { return sizeScale(d.value); })
				.color(function(d) { return colorScale(d.value); })
				.label(function(d) { return d.value; })
				.display("none")
				.stroke(1, "#cccccc")
				.classed("punchSpot")
				.dispatch(dispatch);

			// Add spots to series
			let spots = seriesGroup.selectAll(".punchSpot")
				.data(function(d) { return d.values; });

			spots.enter()
				.append("g")
				.call(spot)
				.attr("transform", function(d) {
					return "translate(" + (cellWidth / 2 + xScale(d.key)) + "," + (cellHeight / 2) + ")";
				})
				.on("mouseover", function(d) {
					d3.select(this).select("text").style("display", "block");
					dispatch.call("customValueMouseOver", this, d);
				})
				.on("mouseout", function() {
					d3.select(this).select("text").style("display", "none");
				})
				.on("click", function(d) {
					dispatch.call("customValueClick", this, d);
				})
				.merge(spots);

			/*
			spots.enter()
			  .append("circle")
			  .attr("class", "punchSpot")
			  .attr("cx", function(d) { return (cellWidth / 2 + xScale(d.key)); })
			  .attr("cy", function(d) { return (cellHeight / 2); })
			  .attr("r", 0)
			  .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
			  .on("click", function(d) { dispatch.call("customValueClick", this, d); })
			  .merge(spots)
			  .transition()
			  .duration(transition.duration)
			  .attr("fill", function(d) { return colorScale(d.value); })
			  .attr("r", function(d) { return sizeScale(d['value']); });
			*/

			spots.exit()
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

	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
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
