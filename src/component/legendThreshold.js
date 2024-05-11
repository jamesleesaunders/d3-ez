import * as d3 from "d3";

/**
 * Reusable Threshold Legend Component
 *
 * @module
 * @see https://bl.ocks.org/mbostock/4573883
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 150;
	let thresholdScale;
	let opacity = 1;
	let transition = { ease: d3.easeBounce, duration: 0 };

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legendThreshold
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		height = (height ? height : this.attr("height"));
		width = (width ? width : this.attr("width"));

		const domainMin = d3.min(thresholdScale.domain());
		const domainMax = d3.max(thresholdScale.domain());
		const domainMargin = (domainMax - domainMin) * 0.1;

		const x = d3.scaleLinear()
			.domain([domainMin - domainMargin, domainMax + domainMargin])
			.range([0, height]);

		// Legend Container
		const legendContainer = selection.selectAll(".legendContainer")
			.data([0]);

		const legendContainerEnter = legendContainer.enter()
			.append("g")
			.classed("legendContainer", true)
			.attr("width", width)
			.attr("height", height)
			.merge(legendContainer);

		// Use D3 Axis to generate scale ticks
		const axis = d3.axisRight(x)
			.tickSize(30)
			.tickValues(thresholdScale.domain());

		legendContainerEnter.transition()
			.ease(transition.ease)
			.duration(transition.duration)
			.call(axis)
			.selectAll(".domain")
			.attr("opacity", 0);

		const colors = legendContainerEnter.selectAll("rect")
			.data(thresholdScale.range().map((color) => {
				const d = thresholdScale.invertExtent(color);
				if (typeof d[0] === "undefined") d[0] = x.domain()[0];
				if (typeof d[1] === "undefined") d[1] = x.domain()[1];
				return d;
			}));

		colors.enter()
			.append("rect")
			.merge(colors)
			.transition()
			.ease(transition.ease)
			.duration(transition.duration)
			.attr("width", 20)
			.attr("y", (d) => x(d[0]))
			.attr("height", (d) => x(d[1]) - x(d[0]))
			.style("fill", (d) => thresholdScale(d[0]))
			.attr("fill-opacity", opacity)
			.attr("stroke", (d) => thresholdScale(d[0]))
			.attr("stroke-width", 1);
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
		return my;
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
		return my;
	};

	/**
	 * Threshold Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.thresholdScale = function(_v) {
		if (!arguments.length) return thresholdScale;
		thresholdScale = _v;
		return my;
	};

	/**
	 * Transition Getter / Setter XX
	 *
	 * @param {d3.transition} _v - Transition.
	 * @returns {*}
	 */
	my.transition = function(_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	/**
	 * Opacity Getter / Setter
	 *
	 * @param {number} _v - Opacity 0 -1.
	 * @returns {*}
	 */
	my.opacity = function(_v) {
		if (!arguments.length) return opacity;
		opacity = _v;
		return this;
	};

	/**
	 * Transition Getter / Setter
	 *
	 * @param {d3.transition} _v - Transition.
	 * @returns {*}
	 */
	my.transition = function(_v) {
		if (!arguments.length) return transition;
		transition = _v;
		return this;
	};

	return my;
}
