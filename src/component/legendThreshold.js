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
	let height = 200;
	let thresholdScale;

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

		// Legend Box
		const legendSelect = selection.selectAll("#legendBox")
			.data([0]);

		const legend = legendSelect.enter()
			.append("g")
			.attr("id", "legendBox")
			.attr("width", width)
			.attr("height", height)
			.merge(legendSelect);

		const domainMin = d3.min(thresholdScale.domain());
		const domainMax = d3.max(thresholdScale.domain());
		const domainMargin = (domainMax - domainMin) * 0.1;

		const x = d3.scaleLinear()
			.domain([domainMin - domainMargin, domainMax + domainMargin])
			.range([0, height]);

		const xAxis = d3.axisRight(x)
			.tickSize(30)
			.tickValues(thresholdScale.domain());

		const axis = legend.call(xAxis);
		axis.select(".domain")
			.remove();

		axis.selectAll("rect")
			.data(thresholdScale.range().map((color) => {
				const d = thresholdScale.invertExtent(color);
				if (typeof d[0] === 'undefined') d[0] = x.domain()[0];
				if (typeof d[1] === 'undefined') d[1] = x.domain()[1];
				return d;
			}))
			.enter()
			.insert("rect", ".tick")
			.attr("width", 20)
			.attr("y", (d) => x(d[0]))
			.attr("height", (d) => x(d[1]) - x(d[0]))
			.attr("fill", (d) => thresholdScale(d[0]));
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

	return my;
}
