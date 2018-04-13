import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as componentLabeledNode } from "./labeledNode";

/**
 * Reusable Scatter Plot Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 400;
  let height = 400;
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = palette.categorical(3);
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");
  let xScale;
  let yScale;
  let colorScale;
  let sizeScale;

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
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

      // Add bubbles to series
      let bubbles = series.selectAll(".bubble")
        .data(function(d) { return d.values; });

      let bubble = componentLabeledNode()
        .radius(function(d) { return sizeScale(d.value); })
        .color(function(d) { return colorScale(d.series); })
        .label(function(d) { return d.key; })
        .stroke(1, "white")
        .display("none")
        .classed("bubble")
        .dispatch(dispatch);

      bubbles.enter()
        .append("g")
        .call(bubble)
        .attr("transform", function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
        })
        .on("mouseover", function(d) {
          d3.select(this).select("text").style("display", "block");
          dispatch.call("customValueMouseOver", this, d);
        })
        .on("mouseout", function(d) {
          d3.select(this).select("text").style("display", "none");
        })
        .on("click", function(d) {
          dispatch.call("customValueClick", this, d);
        })
        .merge(bubbles);

      /*
      bubbles.enter().append("circle")
        .attr("class", "bubble")
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", function(d) { return sizeScale(d.value); })
        .style("fill", function(d) { return colorScale(d.series); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.value); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d.value); })
        .merge(bubbles)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("r", function(d) { return sizeScale(d.value); });
      */

      bubbles.exit()
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

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
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
