/**
 * Title
 *
 * @example
 * var myTitle = d3.ez.title()
 *     .enabled(true)
 *     .mainText("Hello World")
 *     .subText("This is a test");
 * d3.select("svg").call(myTitle);
 */
d3.ez.title = function module() {
  // Default Options (Configurable via setters)
  var mainText = "Title";
  var subText = "Sub Title";
  var height = 40;
  var width = 200;

  function my() {
    var titleGroup = this.selectAll("#titleGroup")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "titleGroup");

    var title = titleGroup.append("text")
      .text(mainText)
      .classed("title", true);

    var subTitle = titleGroup.append("text")
      .text(subText)
      .classed("subTitle", true);

    // Centre Text
    var titleOffset = 1 - (d3.select("#titleGroup").selectAll(".title").node().getBBox().width / 2);
    var subTitleOffset = 1 - (d3.select("#titleGroup").selectAll(".subTitle").node().getComputedTextLength() / 2);
    title.attr({
      transform: "translate(" + titleOffset + ", " + 15 + ")"
    });
    subTitle.attr({
      transform: "translate(" + subTitleOffset + ", " + 30 + ")"
    });
  }

  // Configuration Getters & Setters
  my.mainText = function(_) {
    if (!arguments.length) return mainText;
    mainText = _;
    return this;
  };

  my.subText = function(_) {
    if (!arguments.length) return subText;
    subText = _;
    return this;
  };

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

  return my;
};

/**
 * Credit Tag
 *
 * @example
 * var myCredit = d3.ez.creditTag()
 *     .enabled(true)
 *     .text("Hello World")
 *     .href("http://d3ez.org");
 * d3.select("svg").call(myCredit);
 */
d3.ez.creditTag = function module() {
  // Default Options (Configurable via setters)
  var text = "d3ez.org";
  var href = "http://d3ez.org";

  function my() {
    var creditTag = this.selectAll("#creditTag")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "creditTag");

    var creditText = creditTag.append("text")
      .text(text)
      .attr({
        "xlink:href": href
      })
      .on("click", function() {
        window.open(href);
      });

    // Right Justify Text
    var xPos = 0 - (d3.select("#creditTag").selectAll("text").node().getBBox().width);
    creditText.attr({
      transform: "translate(" + xPos + ", 0)"
    });
  }

  // Configuration Getters & Setters
  my.text = function(_) {
    if (!arguments.length) return text;
    text = _;
    return this;
  };

  my.href = function(_) {
    if (!arguments.length) return href;
    href = _;
    return this;
  };

  return my;
};

/**
 * Labeled Node
 *
 * @example
 * var myNode = d3.ez.labeledNode()
 *     .color("#FF0000")
 *     .opacity(0.5)
 *     .stroke(1)
 *     .label("Node Label")
 *     .radius(5);
 * d3.selectAll("g").call(myNode);
 */
d3.ez.labeledNode = function module() {
  // Default Options (Configurable via setters)
  var color = "steelblue";
  var opacity = 1;
  var strokeColor = "#000000";
  var strokeWidth = 0;
  var radius = 8;
  var label = null;
  var fontSize = 10;

  function my(d, i) {
    var r = sizeAccessor(d);

    var node = d3.select(this)
      .attr("class", "node");

    node.append("circle")
      .attr("fill-opacity", opacity)
      .attr("r", r)
      .style("stroke", strokeColor)
      .style("stroke-width", strokeWidth)
      .style("fill", color);

    node.append("text")
      .text(label)
      .attr("dx", r + 2)
      .attr("dy", r + 6)
      .style("text-anchor", "start")
      .style("font-size", fontSize + "px")
      .attr("class", "nodetext");
  }

  // Configuration Getters & Setters
  my.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return this;
  };

  my.opacity = function(_) {
    if (!arguments.length) return opacity;
    opacity = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.label = function(_) {
    if (!arguments.length) return label;
    label = _;
    return this;
  };

  my.fontSize = function(_) {
    if (!arguments.length) return fontSize;
    fontSize = _;
    return this;
  };

  my.stroke = function(_width, _color) {
    if (!arguments.length) return strokeWidth + ", " + strokeColor;
    strokeWidth = _width;
    strokeColor = _color;
    return this;
  };

  function sizeAccessor(_) {
    return (typeof radius === "function" ? radius(_) : radius);
  };

  return my;
};

/**
 * Colour Palettes
 *
 * @example
 * d3.ez.colors.categorical(1);
 * d3.ez.colors.diverging(1);
 * d3.ez.colors.sequential("#ff0000", 9);
 * d3.ez.colors.lumShift(d3.ez.colors.categorical(1), 0.2);
 *
 */
