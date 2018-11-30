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
		let legendSelect = selection.selectAll("#legendBox")
			.data([0]);

		let legend = legendSelect.enter()
			.append("g")
			.attr("id", "legendBox")
			.attr("width", width)
			.attr("height", height)
			.merge(legendSelect);

		let domainMin = d3.min(thresholdScale.domain());
		let domainMax = d3.max(thresholdScale.domain());
		let domainMargin = (domainMax - domainMin) * 0.1;

		let x = d3.scaleLinear()
			.domain([domainMin - domainMargin, domainMax + domainMargin])
			.range([0, height]);

		let xAxis = d3.axisRight(x)
			.tickSize(30)
			.tickValues(thresholdScale.domain());

		let axis = legend.call(xAxis);
		axis.select(".domain")
			.remove();

		axis.selectAll("rect")
			.data(thresholdScale.range().map(function(color) {
				let d = thresholdScale.invertExtent(color);
				if (typeof d[0] === 'undefined') d[0] = x.domain()[0];
				if (typeof d[1] === 'undefined') d[1] = x.domain()[1];
				return d;
			}))
			.enter()
			.insert("rect", ".tick")
			.attr("width", 20)
			.attr("y", function(d) { return x(d[0]); })
			.attr("height", function(d) { return x(d[1]) - x(d[0]); })
			.attr("fill", function(d) { return thresholdScale(d[0]); });
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _ - Width in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return my;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _ - Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return my;
	};

	/**
	 * Threshold Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 scale.
	 * @returns {*}
	 */
	my.thresholdScale = function(_) {
		if (!arguments.length) return thresholdScale;
		thresholdScale = _;
		return my;
	};

	return my;
}
