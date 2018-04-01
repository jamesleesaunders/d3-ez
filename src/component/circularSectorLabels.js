import * as d3 from "d3";
import { default as palette } from "../palette";
import { default as dataParse } from "../dataParse";


/**
 * Reusable Circular Labels Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  var width = 400;
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
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
  }

  /**
   * Constructor
   */
  function my(selection) {
    selection.each(function(data) {
      init(data);

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

      var tickCount;
      var tickData = [];
      if (typeof radialScale.ticks === "function") {
        // scaleLinear
        var min = d3.min(radialScale.domain());
        var max = d3.max(radialScale.domain());
        tickCount = radialScale.ticks().length;
        var tickIncrement = (max - min) / tickCount;
        for (var i = 0; i <= tickCount; i++) {
          tickData[i] = (tickIncrement * i).toFixed(0);
        }
      } else {
        // scaleBand
        tickData = radialScale.domain();
        tickCount = tickData.length;
      }

      var textSelect = labels.selectAll("text")
        .data(function(d) {
          var tickScale = d3.scaleLinear()
            .domain([0, tickCount])
            .range(radialScale.range());

          return tickData.map(function(d, i) {
            return {
              value: d,
              offset: ((tickScale(i) / 360) * 100)
            }
          });
        });

      textSelect.exit()
        .remove();

      textSelect.enter()
        .append("text")
        .style("text-anchor", textAnchor)
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .text(function(d) {
          var text = d.value;
          return capitalizeLabels ? text.toUpperCase() : text;
        })
        .attr("startOffset", function(d) {
          return d.offset + "%";
        })
        .attr("id", function(d) { return d.value; })
        .merge(textSelect);

      textSelect.transition()
        .select("textPath")
        .text(function(d) {
          var text = d.value;
          return capitalizeLabels ? text.toUpperCase() : text;
        })
        .attr("startOffset", function(d) {
          return d.offset + "%";
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

  my.capitalizeLabels = function(_) {
    if (!arguments.length) return capitalizeLabels;
    capitalizeLabels = _;
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
