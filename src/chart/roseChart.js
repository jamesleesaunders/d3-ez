import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Stacked Bar Chart
 *
 * @see http://datavizproject.com/data-type/stacked-bar-chart/
 */
export default function() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "roseChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = palette.categorical(3);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;

  // Data Variables
  var groupNames;
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;

    // Slice Data, calculate totals, max etc.
    var slicedData = dataParse(data);
    groupNames = slicedData.groupNames;
    maxValue = slicedData.maxValue;
    categoryNames = slicedData.categoryNames;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([0, 360]);

    yScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("circularSectorLabels", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      var stackedArcs = component.stackedArcs()
        .radius(radius)
        .xScale(xScale)
        .yScale(yScale)
        //.startAngle(-90)
        .colorScale(colorScale)
        .dispatch(dispatch);

      // Create series group
      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(data);

      seriesGroup.enter()
        .append("g")
        .classed("seriesGroup", true)
        .attr("transform", function(d) { return "rotate(" + xScale(d.key) + ")"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(stackedArcs);

      seriesGroup.exit()
        .remove();

      // Circular Labels
      var circularSectorLabels = component.circularSectorLabels()
        .radialScale(xScale)
        .textAnchor("start")
        .radius(radius * 1.04);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

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

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
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
