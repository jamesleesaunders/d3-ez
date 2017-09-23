/**
 * Chart Base
 *
 * @example
 * @todo
 */
d3.ez.chart = function module() {
  // SVG and Canvas containers (Populated by 'my' function)
  var svg;
  var canvas;

  // Default Options (Configurable via setters)
  var width = 600;
  var height = 400;
  var margin = { top: 15, right: 15, bottom: 15, left: 15 };
  var canvasW = 580;
  var canvasH = 380;
  var chartTop = 0;
  var classed = "d3ez";

  var chart = undefined;
  var legend = undefined;
  var title = undefined;
  var creditTag = d3.ez.component.creditTag();
  var description = "";
  var yAxisLabel = "";

  // Colours
  var colorScale = undefined;

  // Dispatch (custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    canvasW = width - (margin.left + margin.right);
    canvasH = height - (margin.top + margin.bottom);

    // Init Chart
    chart.dispatch(dispatch)
      .width(canvasW)
      .height(canvasH);

    // Init Legend
    if (legend) {
      legend.width(150).height(200);
      chart.width(chart.width() - legend.width());
    }

    // Init Title
    if (title) {
      chartTop = title.height();
      chart.height(chart.height() - title.height());
    }

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
        canvas.append("g").classed("legendbox", true);
        canvas.append("g").classed("titlebox", true);
        canvas.append("g").classed("creditbox", true);
      } else {
        canvas = svg.select(".canvas")
      }

      // Update the canvas dimensions
      canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")" )
        .attr("width", canvasW)
        .attr("height", canvasH);

      // Add Chart
      canvas.select(".chartbox")
        .datum(data)
        .attr("transform", "translate(" + 0 + "," + chartTop + ")")
        .call(chart);

      // Add Legend
      if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
        if (typeof chart.colorScale === "function") {
          legend.colorScale(chart.colorScale());
        }
        if (typeof chart.sizeScale === "function") {
          legend.sizeScale(chart.sizeScale());
        }
        canvas.select(".legendbox")
          .attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")")
          .call(legend);
      }

      // Add Title
      if (title) {
        canvas.select(".titlebox")
          .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
          .call(title);
      }

      // Add Credit Tag
      canvas.select(".creditbox")
        .attr("transform", "translate(" + (width - 20) + "," + (height - 20) + ")" )
        .call(creditTag);
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
