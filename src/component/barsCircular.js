import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";


/**
 * Reusable Circular Bar Chart Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 300;
  var height = 300;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = palette.categorical(3);
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
  var xScale;
  var yScale;
  var colorScale;

  /**
   * Other Customisation Options
   */
  var radius = 150;
  var innerRadius = 20;
  var startAngle = 0;
  var endAngle = 270;

  /**
   * Arc Generator
   */
  var arc = d3.arc()
    .startAngle(0)
    .endAngle(function(d) {
      return (yScale(d.value) * Math.PI) / 180;
    })
    .outerRadius(function(d) {
      return xScale(d.key) + xScale.bandwidth();
    })
    .innerRadius(function(d) {
      return (xScale(d.key));
    })
    .cornerRadius(2);

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
   * Initialise Data and Scales
   */
  function init(data) {
    var slicedData = dataParse(data);
    var categoryNames = slicedData.categoryNames;
    var maxValue = slicedData.maxValue;

    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === 'undefined') ?
      (Math.min(width, height) / 2) :
      radius;

    innerRadius = (typeof innerRadius === 'undefined') ?
      (radius / 4) :
      innerRadius;

    // If the yScale has not been passed then attempt to calculate.
    yScale = (typeof yScale === 'undefined') ?
      d3.scaleLinear().domain([0, maxValue]).range([startAngle, endAngle]) :
      yScale;

    // If the xScale has not been passed then attempt to calculate.
    xScale = (typeof xScale === 'undefined') ?
      d3.scaleBand().domain(categoryNames).rangeRound([innerRadius, radius]).padding(0.15) :
      xScale;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === 'undefined') ?
      d3.scaleOrdinal().range(colors).domain(xScale.domain()) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
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

      // Add bars to series
      var bars = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      bars.enter()
        .append("path")
        .attr("d", arc)
        .classed("bar", true)
        .style("fill", function(d) { return colorScale(d.key); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attrTween("d", arcTween);

      bars.exit()
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
