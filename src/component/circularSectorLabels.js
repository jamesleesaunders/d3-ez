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
    selection.each(function(data) {
      init(data);

      // Tick Data Generator
      let tickData = function() {
        let tickCount = 0;
        let tickArray = [];

        if (typeof radialScale.ticks === "function") {
          // scaleLinear
          let min = d3.min(radialScale.domain());
          let max = d3.max(radialScale.domain());
          tickCount = radialScale.ticks().length;
          let tickIncrement = (max - min) / tickCount;
          for (let i = 0; i <= tickCount; i++) {
            tickArray[i] = (tickIncrement * i).toFixed(0);
          }
        } else {
          // scaleBand
          tickArray = radialScale.domain();
          tickCount = tickArray.length;
        }

        let tickScale = d3.scaleLinear()
          .domain([0, tickCount])
          .range(radialScale.range());

        return tickArray.map(function(d, i) {
          return {
            value: d,
            offset: ((tickScale(i) / 360) * 100)
          }
        });
      }

      // Unique id so that the text path defs are unique - is there a better way to do this?
      let uId = selection.attr("id") ?
        selection.attr("id") :
        "uid-" + Math.floor(1000 + Math.random() * 9000);
      selection.attr("id", uId);

      let labelsSelect = selection.selectAll('.circularLabels')
        .data(function(d) { return [tickData()]; });

      let labels = labelsSelect.enter()
        .append("g")
        .classed("circularLabels", true)
        .merge(labelsSelect);

      // Labels
      let defSelect = labels.selectAll("def")
        .data([radius]);

      defSelect.enter()
        .append("def")
        .append("path")
        .attr("id", function() {
          let pathId = selection.attr("id") + "-path";
          return pathId;
        })
        .attr("d", function(d) {
          return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
        })
        .merge(defSelect);

      defSelect.exit()
        .remove();

      let textSelect = labels.selectAll("text")
        .data(function(d) { return d; });

      textSelect.enter()
        .append("text")
        .style("text-anchor", textAnchor)
        .append("textPath")
        .attr("xlink:href", function() {
          let pathId = selection.attr("id") + "-path";
          return "#" + pathId;
        })
        .text(function(d) {
          let text = d.value;
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
          let text = d.value;
          return capitalizeLabels ? text.toUpperCase() : text;
        })
        .attr("startOffset", function(d) {
          return d.offset + "%";
        });

      textSelect.exit()
        .remove();
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
