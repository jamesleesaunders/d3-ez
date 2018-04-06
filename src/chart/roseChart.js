import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Rose Chart (also called: Coxcomb Chart; Circumplex Chart; Nightingale Chart)
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
export default function() {

  /**
   * Default Properties
   */
  var svg;
  var chart;
  var classed = "roseChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = palette.categorical(3);
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Chart Dimensions
   */
  var chartW;
  var chartH;
  var radius;

  /**
   * Scales and Axis
   */
  var xScale;
  var yScale;
  var colorScale;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === 'undefined') ?
      (Math.min(chartW, chartH) / 2) :
      radius;

    // Slice Data, calculate totals, max etc.
    var slicedData = dataParse(data);
    var groupNames = slicedData.groupNames;
    var maxValue = slicedData.maxValue;
    var categoryNames = slicedData.categoryNames;

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

  /**
   * Constructor
   */
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

      var roseChartSector = component.roseChartSector()
        .radius(radius)
        .yScale(yScale)
        .stacked(false)
        .colorScale(colorScale)
        .dispatch(dispatch);

      // Create series group
      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(data);

      seriesGroup.enter()
        .append("g")
        .classed("seriesGroup", true)
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .each(function(d) {
          var startAngle = xScale(d.key);
          var endAngle = xScale(d.key) + xScale.bandwidth();
          roseChartSector.startAngle(startAngle).endAngle(endAngle);
          d3.select(this).call(roseChartSector);
        });

      seriesGroup.exit()
        .remove();

      // Circular Labels
      var circularSectorLabels = component.circularSectorLabels()
        .radius(radius * 1.04)
        .radialScale(xScale)
        .textAnchor("start")
        .capitalizeLabels(true);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

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
