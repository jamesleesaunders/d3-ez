import * as d3 from "d3";

/**
 * Reusable Size Legend Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let width = 100;
	let height = 200;
	let sizeScale;
	let itemCount = 4;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias legendSize
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

		let data = function() {
			// Calculate radiusScale
			let domainMin = parseFloat(d3.min(sizeScale.domain()));
			let domainMax = parseFloat(d3.max(sizeScale.domain()));
			let increment = (domainMax - domainMin) / itemCount;
			let ranges = Array(itemCount).fill().map(function(v, i) {
				let rangeStart = domainMin + (increment * i);
				let rangeEnd = domainMin + (increment * (i + 1));
				return [rangeStart, rangeEnd];
			});

			// Calculate yScale
			let yStep = height / (itemCount * 2);
			let yDomain = [0, (itemCount - 1)];
			let yRange = [yStep, (height - yStep)];
			let yScale = d3.scaleLinear()
				.domain(yDomain)
				.range(yRange);

			return ranges.map(function(v, i) {
				return {
					x: sizeScale(domainMax),
					y: yScale(i),
					r: sizeScale(ranges[i][0]),
					text: v[0].toFixed(0) + " - " + v[1].toFixed(0)
				}
			});
		};

		let itemsSelect = legend.selectAll(".legendItem")
			.data(data);

		let items = itemsSelect.enter()
			.append("g")
			.classed("legendItem", true)
			.attr("transform", function(d) {
				return "translate(0," + d.y + ")";
			})
			.merge(itemsSelect);

		items.exit()
			.remove();

		items.append("circle")
			.attr("r", function(d) { return d.r; })
			.attr("cx", function(d) { return d.x; })
			.attr("fill", "lightgrey")
			.attr("stroke", "grey")
			.attr("stroke-width", 1);

		items.append("text")
			.text(function(d) { return d.text; })
			.attr("dominant-baseline", "middle")
			.attr("x", function(d) { return (d.x * 2) + 5; });
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return my;
	};

	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return my;
	};

	my.itemCount = function(_) {
		if (!arguments.length) return itemCount;
		itemCount = _;
		return my;
	};

	return my;
}
