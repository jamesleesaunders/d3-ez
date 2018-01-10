/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2017 James Saunders
 * @license GPLv3
 */
d3.ez = {
    version: "2.2.0",
    author: "James Saunders",
    copyright: "Copyright (C) 2017 James Saunders",
    license: "GPL-3.0"
};

d3.ez.component = {
    description: "Reusable Components"
};

/**
 * Base Functions - Data Parse
 *
 */
d3.ez.dataParse = function module(data) {
    var levels = function() {
        if (data["key"] != undefined) {
            return 1;
        } else {
            return 2;
        }
    }();
    var groupName = function() {
        if (1 == levels) {
            var ret = d3.values(data)[0];
        } else {
            var ret = undefined;
        }
        return ret;
    }();
    var groupNames = function() {
        if (1 == levels) {
            ret = undefined;
        } else {
            var ret = data.map(function(d) {
                return d.key;
            });
        }
        return ret;
    }();
    var groupTotals = function() {
        if (1 == levels) {
            var ret = undefined;
        } else {
            var ret = {};
            d3.map(data).values().forEach(function(d, i) {
                var groupName = d.key;
                d.values.forEach(function(d, i) {
                    var categoryValue = +d.value;
                    ret[groupName] = typeof ret[groupName] === "undefined" ? 0 : ret[groupName];
                    ret[groupName] += categoryValue;
                });
            });
        }
        return ret;
    }();
    var groupTotalsMax = function() {
        if (1 == levels) {
            var ret = undefined;
        } else {
            var ret = d3.max(d3.values(groupTotals));
        }
        return ret;
    }();
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
    var categoryNames = function() {
        var ret = [];
        if (1 == levels) {
            ret = d3.values(data)[1].map(function(d) {
                return d.key;
            });
        } else {
            d3.map(data).values().forEach(function(d, i) {
                var tmp = [];
                var groupName = d.key;
                d.values.forEach(function(d, i) {
                    categoryName = d.key;
                    tmp[i] = categoryName;
                });
                ret = union(tmp, ret);
            });
        }
        return ret;
    }();
    var categoryTotal = function() {
        if (1 == levels) {
            var ret = d3.sum(data.values, function(d) {
                return d.value;
            });
        } else {
            var ret = undefined;
        }
        return ret;
    }();
    var categoryTotals = function() {
        if (1 == levels) {
            var ret = undefined;
        } else {
            var ret = {};
            d3.map(data).values().forEach(function(d, i) {
                var groupName = d.key;
                d.values.forEach(function(d, i) {
                    var categoryName = d.key;
                    var categoryValue = +d.value;
                    ret[categoryName] = typeof ret[categoryName] === "undefined" ? 0 : ret[categoryName];
                    ret[categoryName] += categoryValue;
                });
            });
        }
        return ret;
    }();
    var categoryTotalsMax = function() {
        if (1 == levels) {
            var ret = undefined;
        } else {
            var ret = d3.max(d3.values(categoryTotals));
        }
        return ret;
    }();
    var minValue = function() {
        if (1 == levels) {
            var ret = d3.min(data.values, function(d) {
                return d.value;
            });
        } else {
            var ret = undefined;
            d3.map(data).values().forEach(function(d, i) {
                d.values.forEach(function(d, i) {
                    ret = typeof ret === "undefined" ? d.value : d3.min([ ret, d.value ]);
                });
            });
        }
        return +ret;
    }();
    var maxValue = function() {
        if (1 == levels) {
            var ret = d3.max(data.values, function(d) {
                return d.value;
            });
        } else {
            var ret = undefined;
            d3.map(data).values().forEach(function(d, i) {
                d.values.forEach(function(d, i) {
                    ret = typeof ret === "undefined" ? d.value : d3.max([ ret, d.value ]);
                });
            });
        }
        return +ret;
    }();
    var decimalPlaces = function(num) {
        var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        ret = Math.max(0, // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
        return ret;
    };
    var maxDecimalPlace = function() {
        if (1 == levels) {
            var ret = undefined;
        } else {
            var ret = 0;
            d3.map(data).values().forEach(function(d) {
                d.values.forEach(function(d) {
                    ret = d3.max([ ret, decimalPlaces(d.value) ]);
                });
            });
        }
        return ret;
    }();
    // If thresholds values are not already set attempt to auto-calculate some thresholds
    var thresholds = function() {
        var distance = maxValue - minValue;
        var ret = [ (minValue + .15 * distance).toFixed(maxDecimalPlace), (minValue + .4 * distance).toFixed(maxDecimalPlace), (minValue + .55 * distance).toFixed(maxDecimalPlace), (minValue + .9 * distance).toFixed(maxDecimalPlace) ];
        return ret;
    }();
    var my = {
        levels: levels,
        groupName: groupName,
        groupNames: groupNames,
        groupTotals: groupTotals,
        groupTotalsMax: groupTotalsMax,
        categoryNames: categoryNames,
        categoryTotal: categoryTotal,
        categoryTotals: categoryTotals,
        categoryTotalsMax: categoryTotalsMax,
        minValue: minValue,
        maxValue: maxValue,
        maxDecimalPlace: maxDecimalPlace,
        thresholds: thresholds
    };
    return my;
};

/**
 * Chart Base
 *
 * @example
 * @todo
 */
d3.ez.chart = function module() {
    // SVG and Canvas containers (Populated by 'my' function)
    var svg;
    var canvas;
    // Default Options (Configurable via setters)
    var width = 600;
    var height = 400;
    var margin = {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
    };
    var canvasW = 580;
    var canvasH = 380;
    var chartTop = 0;
    var classed = "d3ez";
    var chart = undefined;
    var legend = undefined;
    var title = undefined;
    var creditTag = d3.ez.component.creditTag();
    var description = "";
    var yAxisLabel = "";
    // Colours
    var colorScale = undefined;
    // Dispatch (custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function init(data) {
        canvasW = width - (margin.left + margin.right);
        canvasH = height - (margin.top + margin.bottom);
        // Init Chart
        chart.dispatch(dispatch).width(canvasW).height(canvasH);
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
                svg = d3.select(this).append("svg").classed(classed, true).attr("width", width).attr("height", height);
                canvas = svg.append("g").classed("canvas", true);
                canvas.append("g").classed("chartbox", true);
                canvas.append("g").classed("legendbox", true);
                canvas.append("g").classed("titlebox", true);
                canvas.append("g").classed("creditbox", true);
            } else {
                canvas = svg.select(".canvas");
            }
            // Update the canvas dimensions
            canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", canvasW).attr("height", canvasH);
            // Add Chart
            canvas.select(".chartbox").datum(data).attr("transform", "translate(" + 0 + "," + chartTop + ")").call(chart);
            // Add Legend
            if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
                if (typeof chart.colorScale === "function") {
                    legend.colorScale(chart.colorScale());
                }
                if (typeof chart.sizeScale === "function") {
                    legend.sizeScale(chart.sizeScale());
                }
                canvas.select(".legendbox").attr("transform", "translate(" + (canvasW - legend.width()) + "," + title.height() + ")").call(legend);
            }
            // Add Title
            if (title) {
                canvas.select(".titlebox").attr("transform", "translate(" + width / 2 + "," + 0 + ")").call(title);
            }
            // Add Credit Tag
            canvas.select(".creditbox").attr("transform", "translate(" + (width - 20) + "," + (height - 20) + ")").call(creditTag);
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
            title = d3.ez.title().mainText(_).subText("");
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
};

