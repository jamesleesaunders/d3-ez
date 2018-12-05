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
		const legendSelect = selection.selectAll("#legendBox")
			.data([0]);

		const legend = legendSelect.enter()
			.append("g")
			.attr("id", "legendBox")
			.attr("width", width)
			.attr("height", height)
			.merge(legendSelect);

		const data = function() {
			// Calculate radiusScale
			const domainMin = parseFloat(d3.min(sizeScale.domain()));
			const domainMax = parseFloat(d3.max(sizeScale.domain()));
			const increment = (domainMax - domainMin) / itemCount;
			const ranges = Array(itemCount).fill().map((v, i) => {
				const rangeStart = domainMin + (increment * i);
				const rangeEnd = domainMin + (increment * (i + 1));
				return [rangeStart, rangeEnd];
			});

			// Calculate yScale
			const yStep = height / (itemCount * 2);
			const yDomain = [0, (itemCount - 1)];
			const yRange = [yStep, (height - yStep)];
			const yScale = d3.scaleLinear()
				.domain(yDomain)
				.range(yRange);

			return ranges.map((v, i) => ({
					x: sizeScale(domainMax),
					y: yScale(i),
					r: sizeScale(ranges[i][0]),
					text: v[0].toFixed(0) + " - " + v[1].toFixed(0)
				}
			));
		};

		const itemsSelect = legend.selectAll(".legendItem")
			.data(data);

		const items = itemsSelect.enter()
			.append("g")
			.classed("legendItem", true)
			.attr("transform", (d) => "translate(0," + d.y + ")")
			.merge(itemsSelect);

		items.exit()
			.remove();

		items.append("circle")
			.attr("r", (d) => d.r)
			.attr("cx", (d) => d.x)
			.attr("fill", "lightgrey")
			.attr("stroke", "grey")
			.attr("stroke-width", 1);

		items.append("text")
			.text((d) => d.text)
			.attr("dominant-baseline", "middle")
			.attr("x", (d) => (d.x * 2) + 5);
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
	 * @param {d3.scale} _v - D3 size scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Item Count Getter / Setter
	 *
	 * @param {number} _v - Number of items.
	 * @returns {*}
	 */
	my.itemCount = function(_v) {
		if (!arguments.length) return itemCount;
		itemCount = _v;
		return my;
	};

	return my;
}
