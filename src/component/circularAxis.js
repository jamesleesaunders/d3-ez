import * as d3 from "d3";

/**
 * Reusable Circular Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "circularAxis";
	let radialScale;
	let ringScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
	let showAxis = false;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias circularAxis
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			const [innerRadius, radius] = ringScale.range();

			// Create axis group
			const axisSelect = d3.select(this)
				.selectAll(`g.${classed}`)
				.data([0]);

			const axis = axisSelect.enter()
				.append("g")
				.classed(classed, true)
				.on("click", function(e, d) {
					dispatch.call("customValueClick", this, e, d);
				})
				.merge(axisSelect);

			// Outer circle
			const outerCircle = axis.selectAll(".outerCircle")
				.data([radius]);

			outerCircle.enter()
				.append("circle")
				.classed("outerCircle", true)
				.merge(outerCircle)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("r", (d) => d)
				.style("fill", "none")
				.attr("stroke-width", 2)
				.attr("stroke", "currentColor");

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
				.attr("stroke", "currentColor")
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", "1,1")
				.attr("opacity", 0.5)
				.merge(tickCircles)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
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

			const spokeGroup = axis.selectAll(".spokes")
				.data(() => [spokeData()]);

			const spokeGroupEnter = spokeGroup.enter()
				.append("g")
				.classed("spokes", true)
				.merge(spokeGroup);

			const spokes = spokeGroupEnter.selectAll("line")
				.data((d) => d);

			spokes.enter()
				.append("line")
				.attr("stroke", "currentColor")
				.attr("stroke-width", 1)
				.attr("stroke-dasharray", "2,2")
				.attr("opacity", 0.5)
				.merge(spokes)
				.attr("transform", (d) => `rotate(${d.rotate})`)
				.attr("y2", -radius);

			spokes.exit()
				.remove();

			if (showAxis) {
				const verticalAxis = d3.axisLeft(ringScale);
				axis.call(verticalAxis)
			}

		});
	}

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

	/**
	 * Show Axis Labels
	 *
	 * @param {boolean} _v - True / False.
	 * @returns {*}
	 */
	my.showAxis = function(_v) {
		if (!arguments.length) return showAxis;
		showAxis = _v;
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

	return my;
}
