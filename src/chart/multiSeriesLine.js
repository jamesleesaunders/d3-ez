/**
 * Multi Series Line Chart
 *
 * @example
 * var myChart = d3.ez.chart.multiSeriesLine()
 *     .width(400)
 *     .height(300);
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.chart.multiSeriesLine = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var classed = "chartMultiSeriesLine";
  var colors = d3.ez.colors.categorical(3);
  var yAxisLabel = null;
  var groupType = "clustered";

  // Data Options (Populated by 'init' function)
  var slicedData = d3.ez.dataParse;
  var chartW = 0;
  var chartH = 0;
  var xScale = undefined;
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
    var maxValue = slicedData.maxValue();
    var seriesNames = slicedData.groupNames();

    // Convert dates
    data.forEach(function(d, i) {
      d.values.forEach(function(b, j) {
        data[i].values[j].key = new Date(b.key * 1000);
      });
    });
    dateDomain = d3.extent(data[0].values, function(d) { return d.key; });

    // X & Y Scales
    xScale = d3.scaleTime()
      .range([0, chartW])
      .domain(dateDomain);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, (maxValue * 1.05)]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat("%d-%b-%y"));
    yAxis = d3.axisLeft(yScale);

    // Colour Scale
    colorScale = d3.scaleOrdinal()
      .range(colors)
      .domain(seriesNames);
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
        .attr("width", chartW)
        .attr("height", chartH)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.select(".y-axis")
        .call(yAxis);

      var series = chart.selectAll(".series")
        .data(data)
        .enter().append("g")
        .attr("class", "series")
        .style("fill", function(d) { return colorScale(d.key); });

      var lineChart = d3.ez.component.lineChart()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var dots = d3.ez.component.scatterPlot()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      series.datum(function(d) { return d; })
        .call(dots)
        .call(lineChart);

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
