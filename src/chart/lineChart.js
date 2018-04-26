import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 * @see http://datavizproject.com/data-type/line-chart/
 */
export default function() {

  /**
   * Default Properties
   */
  let svg;
  let chart;
  let classed = "lineChart";
  let width = 400;
  let height = 300;
  let margin = { top: 20, right: 20, bottom: 40, left: 40 };
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = palette.categorical(3);
  let dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  /**
   * Chart Dimensions
   */
  let chartW;
  let chartH;

  /**
   * Scales
   */
  let xScale;
  let yScale;
  let colorScale;

  /**
   * Other Customisation Options
   */
  let yAxisLabel = null;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    let slicedData = dataParse(data);
    let maxValue = slicedData.maxValue;
    let groupNames = slicedData.groupNames;

    // Convert dates
    data.forEach(function(d, i) {
      d.values.forEach(function(b, j) {
        data[i].values[j].key = new Date(b.key * 1000);
      });
    });
    let dateDomain = d3.extent(data[0].values, function(d) { return d.key; });

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().domain(groupNames).range(colors) :
      colorScale;

    // X & Y Scales
    xScale = d3.scaleTime()
      .domain(dateDomain)
      .range([0, chartW]);

    yScale = d3.scaleLinear()
      .domain([0, (maxValue * 1.05)])
      .range([chartH, 0]);
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
        chart.append("g").classed("yAxis axis", true)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      let lineChart = component.lineChart()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .dispatch(dispatch);

      let scatterPlot = component.scatterPlot()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      let lineGroup = chart.selectAll(".lineGroup")
        .data(function(d) { return d; });

      lineGroup.enter().append("g")
        .attr("class", "lineGroup")
        .style("fill", function(d) { return colorScale(d.key); })
        .datum(function(d) { return d; })
        .merge(lineGroup)
        .call(lineChart).call(scatterPlot);

      lineGroup.exit()
        .remove();

      let dotGroup = chart.selectAll(".dotGroup")
        .data(function(d) { return d; });

      dotGroup.enter().append("g")
        .attr("class", "dotGroup")
        .style("fill", function(d) { return colorScale(d.key); })
        .merge(dotGroup)
        .call(scatterPlot);

      dotGroup.exit()
        .remove();

      // Add X Axis to chart
      let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%d-%b-%y"));
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // Add Y Axis to chart
      let yAxis = d3.axisLeft(yScale);
      chart.select(".yAxis")
        .call(yAxis);
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

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
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
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}
