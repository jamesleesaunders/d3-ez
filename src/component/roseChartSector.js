import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";


/**
 * Reusable Rose Chart Sector
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 300;
  var height = 300;
  var radius;
  var startAngle = 0;
  var endAngle = 45;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = palette.categorical(3);
  var colorScale;
  var xScale;
  var yScale;
  var stacked = false;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    /* TODO */
  }

  /**
   * Constructor
   */
  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;

    // Stack Generator
    var stacker = function(data) {
      // Calculate inner and outer radius values
      var series = [];
      var innerRadius = 0;
      var outerRadius = 0;
      data.forEach(function(d, i) {
        outerRadius = innerRadius + d.value;
        series[i] = {
          key: d.key,
          value: d.value,
          innerRadius: yScale(innerRadius),
          outerRadius: yScale(outerRadius)
        };
        innerRadius += (stacked ? d.value : 0);
      });

      return series;
    };

    // Arc Generator
    var arc = d3.arc()
      .innerRadius(function(d) {
        return d.innerRadius;
      })
      .outerRadius(function(d) {
        return d.outerRadius;
      })
      .startAngle(startAngle * (Math.PI / 180))
      .endAngle(endAngle * (Math.PI / 180));

    selection.each(function(data) {
      init(data);

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
      var segments = series.selectAll(".segment")
        .data(function(d) { return stacker(d.values); });

      segments.enter()
        .append("path")
        .classed("segment", true)
        .attr("fill", function(d) { return colorScale(d.key); })
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

  my.startAngle = function(_) {
    if (!arguments.length) return startAngle;
    startAngle = _;
    return this;
  };

  my.endAngle = function(_) {
    if (!arguments.length) return endAngle;
    endAngle = _;
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

  my.stacked = function(_) {
    if (!arguments.length) return stacked;
    stacked = _;
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
