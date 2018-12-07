import * as d3 from "d3";
import palette from "../palette";
import dataTransform from "../dataTransform";

/**
 * Reusable Circular Labels Component
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
	 * @alias circularSectorLabels
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		if (typeof radius === "undefined") {
			radius = Math.min(width, height) / 2;
		}

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
				// scaleBand
				tickArray = radialScale.domain();
				tickCount = tickArray.length;
			}

			const tickScale = d3.scaleLinear()
				.domain([0, tickCount])
				.range(radialScale.range());

			return tickArray.map((d, i) => ({
					value: d,
					offset: ((tickScale(i) / 360) * 100)
				}
			));
		};

		// Unique id so that the text path defs are unique - is there a better way to do this?
		const uId = selection.attr("id") ?
			selection.attr("id") :
			"uid-" + Math.floor(1000 + Math.random() * 9000);
		selection.attr("id", uId);

		const labelsSelect = selection.selectAll(".circularLabels")
			.data(() => [tickData()]);

		const labels = labelsSelect.enter()
			.append("g")
			.classed("circularLabels", true)
			.merge(labelsSelect);

		// Labels
		const defSelect = labels.selectAll("def")
			.data([radius]);

		defSelect.enter()
			.append("def")
			.append("path")
			.attr("id", () => {
				const pathId = selection.attr("id") + "-path";
				return pathId;
			})
			.attr("d", (d) => ("m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0"))
			.merge(defSelect);

		defSelect.exit()
			.remove();

		const textSelect = labels.selectAll("text")
			.data((d) => d);

		textSelect.enter()
			.append("text")
			.style("text-anchor", textAnchor)
			.append("textPath")
			.attr("xlink:href", () => {
				const pathId = selection.attr("id") + "-path";
				return "#" + pathId;
			})
			.text((d) => {
				const text = d.value;
				return capitalizeLabels ? text.toUpperCase() : text;
			})
			.attr("startOffset", (d) => d.offset + "%")
			.attr("id", (d) => d.value)
			.merge(textSelect);

		textSelect.transition()
			.select("textPath")
			.text((d) => {
				const text = d.value;
				return capitalizeLabels ? text.toUpperCase() : text;
			})
			.attr("startOffset", (d) => d.offset + "%");

		textSelect.exit()
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
