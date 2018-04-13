import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Punch Card
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
export default function() {

  /**
   * Default Properties
   */
  let svg;
  let chart;
  let classed = "punchCard";
  let width = 400;
  let height = 300;
  let margin = { top: 45, right: 20, bottom: 20, left: 45 };
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Chart Dimensions
   */
  let chartW;
  let chartH;

  /**
   * Scales and Axis
   */
  let sizeScale;
  let xScale;
  let yScale;
  let xAxis;
  let yAxis;
  let colorScale;

  /**
   * Other Customisation Options
   */
  let minRadius = 2;
  let maxRadius = 20;
  let useGlobalScale = true;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    let slicedData = dataParse(data);
    let maxValue = slicedData.maxValue;
    let minValue = slicedData.minValue;
    let categoryNames = slicedData.categoryNames;
    let groupNames = slicedData.groupNames;

    let valDomain = [minValue, maxValue];
    let sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[1]["values"], function(d) {
      return d["value"];
    })];

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleLinear()
        .domain(valDomain)
        .range(colors);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .range([0, chartW])
      .padding(0.05);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .range([0, chartH])
      .padding(0.05);

    // X & Y Axis
    xAxis = d3.axisTop(xScale);
    yAxis = d3.axisLeft(yScale);

    // Size Scale
    sizeScale = d3.scaleLinear()
      .domain(sizeDomain)
      .range([minRadius, maxRadius]);
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
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -8)
        .attr("transform", "rotate(60)")
        .style("text-anchor", "end");

      chart.select(".yAxis")
        .call(yAxis);

      let proportionalAreaCircles = component.proportionalAreaCircles()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .sizeScale(sizeScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      let seriesGroup = chart.selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter().append("g")
        .attr("class", "seriesGroup")
        .attr("transform", function(d) { return "translate(0, " + yScale(d.key) + ")"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(proportionalAreaCircles);

      seriesGroup.exit()
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

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.minRadius = function(_) {
    if (!arguments.length) return minRadius;
    minRadius = _;
    return this;
  };

  my.maxRadius = function(_) {
    if (!arguments.length) return maxRadius;
    maxRadius = _;
    return this;
  };

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.useGlobalScale = function(_) {
    if (!arguments.length) return useGlobalScale;
    useGlobalScale = _;
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
