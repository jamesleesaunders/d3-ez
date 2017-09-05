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
  var margin = {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
  };
  var canvasW = 580;
  var canvasH = 380;
  var chartTop = 0;
  var classed = "d3ez";

  var chart = undefined;
  var legend = undefined;
  var title = undefined;
  var creditTag = d3.ez.creditTag();
  var description = "";
  var yAxisLabel = "";

  // Colours
  var colors = d3.ez.colors.categorical(4);
  var colorScale = d3.scale.ordinal();

  // Dispatch (custom events)
  var dispatch = d3.dispatch("customHover");

  function init(data) {
    canvasW = width - (margin.left + margin.right);
    canvasH = height - (margin.top + margin.bottom);

    // Init Data
    if (!data[0]) { // TODO: Can this be done better?
      // If 1 dimensional data
      categories = d3.values(data)[1];
    } else {
      // If 2 dimensional data
      categories = data.map(function(d) {
        return d.values;
      })[0];
    }
    categoryNames = categories.map(function(d) {
      return d.key;
    });

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

    if (typeof chart.colors === "function") {
      chart.colors(colors);
    }

    // Init Credit Tag
    creditTag.text("d3ez.org").href("http://d3ez.org");
  }

  function my(selection) {
    selection.each(function(data) {
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = d3.select(this)
          .append("svg")
          .classed(classed, true);

        svg.attr({
          width: width,
          height: height
        });

        canvas = svg.append("g").classed("canvas", true);
        canvas.append("g").classed("chartbox", true);
        canvas.append("g").classed("legendbox", true);
        canvas.append("g").classed("titlebox", true);
        canvas.append("g").classed("creditbox", true);
      } else {
        canvas = svg.select(".canvas")
      }

      // Update the canvas dimensions
      canvas.attr({
          width: canvasW,
          height: canvasH
        })
        .attr({
          transform: "translate(" + margin.left + "," + margin.top + ")"
        });

      // Add Chart
      canvas.select(".chartbox")
        .datum(data)
        .attr({
          transform: "translate(" + 0 + "," + chartTop + ")"
        })
        .call(chart);

      // Add Legend
      if (legend) {
        if (typeof chart.colorScale === "function") {
          legend.colorScale(chart.colorScale());
        }
        if (typeof chart.sizeScale === "function") {
          legend.sizeScale(chart.sizeScale());
        }
        canvas.select(".legendbox")
          .attr({
            transform: "translate(" + (canvasW - legend.width()) + "," + title.height() + ")"
          })
          .call(legend);
      }

      // Add Title
      if (title) {
        canvas.select(".titlebox")
          .attr({
            transform: "translate(" + width / 2 + "," + 0 + ")"
          })
          .call(title);
      }

      // Add Credit Tag
      canvas.select(".creditbox")
        .attr({
          transform: "translate(" + (width - 20) + "," + (height - 20) + ")"
        })
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

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  d3.rebind(my, dispatch, "on");

  return my;
};
