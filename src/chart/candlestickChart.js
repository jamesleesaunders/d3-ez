import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Candlestick Chart (also called: Japanese Candlestick; OHLC Chart; Box Plot)
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
export default function() {

  /**
   * Default Properties
   */
  let svg;
  let chart;
  let classed = "candlestickChart";
  let width = 400;
  let height = 300;
  let margin = { top: 20, right: 20, bottom: 40, left: 40 };
  let transition = { ease: d3.easeBounce, duration: 500 };
  let colors = ["green", "red"];
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
  let yAxisLabel;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Convert dates
    data.values.forEach(function(d, i) {
      data.values[i].date = Date.parse(d.date);
    });

    // Slice Data, calculate totals, max etc.
    let maxDate = d3.max(data.values, function(d) {
      return d.date;
    });
    let minDate = d3.min(data.values, function(d) {
      return d.date;
    });
    let xDomain = [
      new Date(minDate - 8.64e7),
      new Date(maxDate + 8.64e7)
    ];
    let yDomain = [
      d3.min(data.values, function(d) { return d.low; }),
      d3.max(data.values, function(d) { return d.high; })
    ];

    // If the colorScale has not been passed then attempt to calculate.
    colorScale = (typeof colorScale === "undefined") ?
      d3.scaleOrdinal().domain([true, false]).range(colors) :
      colorScale;

    // X & Y Scales
    xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, chartW]);

    yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([chartH, 0])
      .nice();

    //if (!yAxisLabel) {
    //  yAxisLabel = slicedData.groupName;
    //}
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
        chart.append("g").classed("seriesGroup", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add Clip Path
      // chart.append('clipPath')
      //   .attr('id', 'plotAreaClip')
      //   .append('rect')
      //   .attr('width', chartW)
      //   .attr('height', chartH)
      //   .attr('clip-path', 'url(#plotAreaClip)');

      // Add candles to the chart
      let candleSticks = component.candleSticks()
        .width(chartW)
        .height(chartH)
        .colors(colors)
        .dispatch(dispatch);

      chart.select(".seriesGroup")
        .datum(data)
        .call(candleSticks);

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

      // Add Labels to chart
      let ylabel = chart.select(".yAxis")
        .selectAll(".yAxisLabel")
        .data([data.key]);

      ylabel.enter()
        .append("text")
        .classed("yAxisLabel", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .attr("fill", "#000000")
        .style("text-anchor", "end")
        .merge(ylabel)
        .transition()
        .text(function(d) {
          return (d);
        });
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
    let value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}