/**
 * Colour Palettes
 *
 * @example
 * d3.ez.colors.categorical(1);
 * d3.ez.colors.diverging(1);
 * d3.ez.colors.sequential("#ff0000", 9);
 * d3.ez.colors.lumShift(d3.ez.colors.categorical(1), 0.2);
 */
d3.ez.colors = {
    categorical: function(scheme) {
        // Categorical colour schemes are the ones that are used to separate items into
        // distinct groups or categories.
        switch (scheme) {
          case 1:
            // Stephen Few - Show Me the Numbers Book
            //      Blue       Orange     Green      Pink       L Brown    Purple     D.Yellow   Red        Black
            return [ "#5da5da", "#faa43a", "#60bd68", "#f17cb0", "#b2912f", "#b276b2", "#decf3f", "#f15854", "#4d4d4d" ];

          case 2:
            // Color Brewer - http://colorbrewer2.com/
            //      Red        L.Blue     Green      Purple     Orange     Yellow     Brown      Pink       Grey
            return [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2" ];

          case 3:
            // Google Design - http://www.google.com/design/spec/style/color.html
            //      D. Blue    Orange     L.Green    Purple     Yellow     L.Blue     Red        D.Green    Brown
            return [ "#3f51b5", "#ff9800", "#8bc34a", "#9c27b0", "#ffeb3b", "#03a9f4", "#f44336", "#009688", "#795548" ];

          case 4:
            return d3.ez.colors.lumShift(d3.ez.colors.lumShift(d3.ez.colors.categorical(3), -.8), 5.5);
        }
    },
    diverging: function(scheme) {
        // Diverging colour schemes are used for quantitative data. Usually two different hues
        // that diverge from a light colour, for the critical midpoint, toward dark colours.
        switch (scheme) {
          case 1:
            // Color Brewer - Colourblind Safe
            return [ "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e" ];

          case 2:
            // Color Brewer - RAG
            return [ "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850" ];

          case 3:
            // Chroma.js - http://gka.github.io/palettes/#colors=Blue,Ivory,Red|steps=9|bez=0|coL=0
            return [ "#0000ff", "#8052fe", "#b58bfb", "#ddc5f7", "#fffff0", "#ffcfb4", "#ff9e7a", "#ff6842", "#ff0000" ];
        }
    },
    sequential: function(origHex, count) {
        // Sequential colour schemes are primarily used to encode quantitative differences.
        // Quantitative values are arranged sequentially, from low to high.
        var lumStep = .1;
        var lumMax = lumStep * count / 2;
        var lumMin = 0 - lumMax;
        var lumScale = d3.scale.linear().domain([ 1, count ]).range([ lumMin, lumMax ]);
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
                c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
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
            var newHex = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(origHex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
                newHex += ("00" + c).substr(c.length);
            }
            result[index] = newHex;
        });
        return result;
    }
};

/**
 * Reusable Grouped Bar Chart
 *
 */
d3.ez.component.barGrouped = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 400;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            // Add bars to series
            var bars = series.selectAll(".bar").data(function(d) {
                return d.values;
            });
            bars.enter().append("rect").classed("bar", true).attr("fill", function(d) {
                return colorScale(d.key);
            }).attr("width", xScale.bandwidth()).attr("x", function(d) {
                return xScale(d.key);
            }).attr("y", height).attr("rx", 0).attr("ry", 0).attr("height", 0).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("x", function(d) {
                return xScale(d.key);
            }).attr("y", function(d) {
                return yScale(d.value);
            }).attr("height", function(d) {
                return height - yScale(d.value);
            });
            bars.exit().transition().style("opacity", 0).remove();
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
};

/**
 * Reusable Stacked Bar Chart
 *
 */
d3.ez.component.barStacked = function module() {
    // Default Options (Configurable via setters)
    var width = 100;
    var height = 400;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        // Stack Generator
        var stacker = function(data) {
            series = [];
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
            selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).attr("width", width).attr("height", height).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            var series = selection.selectAll(".series");
            // Add Bars to Group
            var bars = series.selectAll(".bar").data(function(d) {
                return stacker(d.values);
            });
            bars.enter().append("rect").classed("bar", true).attr("width", width).attr("x", 0).attr("y", height).attr("rx", 0).attr("ry", 0).attr("height", 0).attr("fill", function(d) {
                return colorScale(d.name);
            }).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(bars).transition().ease(transition.ease).duration(transition.duration).attr("width", width).attr("x", 0).attr("y", function(d) {
                return yScale(d.y1);
            }).attr("height", function(d) {
                return yScale(d.y0) - yScale(d.y1);
            });
            bars.exit().transition().style("opacity", 0).remove();
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
};

