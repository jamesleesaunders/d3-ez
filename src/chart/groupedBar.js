/**
 * Grouped Bar Chart
 *
 * @example
 * var myChart = d3.ez.chart.groupedBar()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .groupType("stacked");
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.groupedBar = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var classed = "chartGroupedBar";
  var colors = d3.ez.colors.categorical(4);
  var gap = 0;
  var yAxisLabel = null;
  var groupType = "clustered";

  // Data Options (Populated by 'init' function)
  var slicedData = d3.ez.dataParse;
  var chartW = 0;
  var chartH = 0;
  var xScale = undefined;
  var xScale2 = undefined;
  var yScale = undefined;
  var xAxis = undefined;
  var yAxis = undefined;
  var colorScale = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    slicedData.setData(data);
    var groupNames = slicedData.groupNames();
    var groupTotalsMax = slicedData.groupTotalsMax();
    var maxValue = slicedData.maxValue();
    var categoryNames = slicedData.categoryNames();

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([0, chartW])
      .padding(0.1);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, (groupType === "stacked" ? groupTotalsMax : maxValue)]);

    xScale2 = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, xScale.bandwidth()])
      .padding(0.1);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    // Colour Scale
    colorScale = d3.scaleOrdinal()
      .range(colors)
      .domain(categoryNames);
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
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true)
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

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      if (groupType === "stacked") {
        var barChart = d3.ez.component.barStacked()
          .xScale(xScale);

      } else if (groupType === "clustered") {
        var barChart = d3.ez.component.barGrouped()
          .xScale(xScale2);
      }

      barChart.width(xScale.bandwidth())
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .dispatch(dispatch)

      // TODO: This is temporary to allow transition between stacked and clustered
      chart.selectAll(".seriesGroup").data([]).exit().remove();

      // Create bar group
      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(data);

      seriesGroup.enter()
        .append("g")
        .classed("seriesGroup", true)
        .attr("transform", function(d) { return "translate(" + xScale(d.key) + ", 0)"; })
        .datum(function(d) { return d.values; })
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

  my.groupType = function(_) {
    if (!arguments.length) return groupType;
    groupType = _;
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
