import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Circular Heat Map (also called: Radial Heat Map)
 *
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
export default function() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "heatMapRadial";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;

  // Data Variables
  var categoryNames = [];
  var groupNames = [];
  var minValue = 0;
  var maxValue = 0;
  var thresholds;

  // Other Customisation Options
  var startAngle = 0;
  var endAngle = 270;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = dataParse(data);
    maxValue = slicedData.maxValue;
    minValue = slicedData.minValue;
    categoryNames = slicedData.categoryNames;
    groupNames = slicedData.groupNames;

    // If thresholds values are not already set
    // attempt to auto-calculate some thresholds.
    if (!thresholds) {
      thresholds = slicedData.thresholds;
    }

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleThreshold()
        .range(colors)
        .domain(thresholds);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([startAngle, endAngle])
      .padding(0.1);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([radius, innerRadius])
      .padding(0.1);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create chart element (if it does not exist already)
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
        chart.append("g").classed("circleRings", true);
        chart.append("g").classed("circularSectorLabels", true);
        chart.append("g").classed("circularRingLabels", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      var heatMapRing = component.heatMapRing()
        .radius(function(d) { return yScale(d.key) })
        .innerRadius(function(d) { return yScale(d.key) + yScale.bandwidth(); })
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var seriesGroup = chart.select(".circleRings").selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter()
        .append("g")
        .attr("class", "seriesGroup")
        .merge(seriesGroup)
        .datum(function(d) { return d; })
        .call(heatMapRing);

      seriesGroup.exit()
        .remove();

      // Circular Labels
      var circularSectorLabels = component.circularSectorLabels()
        .radialScale(xScale)
        .textAnchor("start")
        .radius(radius * 1.04);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

      // Ring Labels
      var circularRingLabels = component.circularRingLabels()
        .radialScale(yScale)
        .textAnchor("middle");

      chart.select(".circularRingLabels")
        .call(circularRingLabels);

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

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
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
