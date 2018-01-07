/**
 * Reusable Circular Heat Ring
 *
 */
d3.ez.component.heatRing = function module() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
	var radius = 150;
	var innerRadius = 20;
	var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
	var xScale;
	var yScale;
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

  function my(selection) {
		var defaultRadius = Math.min(width, height) / 2;
		radius = (typeof radius === 'undefined') ? defaultRadius : radius;
		innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

		// Pie Generator
		var pie = d3.pie()
			.value(1)
			.sort(null)
			.padAngle(0.015);

		// Arc Generator
		var arc = d3.arc()
			.outerRadius(radius)
			.innerRadius(innerRadius)
			.cornerRadius(2);

    selection.each(function() {
      // Create chart group
      var series = selection.selectAll('.series')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("series", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); });
      series = selection.selectAll('.series').merge(series);

      var segments = series.selectAll(".segment")
        .data(function(d) {
          var key = d.key;
          var data = pie(d.values);
          data.forEach(function(d, i) {
            data[i].key = key;
          });

          return data;
        });

      // Ring Segments
      segments
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
          return colorScale(d.data.value);
        })
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d.data); });

      segments.exit().remove();
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

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
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
