/** 
 * d3-ez 
 * 
 * @author James Saunders [james@saunders-family.net] 
 * @copyright Copyright (C) 2018 James Saunders 
 * @license GPLv3 
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

/**
 * Base Functions - Data Parse
 *
 */
function dataParse(data) {

  var levels = (function() {
    if (data['key'] !== undefined) {
      return 1;
    } else {
      return 2;
    }
  })();

  var groupName = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.values(data)[0];
    }

    return ret;
  })();

  var groupNames = (function() {
    var ret;
    if (levels > 1) {
      ret = data.map(function(d) {
        return d.key;
      });
    }

    return ret;
  })();

  var groupTotals = (function() {
    var ret;
    if (levels > 1) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        var groupName = d.key;
        d.values.forEach(function(d) {
          var categoryValue = +d.value;

          ret[groupName] = (typeof(ret[groupName]) === "undefined" ? 0 : ret[groupName]);
          ret[groupName] += categoryValue;
        });
      });
    }

    return ret;
  })();

  var groupTotalsMax = (function() {
    var ret;
    if (levels > 1) {
      ret = d3.max(d3.values(groupTotals));
    }

    return ret;
  })();

  var union = function(array1, array2) {
    var ret = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while (len--) {
      var item = arr[len];

      if (!assoc[item]) {
        ret.unshift(item);
        assoc[item] = true;
      }
    }

    return ret;
  };

  var categoryNames = (function() {
    var ret = [];
    if (1 === levels) {
      ret = d3.values(data)[1].map(function(d) {
        return d.key;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        var tmp = [];
        d.values.forEach(function(d, i) {
          var categoryName = d.key;
          tmp[i] = categoryName;
        });

        ret = union(tmp, ret);
      });
    }

    return ret;
  })();

  var categoryTotal = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.sum(data.values, function(d) {
        return d.value;
      });
    }

    return ret;
  })();

  var categoryTotals = (function() {
    var ret;
    if (levels > 1) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          var categoryName = d.key;
          var categoryValue = +d.value;

          ret[categoryName] = (typeof(ret[categoryName]) === "undefined" ? 0 : ret[categoryName]);
          ret[categoryName] += categoryValue;
        });
      });
    }

    return ret;
  })();

  var categoryTotalsMax = (function() {
    var ret;
    if (levels > 1) {
      ret = d3.max(d3.values(categoryTotals));
    }

    return ret;
  })();

  var minValue = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.min(data.values, function(d) {
        return d.value;
      });
    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, d.value]));
        });
      });
    }

    return +ret;
  })();

  var maxValue = (function() {
    var ret;
    if (1 === levels) {
      ret = d3.max(data.values, function(d) {
        return d.value;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, d.value]));
        });
      });
    }

    return +ret;
  })();

  var decimalPlaces = function(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    var ret = Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      -
      (match[2] ? +match[2] : 0));

    return ret;
  };

  var maxDecimalPlace = (function() {
    var ret = 0;
    if (levels > 1) {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = d3.max([ret, decimalPlaces(d.value)]);
        });
      });
    }

    return ret;
  })();

  // If thresholds values are not already set attempt to auto-calculate some thresholds
  var thresholds = (function() {
    var distance = maxValue - minValue;
    var ret = [
      (minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
      (minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
		];

    return ret;
  })();

  var my = {
    'levels': levels,
    'groupName': groupName,
    'groupNames': groupNames,
    'groupTotals': groupTotals,
    'groupTotalsMax': groupTotalsMax,
    'categoryNames': categoryNames,
    'categoryTotal': categoryTotal,
    'categoryTotals': categoryTotals,
    'categoryTotalsMax': categoryTotalsMax,
    'minValue': minValue,
    'maxValue': maxValue,
    'maxDecimalPlace': maxDecimalPlace,
    'thresholds': thresholds
  };

  return my;
}

/**
 * Colour Palettes
 *
 * @example
 * d3.ez.colors.categorical(1);
 * d3.ez.colors.diverging(1);
 * d3.ez.colors.sequential("#ff0000", 9);
 * d3.ez.colors.lumShift(d3.ez.colors.categorical(1), 0.2);
 */
function colors() {
  var my = {
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
          return ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"];
        case 2:
          // Color Brewer - RAG
          return ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"];
        case 3:
          // Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
          return ["#0000ff", "#8052fe", "#b58bfb", "#ddc5f7", "#fffff0", "#ffcfb4", "#ff9e7a", "#ff6842", "#ff0000"];
      }
    },

    sequential: function(origHex, count) {
      // Sequential colour schemes are primarily used to encode quantitative differences.
      // Quantitative values are arranged sequentially, from low to high.
      var lumStep = 0.1;
      var lumMax = (lumStep * count) / 2;
      var lumMin = 0 - lumMax;

      var lumScale = d3.scaleLinear()
        .domain([1, count])
        .range([lumMin, lumMax]);

      var result = [];
      for (var i = 1; i <= count; i++) {
        var lum = lumScale(i);

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
        var newHex = "#";
        for (var i = 0; i < 3; i++) {
          var c = parseInt(origHex.substr(i * 2, 2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          newHex += ("00" + c).substr(c.length);
        }
        result[index] = newHex;
      });
      return result;
    }
  };

  return my;
}

/**
 * Chart Base
 *
 * @example
 * @todo
 */
