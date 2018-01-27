/**
 * Reusable Circular Labels Component
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

      var labelsSelect = selection.selectAll('.circularLabels')
        .data(function(d) { return [d]; });

      var labels = labelsSelect.enter()
        .append("g")
        .classed("circularLabels", true)
        .merge(labelsSelect);

      // Labels
      var defSelect = labels.selectAll("def")
        .data([radius]);

      defSelect.exit()
        .remove();

      defSelect.enter()
        .append("def")
        .append("path")
        .attr("id", "label-path")
        .merge(defSelect)
        .attr("d", function(d) {
          return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
        });

      var textSelect = labels.selectAll("text")
        .data(function(d) { return d; });

      textSelect.exit()
        .remove();

      textSelect.enter()
        .append("text")
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .merge(textSelect);

      textSelect.transition()
        .select("textPath")
        .text(function(d) {
          return capitalizeLabels ? d.toUpperCase() : d;
        })
        .attr("startOffset", function(d, i, j) {
          var numBars = j.length;
          return i * 100 / numBars + 50 / numBars + "%";
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

  return my;
};
