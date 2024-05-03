import * as d3 from "d3";
import componentLegendSize from "./legendSize.js";
import componentLegendCategorical from "./legendCategorical.js";
import componentLegendThreshold from "./legendThreshold.js";

/**
 * Reusable Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 150;
	let margin = { top: 35, right: 10, bottom: 10, left: 10 };
	let sizeScale;
	let colorScale;
	let title = "Key";
	let legend;
	let opacity = 1;
	let transition = { ease: d3.easeBounce, duration: 0 };
	let itemType = "rect";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legend
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		height = (height ? height : this.attr("height"));
		width = (width ? width : this.attr("width"));

		// Size Legend
		if (typeof sizeScale !== "undefined") {
			legend = componentLegendSize()
				.sizeScale(sizeScale)
				.itemCount(4);
		}

		// Thereshold or Categorical Legend
		if (typeof colorScale !== "undefined") {
			if (scaleType(colorScale) === "threshold") {
				legend = componentLegendThreshold()
					.thresholdScale(colorScale);
			} else {
				legend = componentLegendCategorical()
					.colorScale(colorScale)
					.itemType(itemType);
			}
		}

		legend.opacity(opacity).transition(transition);

		// Legend Box
		const legendBox = selection.selectAll(".legendBox")
			.data([0]);

		const legendBoxEnter = legendBox.enter()
			.append("g")
			.attr("class", "legendBox");

		// Border Box
		legendBoxEnter.append("rect")
			.classed("legendBorder", true)
			.attr("width", width)
			.attr("height", height)
			.attr("fill-opacity", 0)
			.attr("stroke-width", 1)
			.attr("stroke", "currentcolor");

		legendBox.transition()
			.ease(transition.ease)
			.duration(transition.duration)
			.selectAll(".legendBorder")
			.attr("width", width)
			.attr("height", height);

		// Legend Title
		legendBoxEnter.append("g")
			.classed("legendTitle", true)
			.attr("transform", "translate(10, 10)")
			.append("text")
			.style("font-weight", "bold")
			.attr("dominant-baseline", "hanging")
			.attr("fill", "currentColor")
			.text(title);

		// Legend Component
		legend
			.width(width - (margin.left + margin.right))
			.height(height - (margin.top + margin.bottom));

		// Legend Items
		legendBoxEnter.append("g")
			.classed("legendBox", true)
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(legend);

		legendBox.selectAll(".legendBox")
			.call(legend);
	}

	/**
	 * Detect Scale Type
	 *
	 * @param {d3.scale} scale - Scale type.
	 *
	 * @returns {string}
	 */
	function scaleType(scale) {
		const s = scale.copy();
		if (s.domain([1, 2]).range([1, 2])(1.5) === 1) {
			return "ordinal";
		} else if (typeof s.invert !== "function") {
			return "threshold";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) === 1.5) {
			return "linear";
		} else if (s.domain([1, 2]).range([1, 2]).invert(1.5) instanceof Date) {
			return "time";
		} else {
			return "not supported";
		}
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
	 * Title Getter / Setter
	 *
	 * @param {string} _v - Title text.
	 * @returns {*}
	 */
	my.title = function(_v) {
		if (!arguments.length) return title;
		title = _v;
		return my;
	};

	/**
	 * Item Type Getter / Setter
	 *
	 * @param {number} _v - Rect or Line
	 * @returns {*}
	 */
	my.itemType = function(_v) {
		if (!arguments.length) return itemType;
		itemType = _v;
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
