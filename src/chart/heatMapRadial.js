import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Circular Heat Map (also called: Radial Heat Map)
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
export default function() {

  /**
   * Default Properties
   */
  let svg;
  let chart;
  let classed = "heatMapRadial";
  let width = 400;
  let height = 300;
  let margin = { top: 20, right: 20, bottom: 20, left: 20 };
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Chart Dimensions
   */
  let chartW;
  let chartH;
  let radius;
  let innerRadius;

  /**
   * Scales
   */
  let xScale;
  let yScale;
  let colorScale;

  /**
   * Other Customisation Options
   */
  let startAngle = 0;
  let endAngle = 270;
  let thresholds;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === "undefined") ?
      (Math.min(chartW, chartH) / 2) :
      radius;

    innerRadius = (typeof innerRadius === "undefined") ?
      (radius / 4) :
      innerRadius;

    // Slice Data, calculate totals, max etc.
    let slicedData = dataParse(data);
    let categoryNames = slicedData.categoryNames;
    let groupNames = slicedData.groupNames;

    // If thresholds values are not set attempt to auto-calculate the thresholds.
    if (!thresholds) {
      thresholds = slicedData.thresholds;
    }

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleThreshold().domain(thresholds).range(colors) :
      colorScale;

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

  /**
   * Constructor
   */
  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create chart element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          let el = selection._groups[0][0];
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

      let heatMapRing = component.heatMapRing()
        .radius(function(d) { return yScale(d.key) })
        .innerRadius(function(d) { return yScale(d.key) + yScale.bandwidth(); })
        .startAngle(startAngle)
        .endAngle(endAngle)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .dispatch(dispatch)
        .thresholds(thresholds);

      let seriesGroup = chart.select(".circleRings").selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter()
        .append("g")
        .attr("class", "seriesGroup")
        .merge(seriesGroup)
        .call(heatMapRing);

      seriesGroup.exit()
        .remove();

      // Circular Labels
      let circularSectorLabels = component.circularSectorLabels()
        .radius(radius * 1.04)
        .radialScale(xScale)
        .textAnchor("start");

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

      // Ring Labels
      let circularRingLabels = component.circularRingLabels()
        .radialScale(yScale)
        .textAnchor("middle");

      chart.select(".circularRingLabels")
        .call(circularRingLabels);

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

  my.thresholds = function(_) {
    if (!arguments.length) return thresholds;
    thresholds = _;
    return my;
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
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}
