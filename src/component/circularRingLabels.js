/**
 * Reusable Radial Labels Component
 *
 */
export default function() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var radialScale;
  var radius;
  var capitalizeLabels = false;
  var textAnchor = "centre";

  function my(selection) {
    selection.each(function(data) {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      // Unique id so that the text path defs are unique - is there a better way to do this?
      var id = 'jim';
      var radData = radialScale.domain();

      var labelsSelect = selection.selectAll('.radialLabels')
        .data(function(d) { return [d]; });

      var labels = labelsSelect.enter()
        .append("g")
        .classed("radialLabels", true)
        .merge(labelsSelect);

      var defSelect = labels.selectAll("def")
        .data(radData);

      defSelect.enter()
        .append("def")
        .append("path")
        .attr("id", function(d, i) {
          return "radialLabelPath" + id + "-" + i;
        })
        .attr("d", function(d, i) {
          var r = radialScale(d);
          var arc = d3.arc().outerRadius(r).innerRadius(r);
          var startAngle = 0, endAngle = 358;
          var pathConf = {
            startAngle: (startAngle * Math.PI) / 180,
            endAngle:   (endAngle * Math.PI) / 180
          };
          var pathStr = arc(pathConf).split(/[A-Z]/);
          return "M" + pathStr[1] + "A" + pathStr[2];
          // return "A0 " + -r + " A" + r + " " + r + " 0 1,1 -0.01 0";
        });

      var textSelect = labels.selectAll("text")
        .data(radData);

      textSelect.enter()
        .append("text")
        .style("text-anchor", "start")
        .attr("dy", -5)
        .attr("dx", 5)
        .append("textPath")
        .attr("xlink:href", function(d, i) {
          return "#radialLabelPath" + id + "-" + i;
        })
        .attr("startOffset", "0%")
        .text(function(d) {
          return d;
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

  my.radialScale = function(_) {
    if (!arguments.length) return radialScale;
    radialScale = _;
    return my;
  };

  my.textAnchor = function(_) {
    if (!arguments.length) return textAnchor;
    textAnchor = _;
    return this;
  };

  return my;
};
