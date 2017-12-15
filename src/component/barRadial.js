/**
 * Reusable Radial Bar Chart
 *
 * @example
 * var myBars = d3.ez.component.barRadial()
 *     .colorScale(**D3 Scale Object**);
 * d3.select("svg").call(myBars);
 */
d3.ez.component.barRadial = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var colorScale = undefined;
  var yScale = undefined;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
  var radius = undefined;
  var capitalizeLabels = false;
  var colorLabels = false;

  function my(selection) {
    selection.each(function() {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;
      var labelRadius = radius * 1.050;

      var yDomain = yScale.domain();
      // yDomain[1] = yDomain[1] * 1.05;
      var barScale = d3.scaleLinear().domain(yDomain).range([0, radius]);
      var axisScale = d3.scaleLinear().domain(yDomain).range([0, -radius]);

      // Arc Generator
      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function(d, i) {
          return barScale(d.value);
        })
        .startAngle(function(d, i, j) {
          numBars = j.length;
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function(d, i, j) {
          numBars = j.length;
          return ((i + 1) * 2 * Math.PI) / numBars;
        });

      // Create chart croup
      var radialChart = selection.selectAll('.chartRadialBar')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("chartRadialBar", true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .on("click", function(d) { dispatch.call("customClick", this, d); });

      radialChart.append("g").attr("class", "tickCircles");
      radialChart.append("g").attr("class", "segments");
      radialChart.append("g").attr("class", "spokes");
      radialChart.append("g").attr("class", "axis");
      radialChart.append("g").attr("class", "outerCircle");
      radialChart.append("g").attr("class", "labels");

      var radialChart = selection.selectAll('.chartRadialBar').merge(radialChart);

      // Concentric tick circles
      var tickCircles = radialChart.select(".tickCircles")
        .selectAll("circle")
        .data(barScale.ticks().slice(0, -1));

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
        .merge(tickCircles)
        .transition()
        .attr("r", function(d) {
          return barScale(d);
        });

      tickCircles.exit()
        .remove();

      // Segment enter/exit/update
      var segments = radialChart.select(".segments")
        .selectAll("path")
        .data(function(d) { return d; });

      segments.enter()
        .append("path")
        .style("fill", function(d, i) {
          return colorScale(d.key);
        })
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customMouseOver", this, d); })
        .merge(segments)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("d", arc);

      segments.exit()
        .remove();

      // Spokes
      var spokes = radialChart.select(".spokes")
        .selectAll("line")
        .data(function(d) { return d; })
        .enter()
        .append("line")
        .attr("y2", -radius)
        .attr("transform", function(d, i, j) {
          numBars = j.length;
          return "rotate(" + (i * 360 / numBars) + ")";
        });

      // Axis
      var axis = d3.axisRight(axisScale);
      axis = radialChart.select(".axis")
        .call(axis);

      // Outer Circle
      var outerCircle = radialChart.select(".outerCircle")
      outerCircle.selectAll("circle")
        .data([radius])
        .enter()
        .append("circle")
        .attr("r", function(d) { return d; })
        .style("fill", "none");

      // Labels
      var labels = radialChart.select(".labels");
      labels.selectAll("def")
        .data([labelRadius])
        .enter()
        .append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", function(d) {
          return "m0 " + -d+ " a" + d + " " + d + " 0 1,1 -0.01 0";
        });

      labels.selectAll("text")
        .data(function(d) { return d; })
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("fill", function(d, i) {
          return colorLabels ? colorScale(d.key) : '#000000';
        })
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i, j) {
          numBars = j.length;
          return i * 100 / numBars + 50 / numBars + "%";
        })
        .text(function(d) {
          var text = d.key;
          return capitalizeLabels ? text.toUpperCase() : text;
        });
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

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
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
