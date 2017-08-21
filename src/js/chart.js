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
    var margin             = {top: 20, right: 20, bottom: 20, left: 20};
    var classed            = "d3ez";

    // Data
    var categories         = [];

    // Colours
    var colors             = d3.ez.colors.categorical(4);
    var colorScale         = d3.scale.ordinal();

    // Title
    var title              = d3.ez.title();

    // Legend
    var legend             = d3.ez.legend();

    // Credit Tag
    var creditTag          = d3.ez.creditTag();

    // Dispatch (Custom events)
    var dispatch           = d3.dispatch("customHover");

    function init(data) {
      // Init Container
      containerW = width  - (margin.left + margin.right);
      containerH = height - (margin.top + margin.bottom);

      // Init Data
      categories = d3.values(data)[1].map(function(d) { return d.key; });

      // Init Colours
      colorScale.domain(categories).range(colors);

      // Init Legend
      legend.colorScale(colorScale);

      // Init creditTag
      creditTag.text("d3ez.org").href("http://d3ez.org");
    }

    function my(selection) {
      selection.each(function(data) {
          // Initialise Data
          init(data);

          // Create SVG element (if it does not exist already)
          if (!svg) {
              svg = d3.select(this)
                  .append("svg")
                  .classed(classed, true);

              var container = svg.append("g").classed("container", true);
              container.append("g").classed("title", true);
              container.append("g").classed("chart", true);
              container.append("g").classed("legend", true);
              container.append("g").classed("credit", true);
          }

          // Update Container Dimensions
          svg.attr({width: width, height: height});
          var container = svg.select(".container")
              .attr({width: containerW, height: containerH})
              .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

          // Add Title
          container.select(".title")
              .attr({transform: "translate(" + width / 2 + "," + 0 + ")"})
              .call(title);

          // Add Chart
          container.select(".chart")
              .attr({transform: "translate(" + 0 + "," + 0 + ")"})
              ;//.call(chart);

          // Add Legend
          container.select(".legend")
              .attr({transform: "translate(" + (width - (margin.right + legend.width())) + "," + (margin.top + 25) + ")"})
              .call(legend);

          // Add Credit Tag
          container.select(".credit")
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

    my.height= function(_) {
        if (!arguments.length) return height;
        height = _;
        return this;
    };

    my.classed = function(_) {
        if (!arguments.length) return classed;
        classed = _;
        return this;
    };

    my.title = function(_) {
        if (!arguments.length) return title.mainText();
        title.mainText(_)
        return this;
    };

    my.description = function(_) {
        if (!arguments.length) return title.subText();
        title.subText(_)
        return this;
    };

    my.colors = function(_) {
        if (!arguments.length) return colors;
        colors = _;
        return this;
    };

    my.legend = function(_) {
        if (!arguments.length) return legend();
        legend = _;
        return this;
    };

    d3.rebind(my, dispatch, "on");

    return my;
};
