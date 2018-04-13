import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";
import { default as component } from "../component";

/**
 * Bubble Chart
 * @see http://datavizproject.com/data-type/bubble-chart/
 */
export default function() {

  /**
   * Default Properties
   */
  let svg;
  let chart;
  let classed = "bubbleChart";
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
   * Scales and Axis
   */
  let xScale;
  let yScale;
  let sizeScale;
  let xAxis;
  let yAxis;
  let colorScale;

  /**
   * Other Customisation Options
   */
  let minRadius = 3;
  let maxRadius = 20;
  let yAxisLabel;

  /**
   * Initialise Data, Scales and Series
   */
  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    function extents(key) {
      // Calculate the extents for each series.
      let serExts = [];
      d3.map(data).values().forEach(function(d) {
        let vals = d.values.map(function(e) {
          return +e[key];
        });
        serExts.push(d3.extent(vals));
      });
      // Merge all the series extents into one array.
      // Calculate overall extent.
      return d3.extent([].concat.apply([], serExts));
    }

    let xDomain = extents("x");
    let yDomain = extents("y");
    let sizeDomain = extents("value");
    let categoryNames = data.map(function(d) {
      return d.key;
    });

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X, Y & Z Scales
    xScale = d3.scaleLinear()
      .range([0, chartW])
      .domain(xDomain)
      .nice();

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain(yDomain)
      .nice();

    sizeScale = d3.scaleLinear()
      .range([minRadius, maxRadius])
      .domain(sizeDomain);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
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
        chart.append("g").classed("bubbles", true);
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
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.select(".yAxis")
        .call(yAxis);

      // Add bubbles to the chart
      let bubbles = component.bubbles()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .sizeScale(sizeScale)
        .dispatch(dispatch);

      let bubbleGroup = chart.selectAll(".bubbleGroup")
        .data(function(d) { return d; });

      bubbleGroup.enter().append("g")
        .attr("class", "bubbleGroup")
        .datum(function(d) { return d; })
        .merge(bubbleGroup)
        .call(bubbles);

      bubbleGroup.exit()
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
