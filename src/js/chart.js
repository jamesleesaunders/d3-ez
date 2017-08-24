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
    var width              = 600;
    var height             = 400;
    var margin             = {top: 10, right: 10, bottom: 10, left: 10};
    var containerW         = 580;
    var containerH         = 380;
    var classed            = "d3ez";

    var chart              = undefined;
    var legend             = undefined;
    var title              = undefined;
    var creditTag          = d3.ez.creditTag();
    var description        = "";
    var yAxisLabel         = "";

    // Colours
    var colors             = d3.ez.colors.categorical(4);
    var colorScale         = d3.scale.ordinal();

    // Dispatch (custom events)
    var dispatch           = d3.dispatch("customHover");

    function init(data) {
      containerW = width  - (margin.left + margin.right);
      containerH = height - (margin.top + margin.bottom);

      // Init Data
      if(!data[0]) {   // TODO: Can this be done better?
        // If 1 dimensional data
        categories = d3.values(data)[1];
      } else {
        // If 2 dimensional data
        categories = data.map(function(d) { return d.values; })[0];
      }
      categoryNames = categories.map(function(d) { return d.key; });

      // Init Legend
      legend.width(150).height(200);

      // Init Chart
      chart.dispatch(dispatch)
        .width(containerW - legend.width())
        .height(containerH - title.height())
        .colors(colors);

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

              var container = svg.append("g").classed("container", true);
              container.append("g").classed("chartbox", true);
              container.append("g").classed("legendbox", true);
              container.append("g").classed("titlebox", true);
              container.append("g").classed("creditbox", true);
          }

          // Update Container Dimensions
          svg.attr({width: width, height: height});
          var container = svg.select(".container")
              .attr({width: containerW, height: containerH})
              .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

          // Add Chart
          container.select(".chartbox")
              .datum(data)
              .attr({transform: "translate(" + 0 + "," + title.height() + ")"})
              .call(chart);

          // Add Legend
          if(typeof chart.colorScale === "function") {
            legend.colorScale(chart.colorScale());
          }
          if(typeof chart.sizeScale === "function") {
            legend.sizeScale(chart.sizeScale());
          }
          container.select(".legendbox")
              .attr({transform: "translate(" + (containerW - legend.width()) + "," + title.height() + ")"})
              .call(legend);

          // Add Title
          container.select(".titlebox")
              .attr({transform: "translate(" + width / 2 + "," + 0 + ")"})
              .call(title);

          // Add Credit Tag
          container.select(".creditbox")
              .attr({transform: "translate(" + (width - 20) + "," + (height - 20) + ")"})
              .call(creditTag);
        }
      );
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
