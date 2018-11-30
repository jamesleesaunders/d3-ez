import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Circular Axis Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let radius = 150;
	let radialScale;
	let ringScale;

	/**
	 * Constructor
	 */
	function my(selection) {
		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		// Create axis group
		let axisSelect = selection.selectAll(".axis")
			.data([0]);

		let axis = axisSelect.enter()
			.append("g")
			.classed("axis", true)
			.on("click", function(d) { dispatch.call("customClick", this, d); })
			.merge(axisSelect);

		// Outer circle
		let outerCircle = axis.selectAll(".outerCircle")
			.data([radius])
			.enter()
			.append("circle")
			.classed("outerCircle", true)
			.attr("r", function(d) { return d; })
			.style("fill", "none")
			.attr("stroke-width", 2)
			.attr("stroke", "#ddd");

		// Tick Data Generator
		let tickData = function() {
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

			return tickArray.map(function(d) {
				return {
					value: d,
					radius: ringScale(d),
					padding: tickPadding
				}
			});
		};

		let tickCirclesGroupSelect = axis.selectAll(".tickCircles")
			.data(function() { return [tickData()]; });

		let tickCirclesGroup = tickCirclesGroupSelect.enter()
			.append("g")
			.classed("tickCircles", true)
			.merge(tickCirclesGroupSelect);

		let tickCircles = tickCirclesGroup.selectAll("circle")
			.data(function(d) { return d; });

		tickCircles.enter()
			.append("circle")
			.style("fill", "none")
			.attr("stroke-width", 1)
			.attr("stroke", "#ddd")
			.merge(tickCircles)
			.transition()
			.attr("r", function(d) { return (d.radius + d.padding); });

		tickCircles.exit()
			.remove();

		// Spoke Data Generator
		let spokeData = function() {
			let spokeCount = 0;
			let spokeArray = [];
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

			let spokeScale = d3.scaleLinear()
				.domain([0, spokeCount])
				.range(radialScale.range());

			return spokeArray.map(function(d, i) {
				return {
					value: d,
					rotate: spokeScale(i)
				}
			});
		};

		let spokesGroupSelect = axis.selectAll(".spokes")
			.data(function() { return [spokeData()]; });

		let spokesGroup = spokesGroupSelect.enter()
			.append("g")
			.classed("spokes", true)
			.merge(spokesGroupSelect);

		let spokes = spokesGroup.selectAll("line")
			.data(function(d) { return d; });

		spokes.enter()
			.append("line")
			.attr("id", function(d) { return d.value; })
			.attr("y2", -radius)
			.merge(spokes)
			.attr("transform", function(d) {
				return "rotate(" + d.rotate + ")";
			});

		spokes.exit()
			.remove();


	}

	/**
	 * Configuration Getters & Setters
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	my.radialScale = function(_) {
		if (!arguments.length) return radialScale;
		radialScale = _;
		return my;
	};

	my.ringScale = function(_) {
		if (!arguments.length) return ringScale;
		ringScale = _;
		return my;
	};

	return my;
}
