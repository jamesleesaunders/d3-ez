/**
 * Discrete Bar Chart
 *
 * @example
 * var myChart = d3.ez.chart.discreteBar()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .colors(d3.scaleCategory10().range());
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.discreteBar = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);
  var gap = 0;

  // Data Options (Populated by 'init' function)
  var chartW = 0;
  var chartH = 0;
  var xScale = undefined;
  var yScale = undefined;
  var xAxis = undefined;
  var yAxis = undefined;
  var colorScale = undefined;
  var yAxisLabel = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    var categoryNames = slicedData.categoryNames;
    var maxValue = slicedData.maxValue;
    var yAxisLabel = slicedData.groupName;

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, chartW])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([chartH, 0]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }
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

        chart = svg.append("g").classed('chart', true);
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      // Add labels to chart
      ylabel = chart.select(".y-axis")
        .selectAll(".y-label")
        .data([data.key]);

      ylabel.enter()
        .append("text")
        .classed("y-label", true)
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

      // Add bars to the chart
      var barChart = d3.ez.component.barGrouped()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      chart.datum(data.values)
        .call(barChart);
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
