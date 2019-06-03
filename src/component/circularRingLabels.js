import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Radial Labels Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 300;
	let height = 300;
	let radius;
	let startAngle = 0;
	let endAngle = 360;
	let capitalizeLabels = false;
	let textAnchor = "centre";
	let radialScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias circularRingLabels
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

		const labelsSelect = selection.selectAll(".radialLabels")
			.data([0]);

		const labels = labelsSelect.enter()
			.append("g")
			.classed("radialLabels", true)
			.merge(labelsSelect);

		const radData = radialScale.domain();

		const defSelect = labels.selectAll("def")
			.data(radData);

		defSelect.enter()
			.append("def")
			.append("path")
			.attr("id", (d, i) => ("radialLabelPath" + "-" + i))
			.attr("d", (d) => {
				const r = radialScale(d);
				const arc = d3.arc()
					.outerRadius(r)
					.innerRadius(r);
				const pathConf = {
					startAngle: (startAngle * Math.PI) / 180,
					endAngle: (endAngle * Math.PI) / 180
				};
				const pathStr = arc(pathConf).split(/[A-Z]/);
				return "M" + pathStr[1] + "A" + pathStr[2];
			});

		const textSelect = labels.selectAll("text")
			.data(radData);

		textSelect.enter()
			.append("text")
			.style("text-anchor", "start")
			.attr("dy", -5)
			.attr("dx", 5)
			.append("textPath")
			.attr("xlink:href", (d, i) => ("#radialLabelPath" + "-" + i))
			.attr("startOffset", "0%")
			.text((d) => d);
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
	 * Start Angle Getter / Setter
	 *
	 * @param {number} _v - Angle in degrees.
	 * @returns {*}
	 */
	my.startAngle = function(_v) {
		if (!arguments.length) return startAngle;
		startAngle = _v;
		return this;
	};

	/**
	 * End Angle Getter / Setter
	 *
	 * @param {number} _v - Angle in degrees.
	 * @returns {*}
	 */
	my.endAngle = function(_v) {
		if (!arguments.length) return endAngle;
		endAngle = _v;
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

	return my;
}
