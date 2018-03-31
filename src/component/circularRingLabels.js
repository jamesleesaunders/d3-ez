import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";


/**
 * Reusable Radial Labels Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 300;
  var height = 300;
  var radius;
  var startAngle = 0;
  var endAngle = 360;
  var capitalizeLabels = false;
  var textAnchor = "centre";
  var radialScale;

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    /* TODO */
  }

  /**
   * Constructor
   */
  function my(selection) {
    selection.each(function(data) {
      init(data);

      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      // Unique id so that the text path defs are unique - is there a better way to do this?
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
          return "radialLabelPath" + "-" + i;
        })
        .attr("d", function(d, i) {
          var r = radialScale(d);
          var arc = d3.arc().outerRadius(r).innerRadius(r);
          var pathConf = {
            startAngle: (startAngle * Math.PI) / 180,
            endAngle: (endAngle * Math.PI) / 180
          };
          var pathStr = arc(pathConf).split(/[A-Z]/);
          return "M" + pathStr[1] + "A" + pathStr[2];
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
          return "#radialLabelPath" + "-" + i;
        })
        .attr("startOffset", "0%")
        .text(function(d) {
          return d;
        });

    });
  }

  /**
   * Configuration Getters & Setters
   */
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

  my.startAngle = function(_) {
    if (!arguments.length) return startAngle;
    startAngle = _;
    return this;
  };

  my.endAngle = function(_) {
    if (!arguments.length) return endAngle;
    endAngle = _;
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
