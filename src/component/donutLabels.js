import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Donut Chart Label Component
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 300;
	let height = 300;
	let transition = { ease: d3.easeBounce, duration: 500 };
	let radius = 150;
	let innerRadius;
	let classed = "donutLabels";

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		// If the radius has not been passed then calculate it from width/height.
		radius = (typeof radius === "undefined") ?
			(Math.min(width, height) / 2) :
			radius;

		innerRadius = (typeof innerRadius === "undefined") ?
			(radius / 4) :
			innerRadius;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		selection.each(function(data) {
			init(data);

			// Pie Generator
			let pie = d3.pie()
				.value(function(d) { return d.value; })
				.sort(null)
				.padAngle(0.015);

			// Arc Generator
			let arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius)
				.cornerRadius(2);

			// Outer Arc Generator
			let outerArc = d3.arc()
				.innerRadius(radius * 0.9)
				.outerRadius(radius * 0.9);

			// Mid Angle
			let midAngle = function(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			};

			// Update series group
			let labelsGroup = d3.select(this);
			labelsGroup
				.classed(classed, true)
				.attr("id", function(d) { return d.key; });

			// TODO: I am not sure the below will work for updates?
			labelsGroup.append("g").attr("class", "labels");
			labelsGroup.append("g").attr("class", "lines");

			// Labels
			let labels = labelsGroup.select(".labels")
				.selectAll("text.label")
				.data(function(d) {
					return pie(d.values);
				});

			labels.enter()
				.append("text")
				.attr("class", "label")
				.attr("dy", ".35em")
				.merge(labels)
				.transition()
				.duration(transition.duration)
				.text(function(d) {
					return d.data.key;
				})
				.attrTween("transform", function(d) {
					this._current = this._current || d;
					let interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						let d2 = interpolate(t);
						let pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return "translate(" + pos + ")";
					};
				})
				.styleTween("text-anchor", function(d) {
					this._current = this._current || d;
					let interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						let d2 = interpolate(t);
						return midAngle(d2) < Math.PI ? "start" : "end";
					};
				});

			labels.exit()
				.remove();

			// Slice to Label Lines
			let lines = labelsGroup.select(".lines")
				.selectAll("polyline.line")
				.data(function(d) {
					return pie(d.values);
				});

			lines.enter()
				.append("polyline")
				.attr("class", "line")
				.merge(lines)
				.transition()
				.duration(transition.duration)
				.attrTween("points", function(d) {
					this._current = this._current || d;
					let interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						let d2 = interpolate(t);
						let pos = outerArc.centroid(d2);
						pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return [arc.centroid(d2), outerArc.centroid(d2), pos];
					};
				});

			lines.exit()
				.remove();
		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	my.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return this;
	};

	return my;
}
