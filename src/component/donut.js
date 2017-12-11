/**
 * Reusable Donut Chart
 *
 * @example
 * var myBars = d3.ez.component.donut()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.donut = function module() {
  // Default Options (Configurable via setters)
  var height = 100;
  var width = 300;
  var colorScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
  var innerRadius = 70;

  function my(selection) {
    selection.each(function() {
      var radius = d3.min([width, height]) / 2;

      var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

      var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

      var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

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

      // Create Pie Chart Group
      var donutGroup = selection.selectAll('.donutGroup')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("donutGroup", true)
        .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
        .on("click", function(d) { dispatch.call("customClick", this, d); });

      donutGroup.append("g").attr("class", "slices");
      donutGroup.append("g").attr("class", "labels");
      donutGroup.append("g").attr("class", "lines");

      var donutGroup = selection.selectAll('.donutGroup');

      // Slices
      var slices = donutGroup.select(".slices")
        .selectAll("path.slice")
        .data(function(d) {
          return pie(d);
        });

      slices.enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d) { return colorScale(d.data.key); })
        .attr("d", arc)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(slices)
        .transition()
        .duration(transition.duration)
        .ease(transition.ease)
        .attrTween("d", arcTween);

      slices.exit()
        .remove();

      // Labels
      var labels = donutGroup.select(".labels")
        .selectAll("text.label")
        .data(function(d) {
          return pie(d);
        });

      labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .merge(labels)
        .transition()
        .duration(transition.duration)
        .text(function(d, i) {
          return d.data.key;
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
      var lines = donutGroup.select(".lines")
        .selectAll("polyline.line")
        .data(function(d) {
          return pie(d);
        });

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
  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
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