/**
 * Reusable Radial Bar Chart
 *
 */
d3.ez.component.barRadial = function module() {
    // Default Options (Configurable via setters)
    var width = 300;
    var height = 300;
    var radius = 150;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        var defaultRadius = Math.min(width, height) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        var yDomain = yScale.domain();
        var barScale = d3.scaleLinear().domain(yDomain).range([ 0, radius ]);
        // Pie Generator
        var pie = d3.pie().value(1).sort(null).padAngle(0);
        // Arc Generator
        var arc = d3.arc().outerRadius(function(d) {
            return barScale(d.data.value);
        }).innerRadius(0).cornerRadius(2);
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            // Add segments to series
            var segments = series.selectAll(".segment").data(function(d) {
                return pie(d.values);
            });
            segments.enter().append("path").classed("segment", true).style("fill", function(d) {
                return colorScale(d.data.key);
            }).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d.data);
            }).merge(segments).transition().ease(transition.ease).duration(transition.duration).attr("d", arc);
            segments.exit().transition().style("opacity", 0).remove();
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
};

/**
 * Reusable Donut Chart
 *
 */
d3.ez.component.donut = function module() {
    // Default Options (Configurable via setters)
    var width = 300;
    var height = 300;
    var radius = 150;
    var innerRadius;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        var defaultRadius = Math.min(width, height) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        innerRadius = typeof innerRadius === "undefined" ? defaultRadius / 2 : innerRadius;
        // Pie Generator
        var pie = d3.pie().value(function(d) {
            return d.value;
        }).sort(null).padAngle(.015);
        // Arc Generators
        var arc = d3.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(2);
        var outerArc = d3.arc().innerRadius(radius * .9).outerRadius(radius * .9);
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
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series.append("g").attr("class", "slices");
            series.append("g").attr("class", "labels");
            series.append("g").attr("class", "lines");
            series = selection.selectAll(".series").merge(series);
            // Slices
            var slices = series.select(".slices").selectAll("path.slice").data(function(d) {
                return pie(d.values);
            });
            slices.enter().append("path").attr("class", "slice").attr("fill", function(d) {
                return colorScale(d.data.key);
            }).attr("d", arc).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(slices).transition().duration(transition.duration).ease(transition.ease).attrTween("d", arcTween);
            slices.exit().remove();
            // Labels
            var labels = series.select(".labels").selectAll("text.label").data(function(d) {
                return pie(d.values);
            });
            labels.enter().append("text").attr("class", "label").attr("dy", ".35em").merge(labels).transition().duration(transition.duration).text(function(d) {
                return d.data.key;
            }).attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
                    return "translate(" + pos + ")";
                };
            }).styleTween("text-anchor", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start" : "end";
                };
            });
            labels.exit().remove();
            // Slice to Label Lines
            var lines = series.select(".lines").selectAll("polyline.line").data(function(d) {
                return pie(d.values);
            });
            lines.enter().append("polyline").attr("class", "line").merge(lines).transition().duration(transition.duration).attrTween("points", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * .95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
                    return [ arc.centroid(d2), outerArc.centroid(d2), pos ];
                };
            });
            lines.exit().remove();
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
};

/**
 * Credit Tag
 *
 * @example
 * var creditTag = d3.ez.component.creditTag()
 *     .enabled(true)
 *     .text("d3-ez.net")
 *     .href("http://d3-ez.net");
 * d3.select("svg").call(creditTag);
 */
d3.ez.component.creditTag = function module() {
    // Default Options (Configurable via setters)
    var text = "d3-ez.net";
    var href = "http://d3-ez.net";
    function my(selection) {
        var creditTag = selection.selectAll("#creditTag").data([ 0 ]).enter().append("g").attr("id", "creditTag");
        var creditText = creditTag.append("text").text(text).attr("xlink:href", href).on("click", function() {
            window.open(href);
        });
        // Right Justify Text
        var xPos = 0 - d3.select("#creditTag").selectAll("text").node().getBBox().width;
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
};

/**
 * Labeled Node
 *
 * @example
 * var myNode = d3.ez.component.labeledNode()
 *     .color("#FF0000")
 *     .opacity(0.5)
 *     .stroke(1)
 *     .label("Node Label")
 *     .radius(5);
 * d3.selectAll("g").call(myNode);
 */
d3.ez.component.labeledNode = function module() {
    // Default Options (Configurable via setters)
    var color = "steelblue";
    var opacity = 1;
    var strokeColor = "#000000";
    var strokeWidth = 0;
    var radius = 8;
    var label = null;
    var fontSize = 10;
    function my(d) {
        var r = sizeAccessor(d);
        var node = d3.select(this).attr("class", "node");
        node.append("circle").attr("fill-opacity", opacity).attr("r", r).style("stroke", strokeColor).style("stroke-width", strokeWidth).style("fill", color);
        node.append("text").text(label).attr("dx", r + 2).attr("dy", r + 6).style("text-anchor", "start").style("font-size", fontSize + "px").attr("class", "nodetext");
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
        return typeof radius === "function" ? radius(_) : radius;
    }
    return my;
};

/**
 * Reusable Scatter Plot
 *
 */
d3.ez.component.scatterPlot = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 400;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).attr("fill", function(d) {
                return colorScale(d.key);
            }).attr("width", width).attr("height", height).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            // Add Dots to Group
            var dots = series.selectAll(".dot").data(function(d) {
                return d.values;
            });
            dots.enter().append("circle").attr("class", "dot").attr("r", 3).attr("cx", function(d) {
                return xScale(d.key);
            }).attr("cy", height).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(dots).transition().ease(transition.ease).duration(transition.duration).attr("cx", function(d) {
                return xScale(d.key);
            }).attr("cy", function(d) {
                return yScale(d.value);
            });
            dots.exit().transition().style("opacity", 0).remove();
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
};