function base() {
  // SVG and Canvas containers (Populated by 'my' function)
  var svg;
  var canvas;

  // Default Options (Configurable via setters)
  var width = 600;
  var height = 400;
  var margin = { top: 15, right: 15, bottom: 15, left: 15 };
  var canvasW = 580;
  var canvasH = 380;
  var chartTop = 0;
  var classed = "d3ez";

  var chart = undefined;
  var legend = undefined;
  var title = undefined;
  var creditTag = d3.ez.component.creditTag();
  var yAxisLabel = "";

  // Dispatch (custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    canvasW = width - (margin.left + margin.right);
    canvasH = height - (margin.top + margin.bottom);

    // Init Chart
    chart.dispatch(dispatch)
      .width(canvasW)
      .height(canvasH);

    // Init Legend
    if (legend) {
      legend.width(150).height(200);
      chart.width(chart.width() - legend.width());
    }

    // Init Title
    if (title) {
      chartTop = title.height();
      chart.height(chart.height() - title.height());
    }

    // Init Credit Tag
    creditTag.text("d3-ez.net").href("http://d3-ez.net");
  }

  function my(selection) {
    selection.each(function(data) {
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = d3.select(this)
          .append("svg")
          .classed(classed, true)
          .attr("width", width)
          .attr("height", height);

        canvas = svg.append("g").classed("canvas", true);
        canvas.append("g").classed("chartbox", true);
        canvas.append("g").classed("legendbox", true);
        canvas.append("g").classed("titlebox", true);
        canvas.append("g").classed("creditbox", true);
      } else {
        canvas = svg.select(".canvas");
      }

      // Update the canvas dimensions
      canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", canvasW)
        .attr("height", canvasH);

      // Add Chart
      canvas.select(".chartbox")
        .datum(data)
        .attr("transform", "translate(" + 0 + "," + chartTop + ")")
        .call(chart);

      // Add Legend
      if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
        if (typeof chart.colorScale === "function") {
          legend.colorScale(chart.colorScale());
        }
        if (typeof chart.sizeScale === "function") {
          legend.sizeScale(chart.sizeScale());
        }
        canvas.select(".legendbox")
          .attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")")
          .call(legend);
      }

      // Add Title
      if (title) {
        canvas.select(".titlebox")
          .attr("transform", "translate(" + width / 2 + "," + 0 + ")")
          .call(title);
      }

      // Add Credit Tag
      canvas.select(".creditbox")
        .attr("transform", "translate(" + (width - 20) + "," + (height - 20) + ")")
        .call(creditTag);
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.chart = function(_) {
    if (!arguments.length) return chart;
    chart = _;
    return this;
  };

  my.legend = function(_) {
    if (!arguments.length) return legend;
    legend = _;
    return this;
  };

  my.title = function(_) {
    if (!arguments.length) return title;
    if (typeof _ === "string") {
      // If the caller has passed a plain string convert it to a title object.
      title = d3.ez.title().mainText(_).subText('');
    } else {
      title = _;
    }
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Circular Bar Chart Component
 *
 */
function componentBarsCircular() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var radius = 150;
  var innerRadius = 20;
  var startAngle = 0;
  var endAngle = 360;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;
    startAngle = d3.min(yScale.range());
    endAngle = d3.max(yScale.range());

    // Arc Generator
    var arc = d3.arc()
      .startAngle(0)
      .endAngle(function(d) {
        return (yScale(d.value) * Math.PI) / 180;
      })
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(2);

    var arcTween = function(d) {
      var i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      var bars = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      bars.enter()
        .append("path")
        .attr("d", arc)
        .classed("bar", true)
        .style("fill", function(d) { return colorScale(d.key); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attrTween("d", arcTween);

      bars.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Stacked Bar Chart Component
 *
 */
function componentBarsStacked() {
  // Default Options (Configurable via setters)
  var width = 100;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    // Stack Generator
    var stacker = function(data) {
      var series = [];
      var y0 = 0;
      data.forEach(function(d, i) {
        series[i] = {
          name: d.key,
          value: d.value,
          y0: y0,
          y1: y0 + d.value
        };
        y0 += d.value;
      });

      return series;
    };

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      var bars = series.selectAll(".bar")
        .data(function(d) { return stacker(d.values); });

      bars.enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", height)
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("height", 0)
        .attr("fill", function(d) { return colorScale(d.name); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("width", width)
        .attr("x", 0)
        .attr("y", function(d) { return yScale(d.y1); })
        .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); });

      bars.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Vertical Bar Chart Component
 *
 */
function componentBarsVertical() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      var bars = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      bars.enter()
        .append("rect")
        .classed("bar", true)
        .attr("fill", function(d) { return colorScale(d.key); })
        .attr("width", xScale.bandwidth())
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", height)
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("height", 0)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(bars)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("height", function(d) { return height - yScale(d.value); });

      bars.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Scatter Plot Component
 *
 */
function componentBubbles() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var sizeScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      var bubble = d3.ez.component.labeledNode()
        .radius(function(d) { return sizeScale(d.value); })
        .color(function(d) { return colorScale(d.series); })
        .label(function(d) { return d.text; })
        .stroke(1, "white")
        .display("none")
        .classed("bubble")
        .dispatch(dispatch);

      // Add bubbles to series
      var bubbles = series.selectAll(".bubble")
        .data(function(d) { return d.values; });

      bubbles.enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
        })
        .on("mouseover", function(d) {
          d3.select(this).select("text").style("display", "block");
          dispatch.call("customValueMouseOver", this, d.value);
        })
        .on("mouseout", function(d) {
          d3.select(this).select("text").style("display", "none");
        })
        .on("click", function(d) {
          dispatch.call("customValueClick", this, d.value);
        })
        .datum(function(d) { return d; })
        .call(bubble)
        .merge(bubbles);

      /*
      bubbles.enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", function(d) { return xScale(d.x); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", function(d) { return sizeScale(d.value); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.value); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d.value); })
        .merge(bubbles)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("r", function(d) { return sizeScale(d.value); });
      */

      bubbles.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Candle Stick Component
 *
 */
function componentCandleSticks() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale = d3.scaleOrdinal().range(["green", "red"]).domain([true, false]);
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var candleWidth = 3;

  // Functions
  var isUpDay = function(d) {
    return d.close > d.open;
  };

  var line = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  var highLowLines = function(bars) {
    var paths = bars.selectAll('.high-low-line')
      .data(function(d) { return [d]; });

    paths.enter()
      .append('path')
      .classed('high-low-line', true)
      .attr('d', function(d) {
        return line([
          { x: xScale(d.date), y: yScale(d.high) },
          { x: xScale(d.date), y: yScale(d.low) }
        ]);
      });
  };

  var openCloseBars = function(bars) {
    var rect = bars.selectAll('.open-close-bar')
      .data(function(d) { return [d]; });

    rect.enter()
      .append('rect')
      .classed('open-close-bar', true)
      .attr('x', function(d) {
        return xScale(d.date) - candleWidth;
      })
      .attr('y', function(d) {
        return isUpDay(d) ? yScale(d.close) : yScale(d.open);
      })
      .attr('width', candleWidth * 2)
      .attr('height', function(d) {
        return isUpDay(d) ?
          yScale(d.open) - yScale(d.close) :
          yScale(d.close) - yScale(d.open);
      });
  };

  var my = function(selection) {
    selection.each(function() {
      // Create series group
      var seriesSelect = d3.select(this).selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add bars to series
      var barsSelect = series.selectAll(".bar")
        .data(function(d) { return d.values; });

      var bars = barsSelect.enter()
        .append("g")
        .classed("bar", true)
        .attr("fill", function(d) { return colorScale(isUpDay(d)); })
        .attr("stroke", function(d) { return colorScale(isUpDay(d)); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(barsSelect);

      highLowLines(bars);
      openCloseBars(bars);
      /// openCloseTicks(bars);

      bars.exit().remove();
    });
  };

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.candleWidth = function(_) {
    if (!arguments.length) return candleWidth;
    candleWidth = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Circular Axis Component
 *
 */
function componentCircularAxis() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var radialScale;
  var ringScale;
  var transition = { ease: d3.easeBounce, duration: 500 };

  function my(selection) {
    selection.each(function() {
      var defaultRadius = Math.min(width, height) / 2;
      radius = (typeof radius === 'undefined') ? defaultRadius : radius;

      // Create axis group
      var axisSelect = selection.selectAll('.axis')
        .data([0]);

      var axis = axisSelect.enter()
        .append("g")
        .classed("axis", true)
        .on("click", function(d) { dispatch.call("customClick", this, d); })
        .merge(axisSelect);

      // Outer circle
      var outerCircle = axis.selectAll(".outerCircle")
        .data([radius])
        .enter()
        .append("circle")
        .classed("outerCircle", true)
        .attr("r", function(d) { return d; })
        .style("fill", "none")
        .attr('stroke-width', 2)
        .attr('stroke', '#ddd');

      // Tick circles
      if (typeof ringScale.ticks === "function") {
        // scaleLinear
        var tickData = ringScale.ticks();

        var tickPadding = 0;
      } else {
        // scaleBand
        var tickData = ringScale.domain();
        var tickPadding = ringScale.bandwidth() / 2;
      }
      var tickCirclesGroupSelect = axis.selectAll(".tickCircles")
        .data([tickData]);

      var tickCirclesGroup = tickCirclesGroupSelect.enter()
        .append("g")
        .classed("tickCircles", true)
        .merge(tickCirclesGroupSelect);

      var tickCircles = tickCirclesGroup.selectAll("circle")
        .data(function(d) { return d; });

      tickCircles.enter()
        .append("circle")
        .style("fill", "none")
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd')
        .merge(tickCircles)
        .transition()
        .attr("r", function(d) { return (ringScale(d) + tickPadding); });

      tickCircles.exit()
        .remove();

      // Spokes
      var spokeCount;
      var spokeData = [];
      //if (typeof radialScale.ticks === "function") {
      if (typeof radialScale.ticks === "function") {
        // scaleLinear
        var min = d3.min(radialScale.domain());
        var max = d3.max(radialScale.domain());
        spokeCount = radialScale.ticks().length;
        var spokeIncrement = (max - min) / spokeCount;
        for (var i = 0; i <= spokeCount; i++) {
          spokeData[i] = (spokeIncrement * i).toFixed(0);
        }
      } else {
        // scaleBand
        spokeData = radialScale.domain();
        spokeCount = spokeData.length;
        spokeData.push("");
      }

      var spokesGroupSelect = axis.selectAll(".spokes")
        .data([spokeData]);

      var spokesGroup = spokesGroupSelect.enter()
        .append("g")
        .classed("spokes", true)
        .merge(spokesGroupSelect);

      var spokes = spokesGroup.selectAll("line")
        .data(function(d) {
          var spokeScale = d3.scaleLinear()
            .domain([0, spokeCount])
            .range(radialScale.range());

          return spokeData.map(function(d, i) {
            return {
              value: d,
              rotate: spokeScale(i)
            }
          });
        });

      spokes.enter()
        .append("line")
        .attr("id", function(d) { return d.value; })
        .attr("y2", -radius)
        .merge(spokes)
        .attr("transform", function(d) {
          return "rotate(" + d.rotate + ")";
        });

      spokes.exit()
        .remove();

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

  my.ringScale = function(_) {
    if (!arguments.length) return ringScale;
    ringScale = _;
    return my;
  };

  return my;
}

/**
 * Reusable Radial Labels Component
 *
 */
function componentCircularRingLabels() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 300;
  var radialScale;
  var radius;
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
}

/**
 * Reusable Circular Labels Component
 *
 */
function componentCircularSectorLabels() {
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
}

/**
 * Reusable Donut Chart Component
 *
 */
function componentDonut() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var innerRadius;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 2 : innerRadius;

    // Pie Generator
    var pie = d3.pie()
      .value(function(d) { return d.value; })
      .sort(null)
      .padAngle(0.015);

    // Arc Generators
    var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(2);

    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    var arcTween = function(d) {
      var i = d3.interpolate(this._current, d);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };

    var midAngle = function(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    };

    selection.each(function() {
      // Create chart group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      series.append("g").attr("class", "slices");
      series.append("g").attr("class", "labels");
      series.append("g").attr("class", "lines");

      // Slices
      var slices = series.select(".slices")
        .selectAll("path.slice")
        .data(function(d) {
          return pie(d.values);
        });

      slices.enter()
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d) { return colorScale(d.data.key); })
        .attr("d", arc)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(slices)
        .transition()
        .duration(transition.duration)
        .ease(transition.ease)
        .attrTween("d", arcTween);

      slices.exit()
        .remove();

      // Labels
      var labels = series.select(".labels")
        .selectAll("text.label")
        .data(function(d) {
          return pie(d.values);
        });

      labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .merge(labels)
        .transition()
        .duration(transition.duration)
        .text(function(d) {
          return d.data.key;
        })
        .attrTween("transform", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return "translate(" + pos + ")";
          };
        })
        .styleTween("text-anchor", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      labels.exit()
        .remove();

      // Slice to Label Lines
      var lines = series.select(".lines")
        .selectAll("polyline.line")
        .data(function(d) {
          return pie(d.values);
        });

      lines.enter()
        .append("polyline")
        .attr("class", "line")
        .merge(lines)
        .transition()
        .duration(transition.duration)
        .attrTween("points", function(d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      lines.exit()
        .remove();
    });

  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Heat Map Ring Component
 *
 */
function componentHeatMapRing() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var innerRadius = 20;
  var startAngle = 0;
  var endAngle = 360;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;
    startAngle = d3.min(xScale.range());
    endAngle = d3.max(xScale.range());

    // Pie Generator
    var pie = d3.pie()
      .value(1)
      .sort(null)
      .startAngle(startAngle * (Math.PI / 180))
      .endAngle(endAngle * (Math.PI / 180))
      .padAngle(0.015);

    // Arc Generator
    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(innerRadius)
      .cornerRadius(2);

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      var segments = series.selectAll(".segment")
        .data(function(d) {
          var key = d.key;
          var data = pie(d.values);
          data.forEach(function(d, i) {
            data[i].key = key;
          });

          return data;
        });

      // Ring Segments
      segments.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", 'black')
        .classed("segment", true)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(segments)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.data.value); });

      segments.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });

  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Heat Map Table Row Component
 *
 */
