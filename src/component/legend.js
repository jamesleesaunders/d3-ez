import * as d3 from "d3";

/**
 * Reusable Legend Component
 *
 */
export default function() {

  /**
   * Default Properties
   */
  let sizeScale = undefined;
  let sizeLabel = null;
  let colorScale = undefined;
  let colorLabel = null;
  let title = null;
  let width = 100;
  let height = 150;
  let opacity = 0.7;
  let fill = "#ffffff";
  let stroke = "#000000";
  let strokewidth = "1px";
  let spacing = 5;

  /**
   * Constructor
   */
  function my(selection) {
    height = (height ? height : this.attr("height"));
    width = (width ? width : this.attr("width"));

    // Legend Box
    let legendBox = selection.selectAll("#legendBox")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "legendBox");

    legendBox.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill-opacity", opacity)
      .attr("fill", fill)
      .attr("stroke-width", strokewidth)
      .attr("stroke", stroke);

    let legendTitle = legendBox.append("g")
      .attr("transform", "translate(5, 15)");

    legendTitle.append("text")
      .style("font-weight", "bold")
      .text(title);

    let y = 10;
    let numElements, elementHeight, text;
    // Size Key
    if (typeof sizeScale !== "undefined") {
      // Calcualate a range of 5 numbers between min and max of range
      let min = d3.min(sizeScale.range());
      let max = d3.max(sizeScale.range());
      let diff = max - min;
      let step = diff / 4;
      let range = [];
      range[0] = min;
      for (let s = 1; s < 5; s++) {
        range[s] = range[s - 1] + step;
      }
      sizeScale.range(range);

      numElements = sizeScale.range().length;
      elementHeight = ((height - 45) / numElements);

      let sizeKey = legendBox.append("g")
        .attr("transform", "translate(5, 20)");

      for (let size = 0; size < numElements; size++) {
        sizeKey.append("circle")
          .attr("cx", 17)
          .attr("cy", y)
          .attr("fill", "lightgrey")
          .attr("stroke-width", "1px")
          .attr("stroke", "grey")
          .attr("fill-opacity", 0.8)
          .attr("r", sizeScale.range()[size]);

        text = keyScaleRange("size", size);

        sizeKey.append("text")
          .attr("x", 40)
          .attr("y", y + 5)
          .text(text);

        y = y + (elementHeight + spacing);
      }
    }

    // Colour Key
    if (typeof colorScale !== "undefined") {
      numElements = colorScale.domain().length;
      elementHeight = ((height - 45) / numElements) - 5;

      let colorKey = legendBox.append("g")
        .attr("transform", "translate(5, 20)");

      for (let index = 0; index < numElements; index++) {
        colorKey.append("rect")
          .attr("x", 10)
          .attr("y", y)
          .attr("fill", colorScale.range()[index])
          .attr("stroke-width", "1px")
          .attr("stroke", "grey")
          .attr("fill-opacity", 0.8)
          .attr("width", 20)
          .attr("height", elementHeight);

        if (!isNaN(colorScale.domain()[index])) {
          // If the scale is a threshold scale.
          text = keyScaleRange("threshold", index);
        } else {
          text = colorScale.domain()[index];
        }

        colorKey.append("text")
          .attr("x", 40)
          .attr("y", y + 10)
          .text(text);
        y = y + (elementHeight + spacing);
      }
    }
  }

  /**
   * Helper function to calculate the keys min and max values
   */
  function keyScaleRange(type, position) {
    let domainMin, domainMax, domainSize, rangeLength;
    switch (type) {
      case "size":
        domainMin = Math.min.apply(Math, sizeScale.domain());
        domainMax = Math.max.apply(Math, sizeScale.domain());
        domainSize = domainMax - domainMin;
        rangeLength = sizeScale.range().length;
        break;
      case "color":
        domainMin = Math.min.apply(Math, colorScale.domain());
        domainMax = Math.max.apply(Math, colorScale.domain());
        domainSize = domainMax - domainMin;
        rangeLength = colorScale.range().length;
        break;
      case "threshold":
        let min = colorScale.domain()[position];
        let max = colorScale.domain()[position + 1];
        rangeStr = (isNaN(max) ? "> " + min : min + " - " + max);
        return rangeStr;
        break;
    }
    let rangeIncrement = domainSize / rangeLength;
    let ranges = [];
    let range = [];
    let rangeStart = domainMin;
    let rangeEnd = domainMin + rangeIncrement;

    for (let i = 0; i < rangeLength; i++) {
      range = [rangeStart, rangeEnd];
      ranges.push(range);
      rangeStart = rangeEnd;
      rangeEnd = rangeStart + rangeIncrement;
    }

    let rangeStr = ranges[position][0].toFixed(0) + " - " + ranges[position][1].toFixed(0);
    return rangeStr;
  }

  /**
   * Configuration Getters & Setters
   */
  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return my;
  };

  my.sizeLabel = function(_) {
    if (!arguments.length) return sizeLabel;
    sizeLabel = _;
    return my;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.colorLabel = function(_) {
    if (!arguments.length) return colorLabel;
    colorLabel = _;
    return my;
  };

  my.title = function(_) {
    if (!arguments.length) return title;
    title = _;
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

  return my;
};
