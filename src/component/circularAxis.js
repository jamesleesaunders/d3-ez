import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Circular Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let radius;
	let radialScale;
	let ringScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias circularAxis
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		// Create axis group
		const axisSelect = selection.selectAll(".axis")
			.data([0]);

		const axis = axisSelect.enter()
			.append("g")
			.classed("axis", true)
			.on("click", function(d) { dispatch.call("customClick", this, d); })
			.merge(axisSelect);

		// Outer circle
		const outerCircle = axis.selectAll(".outerCircle")
			.data([radius])
			.enter()
			.append("circle")
			.classed("outerCircle", true)
			.attr("r", (d) => d)
			.style("fill", "none")
			.attr("stroke-width", 2)
			.attr("stroke", "#ddd");

		// Tick Data Generator
		const tickData = function() {
			let tickArray, tickPadding;
			if (typeof ringScale.ticks === "function") {
				// scaleLinear
				tickArray = ringScale.ticks();
				tickPadding = 0;
			} else {
				// scaleBand
				tickArray = ringScale.domain();
				tickPadding = ringScale.bandwidth() / 2;
			}

			return tickArray.map((d) => ({
					value: d,
					radius: ringScale(d),
					padding: tickPadding
				}
			));
		};

		const tickCirclesGroupSelect = axis.selectAll(".tickCircles")
			.data(() => [tickData()]);

		const tickCirclesGroup = tickCirclesGroupSelect.enter()
			.append("g")
			.classed("tickCircles", true)
			.merge(tickCirclesGroupSelect);

		const tickCircles = tickCirclesGroup.selectAll("circle")
			.data((d) => d);

		tickCircles.enter()
			.append("circle")
			.style("fill", "none")
			.attr("stroke-width", 1)
			.attr("stroke", "#ddd")
			.merge(tickCircles)
			.transition()
			.attr("r", (d) => (d.radius + d.padding));

		tickCircles.exit()
			.remove();

		// Spoke Data Generator
		const spokeData = function() {
			let spokeArray = [];
			let spokeCount = 0;
			if (typeof radialScale.ticks === "function") {
				// scaleLinear
				let min = d3.min(radialScale.domain());
				let max = d3.max(radialScale.domain());
				spokeCount = radialScale.ticks().length;
				let spokeIncrement = (max - min) / spokeCount;
				for (let i = 0; i <= spokeCount; i++) {
					spokeArray[i] = (spokeIncrement * i).toFixed(0);
				}
			} else {
				// scaleBand
				spokeArray = radialScale.domain();
				spokeCount = spokeArray.length;
				spokeArray.push("");
			}

			const spokeScale = d3.scaleLinear()
				.domain([0, spokeCount])
				.range(radialScale.range());

			return spokeArray.map((d, i) => ({
					value: d,
					rotate: spokeScale(i)
				}
			));
		};

		const spokesGroupSelect = axis.selectAll(".spokes")
			.data(() => [spokeData()]);

		const spokesGroup = spokesGroupSelect.enter()
			.append("g")
			.classed("spokes", true)
			.merge(spokesGroupSelect);

		const spokes = spokesGroup.selectAll("line")
			.data((d) => d);

		spokes.enter()
			.append("line")
			.attr("id", (d) => d.value)
			.attr("y2", -radius)
			.merge(spokes)
			.attr("transform", (d) => "rotate(" + d.rotate + ")");

		spokes.exit()
			.remove();
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - Width in px.
	 * @returns {*}
	 */
	my.height = function(_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _v - Height in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
	 * Radius Getter / Setter
	 *
	 * @param {number} _v - Radius in px.
	 * @returns {*}
	 */
	my.radius = function(_v) {
		if (!arguments.length) return radius;
		radius = _v;
		return this;
	};

	/**
	 * Radial Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.radialScale = function(_v) {
		if (!arguments.length) return radialScale;
		radialScale = _v;
		return my;
	};

	/**
	 * Ring Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.ringScale = function(_v) {
		if (!arguments.length) return ringScale;
		ringScale = _v;
		return my;
	};

	return my;
}
