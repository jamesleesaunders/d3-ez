import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as componentLabeledNode } from "./labeledNode";

/**
 * Reusable Proportional Area Circles Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 400;
  var height = 100;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
  var colorScale;
  var xScale;
  var yScale;
  var sizeScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    var slicedData = dataParse(data);
    var categoryNames = slicedData.categoryNames;

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === 'undefined') ?
      d3.scaleOrdinal().range(colors).domain(categoryNames) :
      colorScale;
  }

  /**
   * Constructor
   */
  function my(selection) {
    // Calculate cell sizes
    var cellHeight = yScale.bandwidth();
    var cellWidth = xScale.bandwidth();

    selection.attr("width", width).attr("height", height);
    selection.each(function(data) {
      init(data);

      // Create series group
      var seriesSelect = selection.selectAll(".series")
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      series.attr("transform", function(d) {
        return "translate(0 , " + (cellHeight / 2) + ")";
      });

      var spot = componentLabeledNode()
        .radius(function(d) { return sizeScale(d.value); })
        .color(function(d) { return colorScale(d.value); })
        .label(function(d) { return d.value; })
        .display("none")
        .classed("punchSpot")
        .dispatch(dispatch);

      // Add spots to series
      var spots = series.selectAll(".punchSpot")
        .data(function(d) { return d.values; });

      /*
      spots.enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + xScale(d.key) + ",0)";
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
        .datum(function(d) { return d; })
        .call(spot)
        .merge(spots);
      */

      spots.enter().append("circle")
        .attr("class", "punchSpot")
        .attr("cx", function(d) { return (cellWidth / 2 + xScale(d.key)); })
        .attr("cy", 0)
        .attr("r", 0)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(spots)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); })
        .attr("r", function(d) { return sizeScale(d['value']); });

      spots.exit()
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

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
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
