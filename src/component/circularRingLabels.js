import * as d3 from "d3";

/**
 * Reusable Circular Ring Labels Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "circularRingLabels";
	let radialScale;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let capitalizeLabels = false;
	let textAnchor = "middle";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias circularRingLabels
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			const pathGen = function(d) {
				const r = radialScale(d);
				const arc = d3.arc()
					.outerRadius(r)
					.innerRadius(r);

				const pathConf = {
					startAngle: (0 * Math.PI) / 180,
					endAngle: (360 * Math.PI) / 180
				};

				const pathStr = arc(pathConf).split(/[A-Z]/);
				return "M" + pathStr[1] + "A" + pathStr[2];
			};

			const element = d3.select(this);

			const uId = "uid-" + Math.floor(1000 + Math.random() * 9000);

			const labels = element
				.selectAll(`g.${classed}`)
				.data([0]);

			const labelsEnter = labels.enter()
				.append("g")
				.classed(classed, true)
				.merge(labels);

			const radData = radialScale.domain();

			const def = labelsEnter.selectAll("def")
				.data(radData);

			def.enter()
				.append("def")
				.append("path")
				.attr("id", (d, i) => {
					return `${uId}-path-${i}`;
				})
				.attr("d", (d) => pathGen(d))
				.merge(def)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.select("path")
				.attr("d", (d) => pathGen(d))
				.attr("id", (d, i) => {
					return `${uId}-path-${i}`;
				})

			const text = labelsEnter.selectAll("text")
				.data(radData);

			text.enter()
				.append("text")
				.style("text-anchor", "start")
				.attr("dy", -2)
				.attr("dx", 5)
				.append("textPath")
				.attr("xlink:href", (d, i) => {
					return `#${uId}-path-${i}`;
				})
				.attr("startOffset", "0%")
				.attr("font-size", (d) => {
					let fontPx = radialScale.bandwidth() * 0.5;
					return `${fontPx}px`;
				})
				.text((d) => d)
				.merge(text)
				.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.select("textPath")
				.attr("font-size", (d) => {
					let fontPx = radialScale.bandwidth() * 0.5;
					return `${fontPx}px`;
				})
				.attr("xlink:href", (d, i) => {
					return `#${uId}-path-${i}`;
				});

			text.exit()
				.remove()
		});
	}

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