/**
 * Legend
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
    var opacity = .7;
    var fill = "#ffffff";
    var stroke = "#000000";
    var strokewidth = "1px";
    var spacing = 5;
    function my(selection) {
        height = height ? height : this.attr("height");
        width = width ? width : this.attr("width");
        // Legend Box
        var legendBox = selection.selectAll("#legendBox").data([ 0 ]).enter().append("g").attr("id", "legendBox");
        legendBox.append("rect").attr("width", width).attr("height", height).attr("fill-opacity", opacity).attr("fill", fill).attr("stroke-width", strokewidth).attr("stroke", stroke);
        legendTitle = legendBox.append("g").attr("transform", "translate(5, 15)");
        legendTitle.append("text").style("font-weight", "bold").text(title);
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
            elementHeight = (height - 45) / numElements;
            sizeKey = legendBox.append("g").attr("transform", "translate(5, 20)");
            for (var index = 0; index < numElements; index++) {
                sizeKey.append("circle").attr("cx", 17).attr("cy", y).attr("fill", "lightgrey").attr("stroke-width", "1px").attr("stroke", "grey").attr("fill-opacity", .8).attr("r", sizeScale.range()[index]);
                text = keyScaleRange("size", index);
                sizeKey.append("text").attr("x", 40).attr("y", y + 5).text(text);
                y = y + (elementHeight + spacing);
            }
        }
        // Colour Key
        if (typeof colorScale !== "undefined") {
            numElements = colorScale.domain().length;
            elementHeight = (height - 45) / numElements - 5;
            colorKey = legendBox.append("g").attr("transform", "translate(5, 20)");
            for (var index = 0; index < numElements; index++) {
                colorKey.append("rect").attr("x", 10).attr("y", y).attr("fill", colorScale.range()[index]).attr("stroke-width", "1px").attr("stroke", "grey").attr("fill-opacity", .8).attr("width", 20).attr("height", elementHeight);
                if (!isNaN(colorScale.domain()[index])) {
                    // If the scale is a threshold scale.
                    text = keyScaleRange("threshold", index);
                } else {
                    text = colorScale.domain()[index];
                }
                colorKey.append("text").attr("x", 40).attr("y", y + 10).text(text);
                y = y + (elementHeight + spacing);
            }
        }
    }
    // Helper function to calculate the keys min and max values
    function keyScaleRange(type, position) {
        switch (type) {
          case "size":
            var domainMin = Math.min.apply(Math, sizeScale.domain());
            var domainMax = Math.max.apply(Math, sizeScale.domain());
            var domainSize = domainMax - domainMin;
            var rangeLength = sizeScale.range().length;
            break;

          case "color":
            var domainMin = Math.min.apply(Math, colorScale.domain());
            var domainMax = Math.max.apply(Math, colorScale.domain());
            var domainSize = domainMax - domainMin;
            var rangeLength = colorScale.range().length;
            break;

          case "threshold":
            min = colorScale.domain()[position];
            max = colorScale.domain()[position + 1];
            rangeStr = isNaN(max) ? "> " + min : min + " - " + max;
            return rangeStr;
            break;
        }
        var rangeIncrement = domainSize / rangeLength;
        var ranges = [];
        var range = [];
        var rangeStart = domainMin;
        var rangeEnd = domainMin + rangeIncrement;
        for (i = 0; i < rangeLength; i++) {
            range = [ rangeStart, rangeEnd ];
            ranges.push(range);
            rangeStart = rangeEnd;
            rangeEnd = rangeStart + rangeIncrement;
        }
        var rangeStr = ranges[position][0].toFixed(0) + " - " + ranges[position][1].toFixed(0);
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

/**
 * Reusable Line Chart
 *
 */
d3.ez.component.lineChart = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 400;
    var transition = {
        ease: d3.easeBounce,
        duration: 1500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        // Line generation function
        var line = d3.line().curve(d3.curveCardinal).x(function(d) {
            return xScale(d.key);
        }).y(function(d) {
            return yScale(d.value);
        });
        // Line animation tween
        var pathTween = function(data) {
            var interpolate = d3.scaleQuantile().domain([ 0, 1 ]).range(d3.range(1, data.length + 1));
            return function(t) {
                return line(data.slice(0, interpolate(t)));
            };
        };
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            });
            series.enter().append("path").attr("class", "series").attr("stroke-width", 1.5).attr("stroke", function(d) {
                return colorScale(d.key);
            }).attr("fill", "none").merge(series).transition().duration(transition.duration).attrTween("d", function(d) {
                return pathTween(d.values);
            });
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
};

/**
 * Reusable Heat Map
 *
 */
d3.ez.component.heatMap = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 100;
    var transition = {
        ease: d3.easeBounce,
        duration: 1e3
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        var cellHeight = yScale.bandwidth();
        var cellWidth = xScale.bandwidth();
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            selection.selectAll(".series").merge(series);
            var cells = series.selectAll(".cell").data(function(d) {
                return d.values;
            });
            cells.enter().append("rect").attr("x", function(d) {
                return xScale(d.key);
            }).attr("y", 0).attr("rx", 2).attr("ry", 2).attr("fill", "black").attr("class", "cell").attr("width", cellWidth).attr("height", cellHeight).on("click", dispatch.customClick).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(cells).transition().duration(transition.duration).attr("fill", function(d) {
                return colorScale(d.value);
            });
            cells.exit().remove();
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
};

/**
 * Reusable Circular Heat Ring
 *
 */
d3.ez.component.heatRing = function module() {
    // Default Options (Configurable via setters)
    var width = 300;
    var height = 300;
    var radius = 150;
    var innerRadius = 20;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        var defaultRadius = Math.min(width, height) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        innerRadius = typeof innerRadius === "undefined" ? defaultRadius / 4 : innerRadius;
        // Pie Generator
        var pie = d3.pie().value(1).sort(null).padAngle(.015);
        // Arc Generator
        var arc = d3.arc().outerRadius(radius).innerRadius(innerRadius).cornerRadius(2);
        selection.each(function() {
            // Create chart group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            var segments = series.selectAll(".segment").data(function(d) {
                var key = d.key;
                var data = pie(d.values);
                data.forEach(function(d, i) {
                    data[i].key = key;
                });
                return data;
            });
            // Ring Segments
            segments.enter().append("path").attr("d", arc).attr("fill", function(d) {
                return colorScale(d.data.value);
            }).classed("segment", true).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d.data);
            });
            segments.exit().remove();
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
};

