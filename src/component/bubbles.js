import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";
import componentLabeledNode from "./labeledNode";

/**
 * Reusable Scatter Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeLinear, duration: 0 };
	let colors = palette.categorical(3);
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let xScale;
	let yScale;
	let colorScale;
	let sizeScale;
	let classed = "bubbles";

	let minRadius = 10;
	let maxRadius = 20;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		// Calculate the extents for each series.
		// TODO: use dataTransform() ?
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
		let seriesNames = data.map(function(d) {
			return d.key;
		});

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// If the sizeScale has not been passed then attempt to calculate.
		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain(sizeDomain).range([minRadius, maxRadius]) :
			sizeScale;

		// If the xScale has not been passed then attempt to calculate.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain(xDomain).range([0, width]).nice() :
			xScale;

		// If the yScale has not been passed then attempt to calculate.
		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain(yDomain).range([height, 0]).nice() :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubbles
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init(selection.data());
		selection.each(function() {

			// Update series group
			let seriesGroup = d3.select(this);
			seriesGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; })
				.on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
				.on("click", function(d) { dispatch.call("customSeriesClick", this, d); });

			// Add bubbles to series
			let bubble = componentLabeledNode()
				.radius(function(d) { return sizeScale(d.value); })
				.color(function(d) { return colorScale(d.series); })
				.label(function(d) { return d.key; })
				.stroke(1, "white")
				.display("none")
				.classed("bubble")
				.dispatch(dispatch);

			let bubbles = seriesGroup.selectAll(".bubble")
				.data(function(d) { return d.values; });

			bubbles.enter()
				.append("g")
				.attr("transform", function(d) {
					return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
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
				.call(bubble)
				.merge(bubbles)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("transform", function(d) {
					return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
				});

			/*
			bubbles.enter()
				.append("circle")
				.attr("class", "bubble")
				.attr("cx", function(d) { return xScale(d.x); })
				.attr("cy", function(d) { return yScale(d.y); })
				.attr("r", function(d) { return sizeScale(d.value); })
				.style("fill", function(d) { return colorScale(d.series); })
				.on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.value); })
				.on("click", function(d) { dispatch.call("customValueClick", this, d.value); })
				.merge(bubbles)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("cx", function(d) { return xScale(d.x); })
				.attr("cy", function(d) { return yScale(d.y); })
				.attr("r", function(d) { return sizeScale(d.value); });
			*/

			bubbles.exit()
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Min Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.minRadius = function(_v) {
		if (!arguments.length) return minRadius;
		minRadius = _v;
		return this;
	};

	/**
	 * Max Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.maxRadius = function(_v) {
		if (!arguments.length) return maxRadius;
		maxRadius = _v;
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
