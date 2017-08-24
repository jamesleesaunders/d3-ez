/**
 * Donut Chart
 *
 * @example
 * var myChart = d3.ez.donutChart()
 *     .width(400)
 *     .height(300)
 *     .radius(200)
 *     .innerRadius(50);
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.donutChart = function module() {
    // SVG container (Populated by 'my' function)
    var chart;

    // Default Options (Configurable via setters)
    var width              = 400;
    var height             = 300;
    var margin             = {top: 20, right: 20, bottom: 20, left: 20};
    var transition         = {ease: "cubic", duration: 300};
    var classed            = "donutChart";
    var colors             = d3.ez.colors.categorical(4);
    var radius             = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
    var innerRadius        = 70;

    // Data Options (Populated by 'init' function)
    var values             = [];
    var categoryNames      = [];
    var colorScale         = undefined;
    var pie                = undefined;
    var arc                = undefined;
    var outerArc           = undefined;
    var key                = undefined;

    // Dispatch (Custom events)
    var dispatch           = d3.dispatch("customHover");

    function init(data) {
        values = d3.values(data)[1].map(function(d) { return d.value; });
        categoryNames = d3.values(data)[1].map(function(d) { return d.key; });

        pie = d3.layout.pie()
            .sort(null);

        arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        outerArc = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        if(!colorScale) {
          // If the colorScale has not already been passed
          // then attempt to calculate.
          colorScale = d3.scale.ordinal()
              .range(colors)
              .domain(categoryNames);
        }
    }

    function key(d, i) {
        return data.values[i].key;
    };

    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function my(selection) {
        selection.each(function(data) {
          // Initialise Data
          init(data);

          // Create chart element (if it does not exist already)
          if (!chart) {
              var chart = selection.append("g").classed(classed, true);
              chart.append("g").attr("class", "slices");
              chart.append("g").attr("class", "labels");
              chart.append("g").attr("class", "lines");
          }

          // Update the outer dimensions
          chart.attr({width: width, height: height});

          // Locate the center point
          chart.attr("transform", "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")");

          // Slices
          var slices = d3.select(".slices")
              .selectAll("path.slice")
              .data(pie(values));

          slices.enter()
              .append("path")
              .attr("class", "slice")
              .attr("fill", function(d, i) { return colorScale(data.values[i].key); })
              .attr("d", arc)
              .each(function(d) { this._current = d; } )
              .on("mouseover", dispatch.customHover);

          slices.transition()
              .ease(transition.ease)
              .duration(transition.duration)
              .attrTween("d", arcTween);

          slices.exit()
              .remove();

          // Labels
          var labels = d3.select(".labels")
              .selectAll("text.label")
              .data(pie(values), key);

          labels.enter()
              .append("text")
              .attr("class", "label")
              .attr("dy", ".35em");

          labels.transition()
              .duration(transition.duration)
              .text(function(d, i) { return data.values[i].key; })
              .attrTween("transform", function(d) {
                  this._current = this._current || d;
                  var interpolate = d3.interpolate(this._current, d);
                  this._current = interpolate(0);
                  return function(t) {
                      var d2 = interpolate(t);
                      var pos = outerArc.centroid(d2);
                      pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
                      return "translate("+ pos +")";
                  };
              })
              .styleTween("text-anchor", function(d) {
                  this._current = this._current || d;
                  var interpolate = d3.interpolate(this._current, d);
                  this._current = interpolate(0);
                  return function(t) {
                      var d2 = interpolate(t);
                      return midAngle(d2) < Math.PI ? "start":"end";
                  };
              });

          labels.exit()
              .remove();

          // Slice to Label Lines
          var lines = d3.select(".lines")
              .selectAll("polyline.line")
              .data(pie(values));

          lines.enter()
              .append("polyline")
              .attr("class", "line");

          lines.transition().duration(transition.duration)
              .attrTween("points", function(d) {
                  this._current = this._current || d;
                  var interpolate = d3.interpolate(this._current, d);
                  this._current = interpolate(0);
                  return function(t) {
                      var d2 = interpolate(t);
                      var pos = outerArc.centroid(d2);
                      pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
                      return [arc.centroid(d2), outerArc.centroid(d2), pos];
                  };
              });

          lines.exit()
              .remove();
      });
    }

    // Configuration Getters & Setters
    my.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
        return this;
    };

    my.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
        return this;
    };

    my.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
        return this;
    };

    my.radius = function(_) {
        if (!arguments.length) return radius;
        radius = _;
        return this;
    };

    my.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
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

    d3.rebind(my, dispatch, "on");

    return my;
};
