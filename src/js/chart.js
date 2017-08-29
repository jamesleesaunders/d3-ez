/**
 * Chart Base
 *
 * @example
 * @todo
 */
d3.ez.chart = function module() {
  // SVG container (Populated by 'my' function)
  var svg;

  // Default Options (Configurable via setters)
  var width = 600;
  var height = 400;
  var margin = {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
  };
  var containerW = 580;
  var containerH = 380;
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
    containerW = width - (margin.left + margin.right);
    containerH = height - (margin.top + margin.bottom);

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
      .width(containerW)
      .height(containerH);

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

  function isSVG(selection) {
    if(!selection) return false
    el = selection[0][0]
    return !! el.ownerSVGElement || el.tagName === "svg";
  }

  function my(selection) {
    selection.each(function(data) {
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = d3.select(this)
          .append("svg")
          .classed(classed, true);

        var container = svg.append("g").classed("container", true);
        container.append("g").classed("chartbox", true);
        container.append("g").classed("legendbox", true);
        container.append("g").classed("titlebox", true);
        container.append("g").classed("creditbox", true);
      }

      // Update Container Dimensions
      svg.attr({
        width: width,
        height: height
      });
      var container = svg.select(".container")
        .attr({
          width: containerW,
          height: containerH
        })
        .attr({
          transform: "translate(" + margin.left + "," + margin.top + ")"
        });

      // Add Chart
      container.select(".chartbox")
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
        container.select(".legendbox")
          .attr({
            transform: "translate(" + (containerW - legend.width()) + "," + title.height() + ")"
          })
          .call(legend);
      }

      // Add Title
      if (title) {
        container.select(".titlebox")
          .attr({
            transform: "translate(" + width / 2 + "," + 0 + ")"
          })
          .call(title);
      }

      // Add Credit Tag
      container.select(".creditbox")
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

  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
    return this;
  };

  d3.rebind(my, dispatch, "on");

  return my;
};
