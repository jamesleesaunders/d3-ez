import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Donut Chart Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 300;
  var height = 300;
  var radius = 150;
  var innerRadius;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = palette.categorical(3);
  var colorScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 2 : innerRadius;
  }

  /**
   * Constructor
   */
  function my(selection) {
    selection.each(function(data) {
      init(data);

			/**
			 * Pie Generator
			 */
			var pie = d3.pie()
				.value(function(d) { return d.value; })
				.sort(null)
				.padAngle(0.015);

			/**
			 * Arc Generator
			 */
			var arc = d3.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius)
				.cornerRadius(2);

			/**
			 * Outer Arc Generator
			 */
			var outerArc = d3.arc()
				.innerRadius(radius * 0.9)
				.outerRadius(radius * 0.9);

			/**
			 * Arc Tween
			 */
			var arcTween = function(d) {
				var i = d3.interpolate(this._current, d);
				this._current = i(0);
				return function(t) {
					return arc(i(t));
				};
			};

			/**
			 * Mid Angle
			 */
			var midAngle = function(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			};

			// Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      series.append("g").attr("class", "slices");
      series.append("g").attr("class", "labels");
      series.append("g").attr("class", "lines");

      // Slices
      var slices = series.select(".slices")
        .selectAll("path.slice")
        .data(function(d) {
          return pie(d.values);
        });

      slices.enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d) { return colorScale(d.data.key); })
        .attr("d", arc)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(slices)
        .transition()
        .duration(transition.duration)
        .ease(transition.ease)
        .attrTween("d", arcTween);

      slices.exit()
        .remove();

      // Labels
      var labels = series.select(".labels")
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
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      labels.exit()
        .remove();

      // Slice to Label Lines
      var lines = series.select(".lines")
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
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
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

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
