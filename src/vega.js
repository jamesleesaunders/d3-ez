/**
 * Vega
 *
 * @example
 * @todo
 */
d3.ez.vega = function module() {
  // SVG and Canvas containers (Populated by 'my' function)
  var svg;
  var canvas;

  // Default Options (Configurable via setters)
  var width = 1000;
  var height = 600;
  var margin = { top: 30, right: 30, bottom: 30, left: 30 };
  var padding = 20;
  var canvasW = 580;
  var canvasH = 380;
  var chartTop = 0;
  var classed = "d3ez";

  var chart = undefined;
  var yScale = undefined;
  var yAxis = undefined;
  var xScale = undefined;
  var xAxis = undefined;
  var legend = undefined;
  var title = undefined;
  var creditTag = d3.ez.component.creditTag();
  var yAxisLabel = "";

  // Colours
  var colorScale = undefined;

  // Dispatch (custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    canvasW = width - (margin.left + margin.right);
    canvasH = height - (margin.top + margin.bottom);

    // Init Chart
    chart.colorScale(colorScale)
      .xScale(xScale)
      .yScale(yScale)
      .width(canvasW)
      .height(canvasH)
      .dispatch(dispatch);

    // Init Legend
    if (legend) {
      legend.width(120).height(200);
      chart.width(chart.width() - legend.width() - padding);
    }

    // Init Title
    if (title) {
      chartTop = title.height() + padding;
      chart.height(chart.height() - title.height() - padding);
    }

    // Have we changed the graph size?
    xScale.range([chart.width(), 0]);
    yScale.range([chart.height(), 0]);

    // Init Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    // Init Credit Tag
    creditTag.text("d3-ez.net").href("http://d3-ez.net");
  }

  function my(selection) {
    selection.each(function(data) {
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = d3.select(this)
          .append("svg")
          .classed(classed, true)
          .attr("width", width)
          .attr("height", height);

        canvas = svg.append("g").classed("canvas", true);
        canvas.append("g").classed("chartbox", true);
        canvas.select(".chartbox").append("g").classed("x-axis axis", true);
        canvas.select(".chartbox").append("g").classed("y-axis axis", true);
        canvas.append("g").classed("legendbox", true);
        canvas.append("g").classed("titlebox", true);
        svg.append("g").classed("creditbox", true);
      } else {
        canvas = svg.select(".canvas")
      }

      // Update the canvas dimensions
      canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", canvasW)
        .attr("height", canvasH);

      // Add Chart
      canvas.select(".chartbox")
        .attr("transform", "translate(0," + chartTop + ")")
        .datum(data)
        .call(chart);

      canvas.select(".y-axis")
        .call(yAxis);

      canvas.select(".x-axis")
        .attr("transform", "translate(0," + chart.height() + ")")
        .call(xAxis);

      // Add Title
      if (title) {
        canvas.select(".titlebox")
          .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
          .call(title);
      }

      // Add Legend
      if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
        if (typeof chart.colorScale === "function") {
          legend.colorScale(chart.colorScale());
        }
        if (typeof chart.sizeScale === "function") {
          legend.sizeScale(chart.sizeScale());
        }
        canvas.select(".legendbox")
          .attr("transform", "translate(" + (canvasW - legend.width()) + "," + chartTop + ")")
          .call(legend);
      }

      // Add Credit Tag
      if (creditTag) {
        svg.select(".creditbox")
          .attr("transform", "translate(" + (width - 10) + "," + (height - 5) + ")")
          .call(creditTag);
      }
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

  my.chart = function(_) {
    if (!arguments.length) return chart;
    chart = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return this;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return this;
  };

  my.legend = function(_) {
    if (!arguments.length) return legend;
    legend = _;
    return this;
  };

  my.title = function(_) {
    if (!arguments.length) return title;
    if (typeof _ === "string") {
      // If the caller has passed a plain string convert it to a title object.
      title = d3.ez.title().mainText(_).subText('');
    } else {
      title = _;
    }
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  }

  return my;
};
