import * as d3 from "d3";

/**
 * Reusable Circular Sector Labels Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "circularSectorLabels";
	let radialScale;
	let ringScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let capitalizeLabels = false;
	let textAnchor = "middle";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias circularSectorLabels
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			textAnchor = "start"; // FIXME: Temporarily forcing labels to start as they get chopped off with middle.

			const [innerRadius, radius] = ringScale.range();

			// Tick Data Generator
			const tickData = function() {
				let tickCount = 0;
				let tickArray = [];

				if (typeof radialScale.ticks === "function") {
					// scaleLinear
					const min = d3.min(radialScale.domain());
					const max = d3.max(radialScale.domain());
					tickCount = radialScale.ticks().length;
					const tickIncrement = (max - min) / tickCount;
					for (let i = 0; i <= tickCount; i++) {
						tickArray[i] = (tickIncrement * i).toFixed(0);
					}
				} else {
					// scaleBand / scalePoint
					tickArray = radialScale.domain();
					tickCount = tickArray.length;
				}

				const tickScale = d3.scaleLinear()
					.domain([0, tickCount])
					.range(radialScale.range());

				return tickArray.map((d, i) => ({
						value: d,
						offset: (tickScale(i) / 360) * 100
					}
				));
			};

			const element = d3.select(this);

			// Unique id so that the text path defs are unique - is there a better way to do this?
			const uId = "uid-" + Math.floor(1000 + Math.random() * 9000);

			const labels = element
				.selectAll(`g.${classed}`)
				.data(() => [tickData()]);

			const labelsEnter = labels.enter()
				.append("g")
				.classed(classed, true)
				.attr("transform", () => {
					let offset = 0;
					if (typeof radialScale.ticks !== "function") {
						offset = radialScale.bandwidth() / 2;
					}
					return `rotate(${offset})`;
				})
				.merge(labels);

			// Labels
			const def = labelsEnter.selectAll("def")
				.data([radius]);

			def.enter()
				.append("def")
				.append("path")
				.attr("id", () => `${uId}-path`)
				.attr("d", (d) => {
					// Add a little padding
					const r = d * 1.04;
					return "m0 " + -r + " a" + r + " " + r + " 0 1,1 -0.01 0";
				})
				.merge(def)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.select("path")
				.attr("id", () => `${uId}-path`)
				.attr("d", (d) => {
					// Add a little padding
					const r = d * 1.04;
					return "m0 " + -r + " a" + r + " " + r + " 0 1,1 -0.01 0";
				});

			def.exit()
				.remove();

			const text = labelsEnter.selectAll(".label")
				.data((d) => d);

			text.enter()
				.append("text")
				.classed("label", true)
				.attr("font-size", "0.9em")
				.attr("color", "currentColor")
				.style("text-anchor", textAnchor)
				.append("textPath")
				.attr("xlink:href", () => `#${uId}-path`)
				.text((d) => {
					const text = d.value;
					return capitalizeLabels ? text.toUpperCase() : text;
				})
				.attr("startOffset", (d) => d.offset + "%")
				.attr("fill", "currentColor")
				.merge(text)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.select("textPath")
				.text((d) => {
					const text = d.value;
					return capitalizeLabels ? text.toUpperCase() : text;
				})
				.attr("xlink:href", () => `#${uId}-path`)
				.attr("startOffset", (d) => d.offset + "%")
				.attr("id", (d) => d.value);

			text.exit()
				.remove();
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
		return this;
	};

	/**
	 * Capital Label Getter / Setter
	 *
	 * @param {boolean} _v - Capitalize labels.
	 * @returns {*}
	 */
	my.capitalizeLabels = function(_v) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _v;
		return this;
	};

	/**
	 * Text Anchor Getter / Setter
	 *
	 * @param {string} _v - Anchor name.
	 * @returns {*}
	 */
	my.textAnchor = function(_v) {
		if (!arguments.length) return textAnchor;
		textAnchor = _v;
		return this;
	};

	return my;
}
