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
d3.ez.chart.donut = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeCubic, duration: 750 };
  var classed = "chartDonut";
  var colors = d3.ez.colors.categorical(4);
  var radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
  var innerRadius = 70;

  // Data Options (Populated by 'init' function)
  var values = [];
  var categoryNames = [];
  var colorScale = undefined;
  var pie = undefined;
  var arc = undefined;
  var outerArc = undefined;
  var key = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function init(data) {
    values = d3.values(data)[1].map(function(d) {
      return d.value;
    });
    categoryNames = d3.values(data)[1].map(function(d) {
      return d.key;
    });

    pie = d3.pie()
      .sort(null);

    arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }
  }

  function key(d, i) {
    return data.values[i].key;
  }

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

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
					return selection.append("svg");
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
        chart.append("g").attr("class", "slices");
        chart.append("g").attr("class", "labels");
        chart.append("g").attr("class", "lines");
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")")
        .attr("width", width)
        .attr("height", height);

      // Slices
      var slices = chart.select(".slices")
        .selectAll("path.slice")
        .data(pie(values));

      slices.enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d, i) {
          return colorScale(data.values[i].key);
        })
        .attr("d", arc)
        .each(function(d) {
          this._current = d;
        })
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
				.merge(slices)
				.transition()
				.duration(transition.duration)
        .ease(transition.ease)
        .attrTween("d", arcTween);

      slices.exit()
        .remove();

      // Labels
      var labels = chart.select(".labels")
        .selectAll("text.label")
        .data(pie(values), key);

      labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
				.merge(labels)
				.transition()
				.duration(transition.duration)
        .text(function(d, i) {
          return data.values[i].key;
        })
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      labels.exit()
        .remove();

      // Slice to Label Lines
      var lines = chart.select(".lines")
        .selectAll("polyline.line")
        .data(pie(values));

      lines.enter()
        .append("polyline")
        .attr("class", "line")
				.merge(lines)
				.transition()
				.duration(transition.duration)
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

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
