import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Line Chart Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 400;
  let height = 400;
  let transition = { ease: d3.easeBounce, duration: 1500 };
  let colors = palette.categorical(3);
  let colorScale;
  let xScale;
  let yScale;
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === 'undefined') ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
    // Line generation function
    let line = d3.line()
      .curve(d3.curveCardinal)
      .x(function(d) { return xScale(d.key); })
      .y(function(d) { return yScale(d.value); });

    // Line animation tween
    let pathTween = function(data) {
      let interpolate = d3.scaleQuantile()
        .domain([0, 1])
        .range(d3.range(1, data.length + 1));
      return function(t) {
        return line(data.slice(0, interpolate(t)));
      };
    };

    selection.each(function(data) {
      init(data);

      // Create series group
      let series = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      series.enter()
        .append("path")
        .attr("class", "series")
        .attr("stroke-width", 1.5)
        .attr("stroke", function(d) { return colorScale(d.key); })
        .attr("fill", "none")
        .merge(series)
        .transition()
        .duration(transition.duration)
        .attrTween("d", function(d) { return pathTween(d.values); });

      series.exit()
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
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
