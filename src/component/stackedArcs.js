import * as d3 from "d3";

/**
 * Reusable Stacked Arcs
 *
 */
export default function() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var startRadius = 0;
  var endRadius = 360;
  var startAngle = 0;
  var endAngle = 60;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;

    var endAngle = xScale.bandwidth();

    // Arc Generator
    var arc = d3.arc()
      .innerRadius(function(d) {
        return yScale(d.y0);
      })
      .outerRadius(function(d) {
        return yScale(d.y1);
      })
      .startAngle(0 * (Math.PI/180))
      .endAngle(endAngle * (Math.PI/180));

    // Stack Generator
    var stacker = function(data) {
      var series = [];
      var y0 = 0;
      data.forEach(function(d, i) {
        series[i] = {
          name: d.key,
          value: d.value,
          y0: y0,
          y1: y0 + d.value
        };
        y0 += d.value;
      });
      return series;
    };

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add segments to series
      var segments = series.selectAll(".bar")
        .data(function(d) { return stacker(d.values); });

      segments.enter()
        .append("path")
        .classed("segment", true)
        .attr("fill", function(d) { return colorScale(d.name); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(segments)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("d", arc);

      segments.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
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

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
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
