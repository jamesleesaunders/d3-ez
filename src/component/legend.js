/**
 * Reusable Legend Component
 *
 * @example
 * var myLegend = d3.ez.component.legend()
 *     .sizeScale(**D3 Scale Object**)
 *     .sizeLabel('Label for Size')
 *     .colorScale(**D3 Scale Object**)
 *     .colorLabel('Label for Colours')
 *     .position('top-right');
 * d3.select("svg").call(myLegend);
 */
d3.ez.component.legend = function module() {
  // Default Options (Configurable via setters)
  var sizeScale = undefined;
  var sizeLabel = null;
  var colorScale = undefined;
  var colorLabel = null;
  var title = null;
  var width = 100;
  var height = 150;
  var opacity = 0.7;
  var fill = "#ffffff";
  var stroke = "#000000";
  var strokewidth = "1px";
  var spacing = 5;

  function my(selection) {
    height = (height ? height : this.attr("height"));
    width = (width ? width : this.attr("width"));

    // Legend Box
    var legendBox = selection.selectAll("#legendBox")
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

    legendTitle = legendBox.append('g')
      .attr("transform", "translate(5, 15)");
    legendTitle.append('text')
      .style("font-weight", "bold")
      .text(title);

    var y = 10;
    // Size Key
    if (typeof sizeScale !== "undefined") {
      // Calcualate a range of 5 numbers between min and max of range
      min = d3.min(sizeScale.range());
      max = d3.max(sizeScale.range());
      diff = max - min;
      step = diff / 4;
      var range = [];
      range[0] = min;
      for (var s = 1; s < 5; s++) {
        range[s] = range[s - 1] + step;
      }
      sizeScale.range(range);

      numElements = sizeScale.range().length;
      elementHeight = ((height - 45) / numElements);

      sizeKey = legendBox.append('g')
        .attr("transform", "translate(5, 20)");

      for (var index = 0; index < numElements; index++) {
        sizeKey.append('circle')
          .attr("cx", 17)
          .attr("cy", y)
          .attr("fill", "lightgrey")
          .attr("stroke-width", "1px")
          .attr("stroke", "grey")
          .attr("fill-opacity", 0.8)
          .attr("r", sizeScale.range()[index]);

        text = keyScaleRange('size', index);

        sizeKey.append('text')
          .attr("x", 40)
          .attr("y", y + 5)
          .text(text);

        y = y + (elementHeight + spacing);
      }
    }

    // Colour Key
    if (typeof colorScale !== 'undefined') {
      numElements = colorScale.domain().length;
      elementHeight = ((height - 45) / numElements) - 5;

      colorKey = legendBox.append('g')
        .attr("transform", "translate(5, 20)");

      for (var index = 0; index < numElements; index++) {
        colorKey.append('rect')
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
          text = keyScaleRange('threshold', index);
        } else {
          text = colorScale.domain()[index];
        }

        colorKey.append('text')
          .attr("x", 40)
          .attr("y", y + 10)
          .text(text);
        y = y + (elementHeight + spacing);
      }
    }
  }

  // Helper function to calculate the keys min and max values
  function keyScaleRange(type, position) {
    switch (type) {
      case 'size':
        var domainMin = Math.min.apply(Math, sizeScale.domain());
        var domainMax = Math.max.apply(Math, sizeScale.domain());
        var domainSize = domainMax - domainMin;
        var rangeLength = sizeScale.range().length;
        break;
      case 'color':
        var domainMin = Math.min.apply(Math, colorScale.domain());
        var domainMax = Math.max.apply(Math, colorScale.domain());
        var domainSize = domainMax - domainMin;
        var rangeLength = colorScale.range().length;
        break;
      case 'threshold':
        min = colorScale.domain()[position];
        max = colorScale.domain()[position + 1];
        rangeStr = (isNaN(max) ? "> " + min : min + ' - ' + max);
        return rangeStr;
        break;
    }
    var rangeIncrement = domainSize / rangeLength;
    var ranges = [];
    var range = [];
    var rangeStart = domainMin;
    var rangeEnd = domainMin + rangeIncrement;

    for (i = 0; i < rangeLength; i++) {
      range = [rangeStart, rangeEnd];
      ranges.push(range);
      rangeStart = rangeEnd;
      rangeEnd = rangeStart + rangeIncrement;
    }

    var rangeStr = ranges[position][0].toFixed(0) + ' - ' + ranges[position][1].toFixed(0);
    return rangeStr;
  }

  // Configuration Getters & Setters
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
