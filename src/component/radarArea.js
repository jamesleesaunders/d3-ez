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
  let width = 300;
  let height = 300;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = palette.categorical(3);
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
  let xScale;
  let yScale;
  let colorScale;
  let radius = 150;
  let angleSlice;
  let classed = "radarArea";

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === "undefined") ?
      (Math.min(width, height) / 2) :
      radius;

    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;
    let maxValue = slicedData.maxValue;

    // Slice calculation on circle
    angleSlice = (Math.PI * 2 / categoryNames.length);

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().domain(categoryNames).range(colors) :
      colorScale;

    // If the xScale has not been passed then attempt to calculate.
    xScale = (typeof xScale === "undefined") ?
      d3.scaleBand().domain(categoryNames).range([0, 360]) :
      xScale;

    // If the yScale has not been passed then attempt to calculate.
    yScale = (typeof yScale === "undefined") ?
      yScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]).nice() :
      yScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
    init(selection.data());
    selection.each(function() {

      // Function to generate radar line points
      let radarLine = d3.radialLine()
        .radius(function(d) { return yScale(d.value); })
        .angle(function(d, i) { return i * angleSlice; })
        .curve(d3.curveBasis)
        .curve(d3.curveCardinalClosed);

      // Update series group
      let seriesGroup = d3.select(this);
      seriesGroup.append("path")
        .classed(classed, true)
        .attr("d", function(d) { return radarLine(d.values); })
        .style("fill-opacity", 0.2)
        .on('mouseover', function() {
          // Dim all Radar Wrapper
          d3.selectAll(".radarArea")
            .transition()
            .duration(200)
            .style("fill-opacity", 0.2);

          // Bring back Radar Wrapper
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);
        })
        .on('mouseout', function() {
          // Bring back all Radar Wrappers
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.2);
        });

      // Creating lines/path on circle
      seriesGroup.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d) { return radarLine(d.values); })
        .style("stroke-width", 3 + "px")
        .style("fill", "none");

      // Create Radar Circle points on line
      seriesGroup.selectAll(".radarCircle")
        .data(function(d) { return d.values; })
        .enter()
        .append("circle")
        .attr("class", "radarCircle")
        .attr("r", 4)
        .attr("cx", function(d, i) { return yScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function(d, i) { return yScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill-opacity", 0.8);
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

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
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
