import * as d3 from "d3";

/**
 * Reusable Donut Chart Labels Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let classed = "donutLabels";
	let xScale;
	let yScale;
	let transition = { ease: d3.easeLinear, duration: 0 };

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donutLabels
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.each(function() {
			const [innerRadius, radius] = xScale.range();
			const [startAngle, endAngle] = yScale.range();

			// Pie Generator
			const pie = d3.pie()
				.startAngle((startAngle * Math.PI) / 180)
				.endAngle((endAngle * Math.PI) / 180)
				.value((d) => d.value)
				.sort(null)
				.padAngle(0.015);

			// Arc Generator
			const arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius);

			// Outer Arc Generator
			const outerArc = d3.arc()
				.innerRadius(radius * 0.9)
				.outerRadius(radius * 0.9);

			// Mid Angle
			const midAngle = function(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			};

			// Update Series Group
			const seriesGroup = d3.select(this);

			// Add Component Level Group
			let componentGroup = seriesGroup
				.selectAll(`g.${classed}`)
				.data((d) => [d])
				.enter()
				.append("g")
				.classed(classed, true)
				.merge(seriesGroup);

			// Text Labels
			const labelsGroup = componentGroup
				.selectAll("g.labels")
				.data((d) => [d]);

			const labelsGroupEnter = labelsGroup.enter()
				.append("g")
				.attr("class", "labels")
				.merge(labelsGroup);

			const labels = labelsGroupEnter.selectAll("text.label")
				.data((d) => pie(d.values));

			labels.enter()
				.append("text")
				.attr("class", "label")
				.attr("font-size", "0.9em")
				.attr("dy", ".35em")
				.attr("fill", "currentColor")
				.merge(labels)
				.transition()
				.duration(transition.duration)
				.text((d) => d.data.key)
				.attrTween("transform", function(d) {
					this._current = this._current || d;
					const interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return (t) => {
						const d2 = interpolate(t);
						const pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return `translate(${pos})`;
					};
				})
				.styleTween("text-anchor", function(d) {
					this._current = this._current || d;
					const interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return (t) => {
						const d2 = interpolate(t);
						return midAngle(d2) < Math.PI ? "start" : "end";
					};
				});

			labels.exit()
				.remove();

			// Label to Slice Connectors
			const connectorsGroupSelect = componentGroup.selectAll("g.connectors")
				.data((d) => [d]);

			const connectorsGroup = connectorsGroupSelect.enter()
				.append("g")
				.attr("class", "connectors")
				.merge(connectorsGroupSelect);

			const connectors = connectorsGroup.selectAll("polyline.connector")
				.data((d) => pie(d.values));

			connectors.enter()
				.append("polyline")
				.attr("class", "connector")
				.attr("fill", "none")
				.attr("stroke", "currentColor")
				.attr("stroke-width", "1.5px")
				.merge(connectors)
				.transition()
				.duration(transition.duration)
				.attrTween("points", function(d) {
					this._current = this._current || d;
					const interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return (t) => {
						const d2 = interpolate(t);
						const pos = outerArc.centroid(d2);
						pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return [arc.centroid(d2), outerArc.centroid(d2), pos];
					};
				});

			connectors.exit()
				.remove();
		});
	}

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
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
