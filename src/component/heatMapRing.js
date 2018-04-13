import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";

/**
 * Reusable Heat Map Ring Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 300;
  let height = 300;
  let radius = 150;
  let innerRadius = 20;
  let startAngle = 0;
  let endAngle = 360;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
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
    let maxValue = slicedData.maxValue;

    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === "undefined") ?
      (Math.min(width, height) / 2) :
      radius;

    // If the yScale has not been passed then attempt to calculate.
    yScale = (typeof yScale === "undefined") ?
      d3.scaleLinear().domain([0, maxValue]).range([startAngle, endAngle]) :
      yScale;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
    let segStartAngle = d3.min(xScale.range());
    let segEndAngle = d3.max(xScale.range());

    // Pie Generator
    let pie = d3.pie()
      .value(1)
      .sort(null)
      .startAngle(segStartAngle * (Math.PI / 180))
      .endAngle(segEndAngle * (Math.PI / 180))
      .padAngle(0.015);

    // Arc Generator
    let arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(2);

    selection.each(function(data) {
      init(data);

      // Create series group
      let seriesSelect = selection.selectAll(".series")
        .data(function(d) { return [d]; });

      let series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      let segments = series.selectAll(".segment")
        .data(function(d) {
          let key = d.key;
          let data = pie(d.values);
          data.forEach(function(d, i) {
            data[i].key = key;
          });

          return data;
        });

      // Ring Segments
      segments.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", "black")
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(segments)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.data.value); });

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
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}
