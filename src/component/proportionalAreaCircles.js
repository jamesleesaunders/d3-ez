import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import componentLabeledNode from "./labeledNode";

/**
 * Reusable Proportional Area Circles Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
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
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, columnKeys, valueExtent } = dataTransform(data).summary();

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(colors);
		}

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, width])
				.padding(0.05);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, height])
				.padding(0.05);
		}

		const sizeExtent = useGlobalScale ? valueExtent : [0, d3.max(data[1]["values"], function(d) {
			return d["value"];
		})];

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(sizeExtent)
				.range([minRadius, maxRadius]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias proportionalAreaCircles
	 * @param {d3.selection} selection - The chart holder D3 selection.
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
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
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
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
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
