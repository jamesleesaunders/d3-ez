/**
 * Reusable Circular Labels
 *
 */
d3.ez.component.circularLabels = function module() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var radius;
  var capitalizeLabels = false;

  function my(selection) {
    selection.each(function(data) {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      var labels = selection.selectAll('.circularLabels')
        .data(function(d) { return [d]; })
        .enter()
        .append("g")
        .classed("circularLabels", true);
      labels = selection.selectAll('.circularLabels').merge(labels);

      // Labels
      labels.selectAll("def")
        .data([radius])
        .enter()
        .append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", function(d) {
          return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
        });

      labels.selectAll("text")
        .data(function(d) { return d; })
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i, j) {
          numBars = j.length;
          return i * 100 / numBars + 50 / numBars + "%";
        })
        .text(function(d) {
          return capitalizeLabels ? d.toUpperCase() : d;
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

  return my;
};
