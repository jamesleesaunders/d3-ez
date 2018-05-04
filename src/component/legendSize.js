import * as d3 from "d3";

/**
 * Reusable Legend Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let width = 100;
  let height = 150;
  let sizeScale = undefined;
  let items = 4;

  /**
   * Constructor
   */
  function my(selection) {
    height = (height ? height : this.attr("height"));
    width = (width ? width : this.attr("width"));

    // Legend Box
    let legendSelect = selection.selectAll("#legendBox")
      .data([0]);

    let legend = legendSelect.enter()
      .append("g")
      .attr("id", "legendBox")
      .attr("width", width)
      .attr("height", height)
      .merge(legendSelect);

    let data = function() {
      // Calculate radiusScale
      let valueMin = d3.min(sizeScale.domain());
      let valueMax = d3.max(sizeScale.domain());
      let valueStep = (valueMax - valueMin) / (items - 1);
      let valueRange = Array(items).fill().map(function(v, i) {
        return valueMin + (valueStep * i);
      });

      // Calculate yScale
      let yStep = height / (items * 2);
      let yDomain = [0, (items - 1)];
      let yRange = [yStep, (height - yStep)];
      let yScale = d3.scaleLinear()
        .domain(yDomain)
        .range(yRange);

      return valueRange.map(function(v, i) {
        return {
          x: sizeScale(valueMax),
          y: yScale(i),
          r: sizeScale(valueRange[i]),
          text: v
        }
      });
    };

    let elementSelect = legend.selectAll(".legendItem")
      .data(data);

    let elements = elementSelect.enter()
      .append("g")
      .classed("legendItem", true)
      .attr("transform", function(d) {
        return "translate(0," + d.y + ")";
      })
      .merge(elementSelect);

    elements.exit()
      .remove();

    elements.append("circle")
      .attr("r", function(d) { return d.r; })
      .attr("cx", function(d) { return d.x; })
      .style("fill", "#ff0000")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);

    elements.append("text")
      .text(function(d) { return d.text; })
      .attr("dominant-baseline", "middle")
      .attr("dx", function(d) { return (d.x * 2) + 5; });
  }

  /**
   * Configuration Getters & Setters
   */
  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return my;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return my;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return my;
  };

  my.items = function(_) {
    if (!arguments.length) return items;
    items = _;
    return my;
  };

  return my;
}