function componentHeatMapRow() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 100;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var cellHeight = yScale.bandwidth();
    var cellWidth = xScale.bandwidth();

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add cells to series
      var cells = series.selectAll(".cell")
        .data(function(d) {
          var seriesName = d.key;
          var seriesValues = d.values;

          return seriesValues.map(function(el) {
            var o = Object.assign({}, el);
            o.series = seriesName;
            return o;
          });
        });

      cells.enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", 0)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "black")
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(cells)
        //.transition()
        //.duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); });

      cells.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Simple HTML List
 *
 * @example
 * var myList = d3.ez.component.htmlList()
 *      .classed("myClass");
 * d3.select("#listholder")
 *     .datum(data)
 *     .call(myList);
 */
function componentHtmlList() {
  // HTML List Element (Populated by 'my' function)
  var listEl;

  // Default Options (Configurable via setters)
  var classed = "htmlList";

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    selection.each(function(data) {
      // Create HTML List 'ul' element (if it does not exist already)
      if (!listEl) {
        listEl = d3.select(this)
          .append("ul")
          .classed("d3ez", true)
          .classed(classed, true);
      } else {
        listEl.selectAll("*")
          .remove();
      }

      listEl.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .text(function(d) {
          return d.key;
        })
        .on("click", expand);

      function expand(d) {
        d3.event.stopPropagation();
        dispatch.call("customValueMouseOver", this, d);

        if (typeof d.values === "undefined") {
          return 0;
        }

        var ul = d3.select(this)
          .on("click", collapse)
          .append("ul");

        var li = ul.selectAll("li")
          .data(d.values)
          .enter()
          .append("li")
          .text(function(d) {
            if (typeof d.value !== "undefined") {
              return d.key + " : " + d.value;
            } else {
              return d.key;
            }
          })
          .on("click", expand);
      }

      function collapse() {
        d3.event.stopPropagation();
        d3.select(this)
          .on("click", expand)
          .selectAll("*")
          .remove();
      }

    });
  }

  // Configuration Getters & Setters
  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Simple HTML Table
 *
 * @example
 * var myTable = d3.ez.component.htmlTable()
 *     .classed("myClass")
 *     .width("600");
 * d3.select("#tableholder")
 *     .datum(data)
 *     .call(myTable);
 */