d3.ez.colors = {
  categorical: function(scheme) {
    // Categorical colour schemes are the ones that are used to separate items into
    // distinct groups or categories.
    switch (scheme) {
      case 1:
        // Stephen Few - Show Me the Numbers Book
        //      Blue       Orange     Green      Pink       L Brown    Purple     D.Yellow   Red        Black
        return ["#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d"];
      case 2:
        // Color Brewer - http://colorbrewer2.com/
        //      Red        L.Blue     Green      Purple     Orange     Yellow     Brown      Pink       Grey
        return ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"];
      case 3:
        // Google Design - http://www.google.com/design/spec/style/color.html
        //      D. Blue    Orange     L.Green    Purple     Yellow     L.Blue     Red        D.Green    Brown
        return ["#3f51b5", "#ff9800", "#8bc34a", "#9c27b0", "#ffeb3b", "#03a9f4", "#f44336", "#009688", "#795548"];
      case 4:
        return (d3.ez.colors.lumShift(d3.ez.colors.lumShift(d3.ez.colors.categorical(3), -0.8), 5.5));
    }
  },

  diverging: function(scheme) {
    // Diverging colour schemes are used for quantitative data. Usually two different hues
    // that diverge from a light colour, for the critical midpoint, toward dark colours.
    switch (scheme) {
      case 1:
        // Color Brewer - Colourblind Safe
        return ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e'];
      case 2:
        // Color Brewer - RAG
        return ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];
      case 3:
        // Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
        return ['#0000ff', '#8052fe', '#b58bfb', '#ddc5f7', '#fffff0', '#ffcfb4', '#ff9e7a', '#ff6842', '#ff0000'];
    }
  },

  sequential: function(origHex, count) {
    // Sequential colour schemes are primarily used to encode quantitative differences.
    // Quantitative values are arranged sequentially, from low to high.
    var lumStep = 0.1;
    var lumMax = (lumStep * count) / 2;
    var lumMin = 0 - lumMax;

    var lumScale = d3.scale.linear()
      .domain([1, count])
      .range([lumMin, lumMax]);

    var result = [];
    for (var i = 1; i <= count; i++) {
      lum = lumScale(i);

      // Validate and normalise Hex value.
      origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
      if (origHex.length < 6) {
        origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
      }

      // Convert to decimal and change luminosity
      var newHex = "#";
      var c;
      for (var j = 0; j < 3; j++) {
        c = parseInt(origHex.substr(j * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        newHex += ("00" + c).substr(c.length);
      }
      result.push(newHex);
    }
    return result;
  },

  lumShift: function(colors, lum) {
    var result = [];
    colors.forEach(function addNumber(origHex, index) {
      origHex = String(origHex).replace(/[^0-9a-f]/gi, "");
      if (origHex.length < 6) {
        origHex = origHex[0] + origHex[0] + origHex[1] + origHex[1] + origHex[2] + origHex[2];
      }
      lum = lum || 0;

      // Convert to decimal and change luminosity
      var newHex = "#",
        c, i;
      for (i = 0; i < 3; i++) {
        c = parseInt(origHex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        newHex += ("00" + c).substr(c.length);
      }
      result[index] = newHex;
    });
    return result;
  }
};

/**
 * Legend
 *
 * @example
 * var myLegend = d3.ez.legend()
 *     .sizeScale(**D3 Scale Object**)
 *     .sizeLabel('Label for Size')
 *     .colorScale(**D3 Scale Object**)
 *     .colorLabel('Label for Colours')
 *     .position('top-right');
 */
d3.ez.legend = function module() {
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

  function my() {
    height = (height ? height : this.attr("height"));
    width = (width ? width : this.attr("width"));

    // Legend Box
    var legendBox = this.selectAll("#legendBox")
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
      .attr('transform', 'translate(5, 15)');
    legendTitle.append('text')
      .style('font-weight', 'bold')
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
        .attr('transform', 'translate(5, 20)');

      for (var index = 0; index < numElements; index++) {
        sizeKey.append('circle')
          .attr('cx', 17)
          .attr('cy', y)
          .attr('fill', 'lightgrey')
          .attr('stroke-width', '1px')
          .attr('stroke', 'grey')
          .attr('fill-opacity', 0.8)
          .attr('r', sizeScale.range()[index]);

        text = keyScaleRange('size', index);

        sizeKey.append('text')
          .attr('x', 40)
          .attr('y', y + 5)
          .text(text);

        y = y + (elementHeight + spacing);
      }
    }

    // Colour Key
    if (typeof colorScale !== 'undefined') {
      numElements = colorScale.domain().length;
      elementHeight = ((height - 45) / numElements) - 5;

      colorKey = legendBox.append('g')
        .attr('transform', 'translate(5, 20)');

      for (var index = 0; index < numElements; index++) {
        colorKey.append('rect')
          .attr('x', 10)
          .attr('y', y)
          .attr('fill', colorScale.range()[index])
          .attr('stroke-width', '1px')
          .attr('stroke', 'grey')
          .attr('fill-opacity', 0.8)
          .attr('width', 20)
          .attr('height', elementHeight);

        if ( !isNaN(colorScale.domain()[index]) ) {
          // If the scale is a threshold scale.
          text = keyScaleRange('threshold', index);
        } else {
          text = colorScale.domain()[index];
        }

        colorKey.append('text')
          .attr('x', 40)
          .attr('y', y + 10)
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
        max = colorScale.domain()[position+1]-1;
        rangeStr = (isNaN(max) ? "> " + min : min + ' - ' + max );
        return  rangeStr;
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