/**
 * Reusable Punch Card Row
 *
 */
d3.ez.component.punchCard = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 100;
    var sizeScale;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        var cellHeight = yScale.bandwidth();
        var cellWidth = xScale.bandwidth();
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").attr("transform", function(d) {
                return "translate(0, " + cellHeight / 2 + ")";
            }).classed("series", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            var spots = series.selectAll(".punchSpot").data(function(d) {
                return d.values;
            });
            spots.enter().append("circle").attr("class", "punchSpot").attr("cx", function(d) {
                return cellWidth / 2 + xScale(d.key);
            }).attr("cy", 0).attr("r", 0).on("click", dispatch.customClick).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(spots).transition().duration(transition.duration).attr("fill", function(d) {
                return colorScale(d.value);
            }).attr("r", function(d) {
                return sizeScale(d["value"]);
            });
            spots.exit().remove();
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
};

/**
 * Reusable Number Row
 *
 */
d3.ez.component.numberCard = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 100;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colorScale;
    var xScale;
    var yScale;
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        // var cellHeight = yScale.bandwidth();
        var cellWidth = xScale.bandwidth();
        selection.each(function() {
            // Create series group
            var series = selection.selectAll(".series").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("series", true).attr("width", width).attr("height", height).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            series = selection.selectAll(".series").merge(series);
            var numbers = series.selectAll(".number").data(function(d) {
                return d.values;
            });
            numbers.enter().append("text").attr("class", "number").attr("x", function(d) {
                return xScale(d.key) + cellWidth / 2;
            }).attr("y", 0).attr("text-anchor", "middle").attr("dominant-baseline", "central").text(function(d) {
                return d["value"];
            }).on("click", dispatch.customClick).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            }).merge(numbers).transition().duration(1e3).attr("fill", function(d) {
                return colorScale(d.value);
            });
            numbers.exit().remove();
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
};

/**
 * Title
 *
 * @example
 * var myTitle = d3.ez.component.title()
 *     .enabled(true)
 *     .mainText("Hello World")
 *     .subText("This is a test");
 * d3.select("svg").call(myTitle);
 */