function componentHtmlTable() {
  // HTML Table Element (Populated by 'my' function)
  var tableEl;

  // Default Options (Configurable via setters)
  var classed = "htmlTable";
  var width = 800;

  // Data Options (Populated by 'init' function)
  var rowNames = [];
  var columnNames = [];

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    // Cut the data in different ways....
    rowNames = data.map(function(d) {
      return d.key;
    });

    columnNames = [];
    data.map(function(d) {
      return d.values;
    })[0].forEach(function(d, i) {
      columnNames[i] = d.key;
    });
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create HTML Table 'table' element (if it does not exist already)
      if (!tableEl) {
        tableEl = d3.select(this)
          .append("table")
          .classed("d3ez", true)
          .classed(classed, true)
          .attr("width", width);
      } else {
        tableEl.selectAll("*")
          .remove();
      }
      var head = tableEl.append("thead");
      var foot = tableEl.append("tfoot");
      var body = tableEl.append("tbody");

      // Add table headings
      var hdr = head.append("tr");

      hdr.selectAll("th")
        .data(function() {
          // Tack on a blank cell at the beginning,
          // this is for the top of the first column.
          return [""].concat(columnNames);
        })
        .enter()
        .append("th")
        .html(function(d) {
          return d;
        });

      // Add table body
      var rowsSelect = body.selectAll("tr")
        .data(data);

      var rows = rowsSelect.enter()
        .append("tr")
        .attr("class", function(d) {
          return d.key;
        })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(rowsSelect);

      // Add the first column of headings (categories)
      rows.append("th")
        .html(function(d) {
          return d.key;
        });

      // Add the main data values
      rows.selectAll("td")
        .data(function(d) {
          return d.values;
        })
        .enter()
        .append("td")
        .attr("class", function(d) {
          return d.key;
        })
        .html(function(d) {
          return d.value;
        })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); });
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Line Chart Component
 *
 */
function componentLineChart() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 1500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    // Line generation function
    var line = d3.line()
      .curve(d3.curveCardinal)
      .x(function(d) { return xScale(d.key); })
      .y(function(d) { return yScale(d.value); });

    // Line animation tween
    var pathTween = function(data) {
      var interpolate = d3.scaleQuantile()
        .domain([0, 1])
        .range(d3.range(1, data.length + 1));
      return function(t) {
        return line(data.slice(0, interpolate(t)));
      };
    };

    selection.each(function() {
      // Create series group
      var series = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      series.enter()
        .append("path")
        .attr("class", "series")
        .attr("stroke-width", 1.5)
        .attr("stroke", function(d) { return colorScale(d.key); })
        .attr("fill", "none")
        .merge(series)
        .transition()
        .duration(transition.duration)
        .attrTween("d", function(d) { return pathTween(d.values); });

      series.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Number Row Component
 *
 */
function componentNumberCard() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 100;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    // var cellHeight = yScale.bandwidth();
    var cellWidth = xScale.bandwidth();

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add numbers to series
      var numbers = series.selectAll(".number")
        .data(function(d) { return d.values; });

      numbers.enter().append("text")
        .attr("class", "number")
        .attr("x", function(d) { return (xScale(d.key) + cellWidth / 2); })
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(function(d) {
          return d['value'];
        })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(numbers)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return colorScale(d.value); });

      numbers.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Polar Area Chart Component
 *
 */
function componentPolarArea() {
  // Default Options (Configurable via setters)
  var width = 300;
  var height = 300;
  var radius = 150;
  var startAngle = 0;
  var endAngle = 360;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var defaultRadius = Math.min(width, height) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    startAngle = d3.min(xScale.range());
    endAngle = d3.max(xScale.range());

    // Pie Generator
    var pie = d3.pie()
      .value(1)
      .sort(null)
      .startAngle(startAngle * (Math.PI / 180))
      .endAngle(endAngle * (Math.PI / 180))
      .padAngle(0);

    // Arc Generator
    var arc = d3.arc()
      .outerRadius(function(d) {
        return yScale(d.data.value);
      })
      .innerRadius(0)
      .cornerRadius(2);

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed("series", true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add segments to series
      var segments = series.selectAll(".segment")
        .data(function(d) { return pie(d.values); });

      segments.enter()
        .append("path")
        .classed("segment", true)
        .style("fill", function(d) { return colorScale(d.data.key); })
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d.data); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d.data); })
        .merge(segments)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("d", arc);

      segments.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Proportional Area Circles Component
 *
 */
function componentProportionalAreaCircles() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 100;
  var sizeScale;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    var cellHeight = yScale.bandwidth();
    var cellWidth = xScale.bandwidth();

    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll(".series")
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      series.attr("transform", function(d) {
        return "translate(" + (cellWidth / 2) + ", " + (cellHeight / 2) + ")";
      });

      var spot = d3.ez.component.labeledNode()
        .radius(function(d) { return sizeScale(d.value); })
        .color(function(d) { return colorScale(d.value); })
        .label(function(d) { return d.value; })
        .display("none")
        .classed("punchSpot")
        .dispatch(dispatch);

      // Add spots to series
      var spots = series.selectAll(".punchSpot")
        .data(function(d) { return d.values; });

      spots.enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + xScale(d.key) + ",0)";
        })
        .on("mouseover", function(d) {
          d3.select(this).select("text").style("display", "block");
          dispatch.call("customValueMouseOver", this, d.value);
        })
        .on("mouseout", function(d) {
          d3.select(this).select("text").style("display", "none");
        })
        .on("click", function(d) {
          dispatch.call("customValueClick", this, d.value);
        })
        .datum(function(d) { return d; })
        .call(spot)
        .merge(spots);

      /*
      spots.enter().append("circle")
        .attr("class", "punchSpot")
        .attr("cx", function(d) {
          return (cellWidth / 2 + xScale(d.key));
        })
        .attr("cy", 0)
        .attr("r", 0)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(spots)
        .transition()
        .duration(transition.duration)
        .attr("fill", function(d) { return colorScale(d.value); })
        .attr("r", function(d) {
          return sizeScale(d['value']);
        });
      */

      spots.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Scatter Plot Component
 *
 */
