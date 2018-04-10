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
  let width = 300;
  let height = 300;
  let radius;
  let startAngle = 0;
  let endAngle = 360;
  let capitalizeLabels = false;
  let textAnchor = "centre";
  let radialScale;

  /**
   * Initialise Data and Scales
   */
  function init(data) {
    // If the radius has not been passed then calculate it from width/height.
    radius = (typeof radius === 'undefined') ?
      (Math.min(width, height) / 2) :
      radius;
  }

  /**
   * Constructor
   */
  function my(selection) {
    let radData = radialScale.domain();

    selection.each(function(data) {
      init(data);

      let labelsSelect = selection.selectAll('.radialLabels')
        .data(function(d) { return [d]; });

      let labels = labelsSelect.enter()
        .append("g")
        .classed("radialLabels", true)
        .merge(labelsSelect);

      let defSelect = labels.selectAll("def")
        .data(radData);

      defSelect.enter()
        .append("def")
        .append("path")
        .attr("id", function(d, i) {
          return "radialLabelPath" + "-" + i;
        })
        .attr("d", function(d, i) {
          let r = radialScale(d);
          let arc = d3.arc().outerRadius(r).innerRadius(r);
          let pathConf = {
            startAngle: (startAngle * Math.PI) / 180,
            endAngle: (endAngle * Math.PI) / 180
          };
          let pathStr = arc(pathConf).split(/[A-Z]/);
          return "M" + pathStr[1] + "A" + pathStr[2];
        });

      let textSelect = labels.selectAll("text")
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