d3.ez.component.title = function module() {
    // Default Options (Configurable via setters)
    var mainText = "Title";
    var subText = "Sub Title";
    var height = 40;
    var width = 200;
    function my(selection) {
        selection.selectAll("#titleGroup").data([ 0 ]).enter().append("g").attr("id", "titleGroup");
        var titleGroup = selection.select("#titleGroup");
        titleGroup.selectAll(".title").data([ mainText ]).enter().append("text").classed("title", true).text(function(d) {
            return d;
        });
        var title = titleGroup.select(".title").text(mainText);
        titleGroup.selectAll(".subTitle").data([ subText ]).enter().append("text").classed("subTitle", true).text(function(d) {
            return d;
        });
        var subTitle = titleGroup.select(".subTitle").text(subText);
        // Centre Text
        var titleOffset = 1 - title.node().getBBox().width / 2;
        var subTitleOffset = 1 - subTitle.node().getComputedTextLength() / 2;
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
};

/**
 * Reusable Circular Axis
 *
 */
d3.ez.component.circularAxis = function module() {
    // Default Options (Configurable via setters)
    var width = 300;
    var height = 300;
    var radius = 150;
    var xScale;
    var yScale;
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    function my(selection) {
        selection.each(function() {
            var defaultRadius = Math.min(width, height) / 2;
            radius = typeof radius === "undefined" ? defaultRadius : radius;
            yScale2 = d3.scaleLinear().domain(yScale.domain().reverse()).range(yScale.range().reverse());
            // Create chart group
            var axis = selection.selectAll(".axis").data([ 0 ]).enter().append("g").classed("axis", true).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            axis.append("g").attr("class", "outerCircle");
            axis.append("g").attr("class", "tickCircles");
            axis.append("g").attr("class", "spokes");
            axis = selection.selectAll(".axis").merge(axis);
            // Tick circles
            var tickCircles = axis.select(".tickCircles").selectAll("circle").data(yScale.ticks());
            tickCircles.enter().append("circle").style("fill", "none").merge(tickCircles).transition().attr("r", function(d) {
                return yScale(d);
            });
            tickCircles.exit().remove();
            // Outer circle
            var outerCircle = axis.select(".outerCircle").selectAll("circle").data([ radius ]).enter().append("circle").attr("r", function(d) {
                return d;
            }).style("fill", "none");
            // Spokes
            var spokes = axis.select(".spokes").selectAll("line").data(xScale.domain()).enter().append("line").attr("y2", -radius).attr("transform", function(d, i, j) {
                numBars = j.length;
                return "rotate(" + i * 360 / numBars + ")";
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
    return my;
};

/**
 * Reusable Circular Labels
 *
 */
d3.ez.component.circularLabels = function module() {
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var radius;
    var capitalizeLabels = false;
    function my(selection) {
        selection.each(function(data) {
            var defaultRadius = Math.min(width, height) / 2;
            radius = typeof radius === "undefined" ? defaultRadius : radius;
            var labels = selection.selectAll(".circularLabels").data(function(d) {
                return [ d ];
            }).enter().append("g").classed("circularLabels", true);
            labels = selection.selectAll(".circularLabels").merge(labels);
            // Labels
            labels.selectAll("def").data([ radius ]).enter().append("def").append("path").attr("id", "label-path").attr("d", function(d) {
                return "m0 " + -d + " a" + d + " " + d + " 0 1,1 -0.01 0";
            });
            labels.selectAll("text").data(function(d) {
                return d;
            }).enter().append("text").style("text-anchor", "middle").append("textPath").attr("xlink:href", "#label-path").attr("startOffset", function(d, i, j) {
                numBars = j.length;
                return i * 100 / numBars + 50 / numBars + "%";
            }).text(function(d) {
                return capitalizeLabels ? d.toUpperCase() : d;
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
    my.colorScale = function(_) {
        if (!arguments.length) return colorScale;
        colorScale = _;
        return my;
    };
    my.yScale = function(_) {
        if (!arguments.length) return yScale;
        yScale = _;
        return my;
    };
    return my;
};

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
d3.ez.component.htmlTable = function module() {
    // HTML Table Element (Populated by 'my' function)
    var tableEl;
    // Default Options (Configurable via setters)
    var classed = "htmlTable";
    var width = 800;
    // Data Options (Populated by 'init' function)
    var rowNames = [];
    var columnNames = [];
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
                tableEl = d3.select(this).append("table").classed("d3ez", true).classed(classed, true).attr("width", width);
            } else {
                tableEl.selectAll("*").remove();
            }
            var head = tableEl.append("thead");
            var foot = tableEl.append("tfoot");
            var body = tableEl.append("tbody");
            // Add table headings
            hdr = head.append("tr");
            hdr.selectAll("th").data(function() {
                // Tack on a blank cell at the beginning,
                // this is for the top of the first column.
                return [ "" ].concat(columnNames);
            }).enter().append("th").html(function(d) {
                return d;
            });
            // Add table body
            rows = body.selectAll("tr").data(data).enter().append("tr").attr("class", function(d) {
                return d.key;
            }).on("click", function(d) {
                dispatch.call("customClick", this, d);
            });
            // Add the first column of headings (categories)
            rows.append("th").html(function(d) {
                return d.key;
            });
            // Add the main data values
            rows.selectAll("td").data(function(d) {
                return d.values;
            }).enter().append("td").attr("class", function(d) {
                return d.key;
            }).html(function(d) {
                return d.value;
            }).on("mouseover", function(d) {
                dispatch.call("customMouseOver", this, d);
            });
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
};

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
d3.ez.component.htmlList = function module() {
    // HTML List Element (Populated by 'my' function)
    var listEl;
    // Default Options (Configurable via setters)
    var classed = "htmlList";
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function my(selection) {
        selection.each(function(data) {
            // Create HTML List 'ul' element (if it does not exist already)
            if (!listEl) {
                listEl = d3.select(this).append("ul").classed("d3ez", true).classed(classed, true);
            } else {
                listEl.selectAll("*").remove();
            }
            listEl.selectAll("li").data(data).enter().append("li").text(function(d) {
                return d.key;
            }).on("click", expand);
            function expand(d) {
                d3.event.stopPropagation();
                dispatch.call("customMouseOver", this, d);
                if (typeof d.values === "undefined") {
                    return 0;
                }
                var ul = d3.select(this).on("click", collapse).append("ul");
                var li = ul.selectAll("li").data(d.values).enter().append("li").text(function(d) {
                    if (typeof d.value !== "undefined") {
                        return d.key + " : " + d.value;
                    } else {
                        return d.key;
                    }
                }).on("click", expand);
            }
            function collapse() {
                d3.event.stopPropagation();
                d3.select(this).on("click", expand).selectAll("*").remove();
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
};

/**
 * Clustered Bar Chart (also called: Multi-set Bar Chart; Grouped Bar Chart)
 *
 * @see http://datavizproject.com/data-type/grouped-bar-chart/
 */
d3.ez.chart.barClustered = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartBar";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
            colorScale = d3.scaleOrdinal().range(colors).domain(categoryNames);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(groupNames).rangeRound([ 0, chartW ]).padding(.1);
        yScale = d3.scaleLinear().range([ chartH, 0 ]).domain([ 0, maxValue ]);
        xScale2 = d3.scaleBand().domain(categoryNames).rangeRound([ 0, xScale.bandwidth() ]).padding(.1);
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
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true).append("text").attr("transform", "rotate(-90)").attr("y", -35).attr("dy", ".71em").style("text-anchor", "end").text(yAxisLabel);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".x-axis").attr("transform", "translate(0," + chartH + ")").call(xAxis);
            chart.select(".y-axis").call(yAxis);
            var barChart = d3.ez.component.barGrouped().width(xScale.bandwidth()).height(chartH).colorScale(colorScale).xScale(xScale2).yScale(yScale).dispatch(dispatch);
            // Create bar group
            var seriesGroup = chart.selectAll(".seriesGroup").data(data);
            seriesGroup.enter().append("g").classed("seriesGroup", true).attr("transform", function(d) {
                return "translate(" + xScale(d.key) + ", 0)";
            }).datum(function(d) {
                return d;
            }).call(barChart);
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
};

/**
 * Stacked Bar Chart
 *
 * @see http://datavizproject.com/data-type/stacked-bar-chart/
 */
d3.ez.chart.barStacked = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartBar";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
            colorScale = d3.scaleOrdinal().range(colors).domain(categoryNames);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(groupNames).rangeRound([ 0, chartW ]).padding(.1);
        yScale = d3.scaleLinear().range([ chartH, 0 ]).domain([ 0, groupTotalsMax ]);
        xScale2 = d3.scaleBand().domain(categoryNames).rangeRound([ 0, xScale.bandwidth() ]).padding(.1);
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
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true).append("text").attr("transform", "rotate(-90)").attr("y", -35).attr("dy", ".71em").style("text-anchor", "end").text(yAxisLabel);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".x-axis").attr("transform", "translate(0," + chartH + ")").call(xAxis);
            chart.select(".y-axis").call(yAxis);
            var barChart = d3.ez.component.barStacked().width(xScale.bandwidth()).height(chartH).colorScale(colorScale).xScale(xScale).yScale(yScale).dispatch(dispatch);
            // Create bar group
            var seriesGroup = chart.selectAll(".seriesGroup").data(data);
            seriesGroup.enter().append("g").classed("seriesGroup", true).attr("transform", function(d) {
                return "translate(" + xScale(d.key) + ", 0)";
            }).datum(function(d) {
                return d;
            }).call(barChart);
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
};

/**
 * Bar Chart (vertical) (also called: Bar Chart; Bar Graph)
 *
 * @see http://datavizproject.com/data-type/bar-chart/
 */
d3.ez.chart.barVertical = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartBar";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
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
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    // Other Customisation Options
    var yAxisLabel;
    function init(data) {
        chartW = width - (margin.left + margin.right);
        chartH = height - (margin.top + margin.bottom);
        // Slice Data, calculate totals, max etc.
        var slicedData = d3.ez.dataParse(data);
        categoryNames = slicedData.categoryNames;
        maxValue = slicedData.maxValue;
        yAxisLabel = slicedData.groupName;
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleOrdinal().range(colors).domain(categoryNames);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(categoryNames).rangeRound([ 0, chartW ]).padding(.15);
        yScale = d3.scaleLinear().domain([ 0, maxValue ]).range([ chartH, 0 ]);
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
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("xAxis axis", true);
                chart.append("g").classed("yAxis axis", true);
                chart.append("g").classed("barChart", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".xAxis").attr("transform", "translate(0," + chartH + ")").call(xAxis);
            chart.select(".yAxis").call(yAxis);
            // Add labels to chart
            ylabel = chart.select(".yAxis").selectAll(".y-label").data([ data.key ]);
            ylabel.enter().append("text").classed("y-label", true).attr("transform", "rotate(-90)").attr("y", -40).attr("dy", ".71em").attr("fill", "#000000").style("text-anchor", "end").merge(ylabel).transition().text(function(d) {
                return d;
            });
            // Add bars to the chart
            var barChart = d3.ez.component.barGrouped().width(chartW).height(chartH).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            chart.select(".barChart").datum(data).call(barChart);
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
};

/**
 * Donut Chart (also called: Doughnut Chart; Pie Chart)
 *
 * @see http://datavizproject.com/data-type/donut-chart/
 */
d3.ez.chart.donutChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartDonut";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: d3.easeCubic,
        duration: 750
    };
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function init(data) {
        chartW = width - (margin.left + margin.right);
        chartH = height - (margin.top + margin.bottom);
        var defaultRadius = Math.min(chartW, chartH) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        innerRadius = typeof innerRadius === "undefined" ? defaultRadius / 2 : innerRadius;
        // Slice Data, calculate totals, max etc.
        var slicedData = d3.ez.dataParse(data);
        categoryNames = slicedData.categoryNames;
        // Colour Scale
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleOrdinal().range(colors).domain(categoryNames);
        }
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH);
            // Add the chart
            var donutChart = d3.ez.component.donut().radius(radius).innerRadius(innerRadius).colorScale(colorScale).dispatch(dispatch);
            chart.datum(data).call(donutChart);
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
};

/**
 * Circular Heat Map (also called: Radial Heat Map)
 *
 * @see http://datavizproject.com/data-type/radial-heatmap/
 */
d3.ez.chart.heatMapRadial = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartHeatMapRadial";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colors = [ d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65) ];
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
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    function init(data) {
        chartW = width - (margin.left + margin.right);
        chartH = height - (margin.top + margin.bottom);
        var defaultRadius = Math.min(chartW, chartH) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        innerRadius = typeof innerRadius === "undefined" ? defaultRadius / 4 : innerRadius;
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
            colorScale = d3.scaleThreshold().range(colors).domain(thresholds);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(categoryNames).rangeRound([ 0, chartW ]).padding(.1);
        yScale = d3.scaleBand().domain(groupNames).rangeRound([ radius, innerRadius ]).padding(.1);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create chart element (if it does not exist already)
            if (!svg) {
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("circleRings", true);
                chart.append("g").classed("circleLabels", true);
                chart.append("g").classed("axis", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH);
            var heatRing = d3.ez.component.heatRing().radius(function(d) {
                return yScale(d.key);
            }).innerRadius(function(d) {
                return yScale(d.key) + yScale.bandwidth();
            }).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            var seriesGroup = chart.select(".circleRings").selectAll(".seriesGroup").data(function(d) {
                return d;
            }).enter().append("g").attr("class", "seriesGroup");
            seriesGroup.datum(function(d) {
                return d;
            }).call(heatRing);
            seriesGroup.exit().remove();
            // Circular Labels
            var circularLabels = d3.ez.component.circularLabels().radius(radius * 1.04);
            chart.select(".circleLabels").datum(categoryNames).call(circularLabels);
            // Y Axis
            var yAxis = d3.axisLeft(yScale.domain(groupNames.reverse()));
            chart.select(".axis").attr("transform", "translate(0," + -(chartH / 2 + innerRadius) + ")").call(yAxis);
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
};

/**
 * Heat Map (also called: Heat Table; Density Table; Heat Map)
 *
 * @see http://datavizproject.com/data-type/heat-map/
 */
d3.ez.chart.heatMapTable = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartHeatMapTable";
    var width = 400;
    var height = 300;
    var margin = {
        top: 45,
        right: 20,
        bottom: 20,
        left: 45
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colors = [ d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65) ];
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
            var thresholds = slicedData.thresholds;
        }
        // Colour Scale
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleThreshold().domain(thresholds).range(colors);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(categoryNames).range([ 0, chartW ]).padding(.1);
        yScale = d3.scaleBand().domain(groupNames).range([ 0, chartH ]).padding(.1);
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
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".x-axis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");
            chart.select(".y-axis").call(yAxis);
            var heatMap = d3.ez.component.heatMap().width(chartW).height(chartH).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            var seriesGroup = chart.selectAll(".seriesGroup").data(function(d) {
                return d;
            }).enter().append("g").attr("class", "seriesGroup").attr("transform", function(d) {
                return "translate(0, " + yScale(d.key) + ")";
            });
            seriesGroup.datum(function(d) {
                return d;
            }).call(heatMap);
            seriesGroup.exit().remove();
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
};

/**
 * Line Chart (also called: Line Graph; Spline Chart)
 *
  @see http://datavizproject.com/data-type/line-chart/
 */
d3.ez.chart.lineChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartLine";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 40
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
                data[i].values[j].key = new Date(b.key * 1e3);
            });
        });
        dateDomain = d3.extent(data[0].values, function(d) {
            return d.key;
        });
        // Colour Scale
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleOrdinal().range(colors).domain(groupNames);
        }
        // X & Y Scales
        xScale = d3.scaleTime().range([ 0, chartW ]).domain(dateDomain);
        yScale = d3.scaleLinear().range([ chartH, 0 ]).domain([ 0, maxValue * 1.05 ]);
        // X & Y Axis
        xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%y"));
        yAxis = d3.axisLeft(yScale);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true).append("text").attr("transform", "rotate(-90)").attr("y", -35).attr("dy", ".71em").style("text-anchor", "end").text(yAxisLabel);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".x-axis").attr("transform", "translate(0," + chartH + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
            chart.select(".y-axis").call(yAxis);
            var lineChart = d3.ez.component.lineChart().width(chartW).height(chartH).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            var scatterPlot = d3.ez.component.scatterPlot().width(chartW).height(chartH).colorScale(colorScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            var lineGroup = chart.selectAll(".lineGroup").data(function(d) {
                return d;
            }).enter().append("g").attr("class", "lineGroup").style("fill", function(d) {
                return colorScale(d.key);
            });
            lineGroup.datum(function(d) {
                return d;
            }).call(lineChart).call(scatterPlot);
            lineGroup.exit().remove();
            var dotGroup = chart.selectAll(".dotGroup").data(function(d) {
                return d;
            }).enter().append("g").attr("class", "dotGroup").style("fill", function(d) {
                return colorScale(d.key);
            });
            dotGroup.datum(function(d) {
                return d;
            }).call(scatterPlot);
            dotGroup.exit().remove();
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
};

/**
 * Polar Area Chart (also called: Coxcomb Chart; Rose Chart; Polar Area Chart)
 *
 * @see http://datavizproject.com/data-type/polar-area-chart/
 */
d3.ez.chart.polarArea = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartPolarArea";
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
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
    var categoryNames = [];
    var maxValue = 0;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
    // Other Customisation Options
    var capitalizeLabels = false;
    var colorLabels = false;
    function init(data) {
        chartW = width - (margin.left + margin.right);
        chartH = height - (margin.top + margin.bottom);
        var defaultRadius = Math.min(chartW, chartH) / 2;
        radius = typeof radius === "undefined" ? defaultRadius : radius;
        innerRadius = typeof innerRadius === "undefined" ? defaultRadius / 4 : innerRadius;
        // Slice Data, calculate totals, max etc.
        var slicedData = d3.ez.dataParse(data);
        categoryNames = slicedData.categoryNames;
        maxValue = slicedData.maxValue;
        // Colour Scale
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleOrdinal().range(colors).domain(categoryNames);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(categoryNames).rangeRound([ 0, chartW ]).padding(.15);
        yScale = d3.scaleLinear().domain([ 0, maxValue ]).range([ 0, radius ]);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG element (if it does not exist already)
            if (!svg) {
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("circularAxis", true);
                chart.append("g").classed("barRadial", true);
                chart.append("g").classed("verticalAxis axis", true);
                chart.append("g").classed("circularLabels", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("width", chartW).attr("height", chartH);
            // Circular Axis
            var circularAxis = d3.ez.component.circularAxis().xScale(xScale).yScale(yScale).width(chartW).height(chartH).radius(radius);
            chart.select(".circularAxis").call(circularAxis);
            // Radial Bar Chart
            var barRadial = d3.ez.component.barRadial().radius(radius).yScale(yScale).colorScale(colorScale).dispatch(dispatch);
            chart.select(".barRadial").datum(data).call(barRadial);
            // Vertical Axis
            var verticalAxis = d3.axisLeft(yScale.domain([ maxValue, 0 ]));
            chart.select(".verticalAxis").attr("transform", "translate(0," + -(chartH / 2) + ")").call(verticalAxis);
            // Circular Labels
            var circularLabels = d3.ez.component.circularLabels().radius(radius * 1.04);
            chart.select(".circularLabels").datum(categoryNames).call(circularLabels);
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
};

/**
 * Punch Card
 *
 * @see http://datavizproject.com/data-type/proportional-area-chart-circle/
 */
d3.ez.chart.punchCard = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var classed = "chartPunchCard";
    var width = 400;
    var height = 300;
    var margin = {
        top: 45,
        right: 20,
        bottom: 20,
        left: 45
    };
    var transition = {
        ease: d3.easeBounce,
        duration: 500
    };
    var colors = [ d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker() ];
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
    var dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");
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
        valDomain = [ minValue, maxValue ];
        sizeDomain = useGlobalScale ? valDomain : [ 0, d3.max(data[1]["values"], function(d) {
            return d["value"];
        }) ];
        // Colour Scale
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scaleLinear().domain(valDomain).range(colors);
        }
        // X & Y Scales
        xScale = d3.scaleBand().domain(categoryNames).range([ 0, chartW ]).padding(.05);
        yScale = d3.scaleBand().domain(groupNames).range([ 0, chartH ]).padding(.05);
        // X & Y Axis
        xAxis = d3.axisTop(xScale);
        yAxis = d3.axisLeft(yScale);
        // Size Scale
        sizeScale = d3.scaleLinear().domain(sizeDomain).range([ minRadius, maxRadius ]);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection._groups[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr("width", width).attr("height", height);
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("width", chartW).attr("height", chartH);
            // Add axis to chart
            chart.select(".x-axis").call(xAxis).selectAll("text").attr("y", 0).attr("x", -8).attr("transform", "rotate(60)").style("text-anchor", "end");
            chart.select(".y-axis").call(yAxis);
            var punchCard = d3.ez.component.punchCard().width(chartW).height(chartH).colorScale(colorScale).sizeScale(sizeScale).yScale(yScale).xScale(xScale).dispatch(dispatch);
            var seriesGroup = chart.selectAll(".seriesGroup").data(function(d) {
                return d;
            }).enter().append("g").attr("class", "seriesGroup").attr("transform", function(d) {
                return "translate(0, " + yScale(d.key) + ")";
            });
            seriesGroup.datum(function(d) {
                return d;
            }).call(punchCard);
            seriesGroup.exit().remove();
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
};