function componentScatterPlot() {
  // Default Options (Configurable via setters)
  var width = 400;
  var height = 400;
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colorScale;
  var xScale;
  var yScale;
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function my(selection) {
    selection.each(function() {
      // Create series group
      var seriesSelect = selection.selectAll('.series')
        .data(function(d) { return [d]; });

      var series = seriesSelect.enter()
        .append("g")
        .classed('series', true)
        .attr("fill", function(d) { return colorScale(d.key); })
        .on("mouseover", function(d) { dispatch.call("customSeriesMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customSeriesClick", this, d); })
        .merge(seriesSelect);

      // Add dots to series
      var dots = series.selectAll(".dot")
        .data(function(d) { return d.values; });

      dots.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function(d) { return xScale(d.key); })
        .attr("cy", height)
        .on("mouseover", function(d) { dispatch.call("customValueMouseOver", this, d); })
        .on("click", function(d) { dispatch.call("customValueClick", this, d); })
        .merge(dots)
        .transition()
        .ease(transition.ease)
        .duration(transition.duration)
        .attr("cx", function(d) { return xScale(d.key); })
        .attr("cy", function(d) { return yScale(d.value); });

      dots.exit()
        .transition()
        .style("opacity", 0)
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return my;
  };

  my.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return my;
  };

  my.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return my;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Reusable Labeled Node Component
 *
 * @example
 * var myNode = d3.ez.component.labeledNode()
 *     .label("Circle Label")
 *     .color("#ff0000")
 *     .classed("bubble")
 *     .opacity(0.5)
 *     .stroke(1)
 *     .radius(5);
 * d3.selectAll("g").call(myNode);
 */
function componentLabeledNode() {
  // Default Options (Configurable via setters)
  var color = "steelblue";
  var opacity = 1;
  var strokeColor = "#000000";
  var strokeWidth = 1;
  var radius = 8;
  var label = null;
  var display = 'block';
  var fontSize = 10;
  var classed = "labeledNode";
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick");

  function sizeAccessor(_) {
    return (typeof radius === "function" ? radius(_) : radius);
  }
  function my(selection) {
    selection.each(function(data) {
      var r = sizeAccessor(data);

      var node = d3.select(this)
        .attr("class", classed);

      node.append("circle")
        .attr("r", r)
        .attr("fill-opacity", opacity)
        //.style("stroke", strokeColor)
        //.style("stroke-width", strokeWidth)
        .style("fill", color);

      node.append("text")
        .text(label)
        .attr("dx", 0 - ((r/2) + 6))
        .attr("dy", 0 - ((r/2) + 6))
        .style("display", display)
        .style("font-size", fontSize + "px")
        .attr("alignment-baseline", "hanging")
        .style("text-anchor", "end");
    });
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

  my.display = function(_) {
    if (!arguments.length) return display;
    display = _;
    return this;
  };

  my.fontSize = function(_) {
    if (!arguments.length) return fontSize;
    fontSize = _;
    return this;
  };

  my.stroke = function(_width, _color) {
    if (!arguments.length) return [strokeWidth, strokeColor];
    strokeWidth = _width;
    strokeColor = _color;
    return this;
  };

  my.classed = function(_) {
    if (!arguments.length) return classed;
    classed = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

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
function componentLegend() {
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

    var legendTitle = legendBox.append('g')
      .attr("transform", "translate(5, 15)");

    legendTitle.append('text')
      .style("font-weight", "bold")
      .text(title);

    var y = 10;
    // Size Key
    if (typeof sizeScale !== "undefined") {
      // Calcualate a range of 5 numbers between min and max of range
      var min = d3.min(sizeScale.range());
      var max = d3.max(sizeScale.range());
      var diff = max - min;
      var step = diff / 4;
      var range = [];
      range[0] = min;
      for (var s = 1; s < 5; s++) {
        range[s] = range[s - 1] + step;
      }
      sizeScale.range(range);

      var numElements = sizeScale.range().length;
      var elementHeight = ((height - 45) / numElements);

      var sizeKey = legendBox.append('g')
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

      var colorKey = legendBox.append('g')
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
          var text = keyScaleRange('threshold', index);
        } else {
          var text = colorScale.domain()[index];
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
        var min = colorScale.domain()[position];
        var max = colorScale.domain()[position + 1];
        rangeStr = (isNaN(max) ? "> " + min : min + ' - ' + max);
        return rangeStr;
        break;
    }
    var rangeIncrement = domainSize / rangeLength;
    var ranges = [];
    var range = [];
    var rangeStart = domainMin;
    var rangeEnd = domainMin + rangeIncrement;

    for (var i = 0; i < rangeLength; i++) {
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
}

/**
 * Reusable Title Component
 *
 * @example
 * var myTitle = d3.ez.component.title()
 *     .enabled(true)
 *     .mainText("Hello World")
 *     .subText("This is a test");
 * d3.select("svg").call(myTitle);
 */
function componentTitle() {
  // Default Options (Configurable via setters)
  var mainText = "Title";
  var subText = "Sub Title";
  var height = 40;
  var width = 200;

  function my(selection) {
    selection.selectAll("#titleGroup")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "titleGroup");
    var titleGroup = selection.select("#titleGroup");

    titleGroup.selectAll('.title').data([mainText])
      .enter()
      .append("text")
      .classed("title", true)
      .text(function(d) { return d; });
    var title = titleGroup.select(".title").text(mainText);

    titleGroup.selectAll('.subTitle').data([subText])
      .enter()
      .append("text")
      .classed("subTitle", true)
      .text(function(d) { return d; });
    var subTitle = titleGroup.select(".subTitle").text(subText);

    // Centre Text
    var titleOffset = 1 - (title.node().getBBox().width / 2);
    var subTitleOffset = 1 - (subTitle.node().getComputedTextLength() / 2);
    title.attr("transform", "translate(" + titleOffset + ", " + 15 + ")");
    subTitle.attr("transform", "translate(" + subTitleOffset + ", " + 30 + ")");
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
}

/**
 * Reusable Credit Tag Component
 *
 * @example
 * var creditTag = d3.ez.component.creditTag()
 *     .enabled(true)
 *     .text("d3-ez.net")
 *     .href("http://d3-ez.net");
 * d3.select("svg").call(creditTag);
 */
function componentCreditTag() {
  // Default Options (Configurable via setters)
  var text = "d3-ez.net";
  var href = "http://d3-ez.net";

  function my(selection) {
    var creditTag = selection.selectAll("#creditTag")
      .data([0])
      .enter()
      .append("g")
      .attr("id", "creditTag");

    var creditText = creditTag.append("text")
      .text(text)
      .attr("xlink:href", href)
      .on("click", function() {
        window.open(href);
      });

    // Right Justify Text
    var xPos = 0 - (d3.select("#creditTag").selectAll("text").node().getBBox().width);
    creditText.attr("transform", "translate(" + xPos + ", 0)");
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
}

/**
 * Circular Bar Chart (also called: Progress Chart)
 *
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
function chartBarChartCircular() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "barChartCircular";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;

  // Data Variables
  var maxValue;
  var categoryNames;

  // Other Customisation Options
  var startAngle = 0;
  var endAngle = 270;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;
    maxValue = slicedData.maxValue;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([radius, innerRadius])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([startAngle, endAngle]);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("circularAxis", true);
        chart.append("g").classed("barsCircular", true);
        chart.append("g").classed("circularSectorLabels", true);
        chart.append("g").classed("circularRingLabels", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Circular Axis
      var circularAxis = d3.ez.component.circularAxis()
        .radialScale(yScale)
        .ringScale(xScale)
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.select(".circularAxis")
        .call(circularAxis);

      // Outer Labels
      var circularSectorLabels = d3.ez.component.circularSectorLabels()
        .radialScale(yScale)
        .textAnchor("middle")
        .radius(radius * 1.04);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

      // Radial Bar Chart
      var barsCircular = d3.ez.component.barsCircular()
        .radius(function(d) { return xScale(d.key) })
        .innerRadius(function(d) { return xScale(d.key) + xScale.bandwidth(); })
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.select(".barsCircular")
        .datum(data)
        .call(barsCircular);

      // Ring Labels
      var circularRingLabels = d3.ez.component.circularRingLabels()
        .radialScale(xScale)
        .textAnchor("middle");

      chart.select(".circularRingLabels")
        .call(circularRingLabels);

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Clustered Bar Chart (also called: Multi-set Bar Chart; Grouped Bar Chart)
 *
 * @see http://datavizproject.com/data-type/grouped-bar-chart/
 */
function chartBarChartClustered() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "barChartClustered";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var xScale2;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var groupNames;
  var groupTotalsMax;
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var yAxisLabel = null;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    groupNames = slicedData.groupNames;
    groupTotalsMax = slicedData.groupTotalsMax;
    maxValue = slicedData.maxValue;
    categoryNames = slicedData.categoryNames;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([0, chartW])
      .padding(0.1);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, maxValue]);

    xScale2 = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, xScale.bandwidth()])
      .padding(0.1);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      var barsVertical = d3.ez.component.barsVertical()
        .width(xScale.bandwidth())
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale2)
        .yScale(yScale)
        .dispatch(dispatch);

      // Create bar group
      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(data);

      seriesGroup.enter()
        .append("g")
        .classed("seriesGroup", true)
        .attr("transform", function(d) { return "translate(" + xScale(d.key) + ", 0)"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(barsVertical);

      seriesGroup.exit()
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Stacked Bar Chart
 *
 * @see http://datavizproject.com/data-type/stacked-bar-chart/
 */
function chartBarChartStacked() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "barChartStacked";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var xScale2;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var groupNames;
  var groupTotalsMax;
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var yAxisLabel = null;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    groupNames = slicedData.groupNames;
    groupTotalsMax = slicedData.groupTotalsMax;
    maxValue = slicedData.maxValue;
    categoryNames = slicedData.categoryNames;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([0, chartW])
      .padding(0.1);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, groupTotalsMax]);

    xScale2 = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, xScale.bandwidth()])
      .padding(0.1);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".x-axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".y-axis")
        .call(yAxis);

      var barsStacked = d3.ez.component.barsStacked()
        .width(xScale.bandwidth())
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .dispatch(dispatch);

      // Create bar group
      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(data);

      seriesGroup.enter()
        .append("g")
        .classed("seriesGroup", true)
        .attr("transform", function(d) { return "translate(" + xScale(d.key) + ", 0)"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(barsStacked);

      seriesGroup.exit()
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Bar Chart (vertical) (also called: Bar Chart; Bar Graph)
 *
 * @see http://datavizproject.com/data-type/bar-chart/
 */
function chartBarChartVertical() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "barChartVertical";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var yAxisLabel;

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;
    maxValue = slicedData.maxValue;

    if (!yAxisLabel) {
      yAxisLabel = slicedData.groupName;
    }

    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([0, chartW])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([chartH, 0]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed('chart', true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
        chart.append("g").classed("barChart", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".yAxis")
        .call(yAxis);

      // Add labels to chart
      var ylabel = chart.select(".yAxis")
        .selectAll(".y-label")
        .data([data.key]);

      ylabel.enter()
        .append("text")
        .classed("y-label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .attr("fill", "#000000")
        .style("text-anchor", "end")
        .merge(ylabel)
        .transition()
        .text(function(d) {
          return (d);
        });

      // Add bars to the chart
      var barsVertical = d3.ez.component.barsVertical()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      chart.select(".barChart")
        .datum(data)
        .call(barsVertical);
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Bubble Chart
 *
  @see http://datavizproject.com/data-type/bubble-chart/
 */
function chartBubbleChart() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "bubbleChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(3);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var sizeScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var xDomain;
  var yDomain;
  var sizeDomain;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Misc Options
  var minRadius = 3;
  var maxRadius = 20;
  var yAxisLabel;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    function extents(key) {
      // Calculate the extents for each series.
      var serExts = [];
      d3.map(data).values().forEach(function(d) {
        var vals = d.values.map(function(e) {
          return +e[key];
        });
        serExts.push(d3.extent(vals));
      });
      // Merge all the series extents into one array.
      // Calculate overall extent.
      return d3.extent([].concat.apply([], serExts));
    }

    xDomain = extents('x');
    yDomain = extents('y');
    sizeDomain = extents('value');
    categoryNames = data.map(function(d) {
      return d.key;
    });

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X, Y & Z Scales
    xScale = d3.scaleLinear()
      .range([0, chartW])
      .domain(xDomain)
      .nice();

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain(yDomain)
      .nice();

    sizeScale = d3.scaleLinear()
      .range([minRadius, maxRadius])
      .domain(sizeDomain);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
        chart.append("g").classed("bubbles", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.select(".yAxis")
        .call(yAxis);

      // Add bubbles to the chart
      var bubbles = d3.ez.component.bubbles()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .xScale(xScale)
        .yScale(yScale)
        .sizeScale(sizeScale)
        .dispatch(dispatch);

      var bubbleGroup = chart.selectAll(".bubbleGroup")
        .data(function(d) { return d; });

      bubbleGroup.enter().append("g")
        .attr("class", "bubbleGroup")
        .datum(function(d) { return d; })
        .merge(bubbleGroup)
        .call(bubbles);

      bubbleGroup.exit()
        .remove();

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Candlestick Chart (also called: Japanese Candlestick; OHLC Chart; Box Plot)
 *
 * @see http://datavizproject.com/data-type/candlestick-chart/
 */
function chartCandlestickChart() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "candlestickChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = ["green", "red"];

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    // Convert dates
    data.values.forEach(function(d, i) {
      data.values[i].date = Date.parse(d.date);
    });

    // Slice Data, calculate totals, max etc.
    var maxDate = d3.max(data.values, function(d) {
      return d.date;
    });
    var minDate = d3.min(data.values, function(d) {
      return d.date;
    });

    //if (!yAxisLabel) {
    //  yAxisLabel = slicedData.groupName;
    //}

    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain([true, false]);
    }

    // X & Y Scales
    xScale = d3.scaleTime()
      .domain([
        new Date(minDate - 8.64e7),
        new Date(maxDate + 8.64e7)
      ])
      .range([0, chartW]);

    yScale = d3.scaleLinear()
      .domain([
        d3.min(data.values, function(d) { return d.low; }),
        d3.max(data.values, function(d) { return d.high; })
      ])
      .range([chartH, 0])
      .nice();

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed('chart', true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
        chart.append("g").classed("candleSticks", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

      chart.select(".yAxis")
        .call(yAxis);

      // Add labels to chart
      var ylabel = chart.select(".yAxis")
        .selectAll(".y-label")
        .data([data.key]);

      ylabel.enter()
        .append("text")
        .classed("y-label", true)
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .attr("fill", "#000000")
        .style("text-anchor", "end")
        .merge(ylabel)
        .transition()
        .text(function(d) {
          return (d);
        });

      // Add Clip Path
      // chart.append('clipPath')
      //   .attr('id', 'plotAreaClip')
      //   .append('rect')
      //   .attr('width', chartW)
      //   .attr('height', chartH)
      //   .attr('clip-path', 'url(#plotAreaClip)');

      // Add candles to the chart
      var candleSticks = d3.ez.component.candleSticks()
        .width(chartW)
        .height(chartH)
        .xScale(xScale)
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.select(".candleSticks")
        .datum(data)
        .call(candleSticks);
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Donut Chart (also called: Doughnut Chart; Pie Chart)
 *
 * @see http://datavizproject.com/data-type/donut-chart/
 */
function chartDonutChart() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "donutChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeCubic, duration: 750 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var colorScale;

  // Data Variables
  var categoryNames = [];

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 2 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add the chart
      var donutChart = d3.ez.component.donut()
        .radius(radius)
        .innerRadius(innerRadius)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.datum(data)
        .call(donutChart);

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Circular Heat Map (also called: Radial Heat Map)
 *
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
function chartHeatMapRadial() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "heatMapRadial";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;

  // Data Variables
  var categoryNames = [];
  var groupNames = [];
  var minValue = 0;
  var maxValue = 0;
  var thresholds;

  // Other Customisation Options
  var startAngle = 0;
  var endAngle = 270;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    maxValue = slicedData.maxValue;
    minValue = slicedData.minValue;
    categoryNames = slicedData.categoryNames;
    groupNames = slicedData.groupNames;

    // If thresholds values are not already set
    // attempt to auto-calculate some thresholds.
    if (!thresholds) {
      thresholds = slicedData.thresholds;
    }

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleThreshold()
        .range(colors)
        .domain(thresholds);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([startAngle, endAngle])
      .padding(0.1);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .rangeRound([radius, innerRadius])
      .padding(0.1);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create chart element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("circleRings", true);
        chart.append("g").classed("circularSectorLabels", true);
        chart.append("g").classed("circularRingLabels", true);
      } else {
        chart = svg.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      var heatMapRing = d3.ez.component.heatMapRing()
        .radius(function(d) { return yScale(d.key) })
        .innerRadius(function(d) { return yScale(d.key) + yScale.bandwidth(); })
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var seriesGroup = chart.select(".circleRings").selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter()
        .append("g")
        .attr("class", "seriesGroup")
        .merge(seriesGroup)
        .datum(function(d) { return d; })
        .call(heatMapRing);

      seriesGroup.exit()
        .remove();

      // Circular Labels
      var circularSectorLabels = d3.ez.component.circularSectorLabels()
        .radialScale(xScale)
        .textAnchor("start")
        .radius(radius * 1.04);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

      // Ring Labels
      var circularRingLabels = d3.ez.component.circularRingLabels()
        .radialScale(yScale)
        .textAnchor("middle");

      chart.select(".circularRingLabels")
        .call(circularRingLabels);

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.innerRadius = function(_) {
    if (!arguments.length) return innerRadius;
    innerRadius = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Heat Map (also called: Heat Table; Density Table; Heat Map)
 *
 * @see http://datavizproject.com/data-type/heat-map/
 */
function chartHeatMapTable() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "heatMapTable";
  var width = 400;
  var height = 300;
  var margin = { top: 45, right: 20, bottom: 20, left: 45 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = [d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65)];

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;
  var xAxis;
  var yAxis;

  // Data Variables
  var groupNames = [];
  var categoryNames = [];
  var minValue = 0;
  var maxValue = 0;
  var thresholds = undefined;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    maxValue = slicedData.maxValue;
    minValue = slicedData.minValue;
    categoryNames = slicedData.categoryNames;
    groupNames = slicedData.groupNames;

    // If thresholds values are not already set
    // attempt to auto-calculate some thresholds.
    if (!thresholds) {
      thresholds = slicedData.thresholds;
    }

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleThreshold()
        .domain(thresholds)
        .range(colors);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .range([0, chartW])
      .padding(0.1);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .range([0, chartH])
      .padding(0.1);

    // X & Y Axis
    xAxis = d3.axisTop(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("x-axis axis", true);
        chart.append("g").classed("y-axis axis", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".x-axis")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -8)
        .attr("transform", "rotate(60)")
        .style("text-anchor", "end");

      chart.select(".y-axis")
        .call(yAxis);

      var heatMapRow = d3.ez.component.heatMapRow()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter().append("g")
        .attr("class", "seriesGroup")
        .attr("transform", function(d) { return "translate(0, " + yScale(d.key) + ")"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(heatMapRow);

      seriesGroup.exit()
        .remove();

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.thresholds = function(_) {
    if (!arguments.length) return thresholds;
    thresholds = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 *
  @see http://datavizproject.com/data-type/line-chart/
 */
function chartLineChart() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "lineChart";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(3);

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var groupNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var yAxisLabel = null;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    maxValue = slicedData.maxValue;
    groupNames = slicedData.groupNames;

    // Convert dates
    data.forEach(function(d, i) {
      d.values.forEach(function(b, j) {
        data[i].values[j].key = new Date(b.key * 1000);
      });
    });
    var dateDomain = d3.extent(data[0].values, function(d) { return d.key; });

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(groupNames);
    }

    // X & Y Scales
    xScale = d3.scaleTime()
      .range([0, chartW])
      .domain(dateDomain);

    yScale = d3.scaleLinear()
      .range([chartH, 0])
      .domain([0, (maxValue * 1.05)]);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat("%d-%b-%y"));
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      chart.select(".yAxis")
        .call(yAxis);

      var lineChart = d3.ez.component.lineChart()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var scatterPlot = d3.ez.component.scatterPlot()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var lineGroup = chart.selectAll(".lineGroup")
        .data(function(d) { return d; });

      lineGroup.enter().append("g")
        .attr("class", "lineGroup")
        .style("fill", function(d) { return colorScale(d.key); })
        .datum(function(d) { return d; })
        .merge(lineGroup)
        .call(lineChart).call(scatterPlot);

      lineGroup.exit()
        .remove();

      var dotGroup = chart.selectAll(".dotGroup")
        .data(function(d) { return d; });

      dotGroup.enter().append("g")
        .attr("class", "dotGroup")
        .style("fill", function(d) { return colorScale(d.key); })
        .datum(function(d) { return d; })
        .merge(dotGroup)
        .call(scatterPlot);

      dotGroup.exit()
        .remove();
    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.yAxisLabel = function(_) {
    if (!arguments.length) return yAxisLabel;
    yAxisLabel = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Polar Area Chart (also called: Coxcomb Chart; Rose Chart)
 *
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
function chartPolarAreaChart() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "chartPolarArea";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 20 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;

  // Scales and Axis
  var xScale;
  var yScale;
  var colorScale;

  // Data Variables
  var categoryNames = [];
  var maxValue = 0;

  // Other Customisation Options
  var startAngle = 0;
  var endAngle = 360;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Other Customisation Options
  var capitalizeLabels = false;
  var colorLabels = false;

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;
    maxValue = slicedData.maxValue;

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([startAngle, endAngle])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius])
      .nice();
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("circularAxis", true);
        chart.append("g").classed("polarArea", true);
        chart.append("g").classed("circularSectorLabels", true);
        chart.append("g").classed("verticalAxis axis", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Circular Axis
      var circularAxis = d3.ez.component.circularAxis()
        .radialScale(xScale)
        .ringScale(yScale)
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.select(".circularAxis")
        .call(circularAxis);

      // Radial Bar Chart
      var polarArea = d3.ez.component.polarArea()
        .radius(radius)
        .xScale(xScale)
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.select(".polarArea")
        .datum(data)
        .call(polarArea);

      // Vertical Axis
      var verticalAxis = d3.axisLeft(yScale.domain([maxValue, 0]).nice());
      chart.select(".verticalAxis")
        .attr("transform", "translate(0," + -(chartH / 2) + ")")
        .call(verticalAxis);

      // Circular Labels
      var circularSectorLabels = d3.ez.component.circularSectorLabels()
        .radialScale(xScale)
        .textAnchor("start")
        .radius(radius * 1.04);

      chart.select(".circularSectorLabels")
        .call(circularSectorLabels);

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.capitalizeLabels = function(_) {
    if (!arguments.length) return capitalizeLabels;
    capitalizeLabels = _;
    return this;
  };

  my.colorLabels = function(_) {
    if (!arguments.length) return colorLabels;
    colorLabels = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * Punch Card
 *
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
function chartPunchCard() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "punchCard";
  var width = 400;
  var height = 300;
  var margin = { top: 45, right: 20, bottom: 20, left: 45 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = [d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()];

  // Chart Dimensions
  var chartW;
  var chartH;

  // Scales and Axis
  var sizeScale;
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var minValue;
  var categoryNames;
  var groupNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  // Misc Options
  var minRadius = 2;
  var maxRadius = 20;
  var useGlobalScale = true;

  function init(data) {
    chartW = width - margin.left - margin.right;
    chartH = height - margin.top - margin.bottom;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    maxValue = slicedData.maxValue;
    minValue = slicedData.minValue;
    categoryNames = slicedData.categoryNames;
    groupNames = slicedData.groupNames;

    var valDomain = [minValue, maxValue];
    var sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[1]['values'], function(d) {
      return d['value'];
    })];

    // Colour Scale
    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleLinear()
        .domain(valDomain)
        .range(colors);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .range([0, chartW])
      .padding(0.05);

    yScale = d3.scaleBand()
      .domain(groupNames)
      .range([0, chartH])
      .padding(0.05);

    // X & Y Axis
    xAxis = d3.axisTop(xScale);
    yAxis = d3.axisLeft(yScale);

    // Size Scale
    sizeScale = d3.scaleLinear()
      .domain(sizeDomain)
      .range([minRadius, maxRadius]);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG and Chart containers (if they do not already exist)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("xAxis axis", true);
        chart.append("g").classed("yAxis axis", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      // Add axis to chart
      chart.select(".xAxis")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -8)
        .attr("transform", "rotate(60)")
        .style("text-anchor", "end");

      chart.select(".yAxis")
        .call(yAxis);

      var proportionalAreaCircles = d3.ez.component.proportionalAreaCircles()
        .width(chartW)
        .height(chartH)
        .colorScale(colorScale)
        .sizeScale(sizeScale)
        .yScale(yScale)
        .xScale(xScale)
        .dispatch(dispatch);

      var seriesGroup = chart.selectAll(".seriesGroup")
        .data(function(d) { return d; });

      seriesGroup.enter().append("g")
        .attr("class", "seriesGroup")
        .attr("transform", function(d) { return "translate(0, " + yScale(d.key) + ")"; })
        .datum(function(d) { return d; })
        .merge(seriesGroup)
        .call(proportionalAreaCircles);

      seriesGroup.exit()
        .remove();

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return this;
  };

  my.minRadius = function(_) {
    if (!arguments.length) return minRadius;
    minRadius = _;
    return this;
  };

  my.maxRadius = function(_) {
    if (!arguments.length) return maxRadius;
    maxRadius = _;
    return this;
  };

  my.sizeScale = function(_) {
    if (!arguments.length) return sizeScale;
    sizeScale = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.useGlobalScale = function(_) {
    if (!arguments.length) return useGlobalScale;
    useGlobalScale = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}

/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */

var my = {
  version: "3.1.0",
  author: "James Saunders",
  copyright: "Copyright (C) 2018 James Saunders",
  license: "GPL-3.0",
  base: base,
  dataParse: dataParse,
  colors: colors(),
  component: {
    barsCircular: componentBarsCircular,
    barsStacked: componentBarsStacked,
    barsVertical: componentBarsVertical,
    bubbles: componentBubbles,
    candleSticks: componentCandleSticks,
    circularAxis: componentCircularAxis,
    circularRingLabels: componentCircularRingLabels,
    circularSectorLabels: componentCircularSectorLabels,
    creditTag: componentCreditTag,
    donut: componentDonut,
    heatMapRing: componentHeatMapRing,
    heatMapRow: componentHeatMapRow,
    htmlList: componentHtmlList,
    htmlTable: componentHtmlTable,
    labeledNode: componentLabeledNode,
    legend: componentLegend,
    lineChart: componentLineChart,
    numberCard: componentNumberCard,
    polarArea: componentPolarArea,
    proportionalAreaCircles: componentProportionalAreaCircles,
    scatterPlot: componentScatterPlot,
    title: componentTitle,
  },
  chart: {
    barChartCircular: chartBarChartCircular,
    barChartClustered: chartBarChartClustered,
    barChartStacked: chartBarChartStacked,
    barChartVertical: chartBarChartVertical,
    bubbleChart: chartBubbleChart,
    candlestickChart: chartCandlestickChart,
    donutChart: chartDonutChart,
    heatMapRadial: chartHeatMapRadial,
    heatMapTable: chartHeatMapTable,
    lineChart: chartLineChart,
    polarAreaChart: chartPolarAreaChart,
    punchCard: chartPunchCard
  }
};

exports.ez = my;

Object.defineProperty(exports, '__esModule', { value: true });

})));
