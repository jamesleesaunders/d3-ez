/**
 * D3.EZ
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2017 James Saunders
 * @license GPLv3
 */
d3.ez = {
    version: "1.6.3",
    author: "James Saunders",
    copyright: "Copyright (C) 2017 James Saunders",
    license: "GPL-3.0"
};

/**
 * Chart Base
 *
 * @example
 * @todo
 */
d3.ez.base = function module() {
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
    var creditTag = d3.ez.creditTag();
    var description = "";
    var yAxisLabel = "";
    // Colours
    var colorScale = undefined;
    // Dispatch (custom events)
    var dispatch = d3.dispatch("customHover", "customMouseOver", "customMouseOut", "customClick");
    function init(data) {
        canvasW = width - (margin.left + margin.right);
        canvasH = height - (margin.top + margin.bottom);
        // Init Data
        if (!data[0]) {
            // TODO: Can this be done better?
            // If 1 dimensional data
            categories = d3.values(data)[1];
        } else {
            // If 2 dimensional data
            categories = data.map(function(d) {
                return d.values;
            })[0];
        }
        categoryNames = categories.map(function(d) {
            return d.key;
        });
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
        creditTag.text("d3ez.org").href("http://d3ez.org");
    }
    function my(selection) {
        selection.each(function(data) {
            init(data);
            // Create SVG element (if it does not exist already)
            if (!svg) {
                svg = d3.select(this).append("svg").classed(classed, true).attr({
                    width: width,
                    height: height
                });
                canvas = svg.append("g").classed("canvas", true);
                canvas.append("g").classed("chartbox", true);
                canvas.append("g").classed("legendbox", true);
                canvas.append("g").classed("titlebox", true);
                canvas.append("g").classed("creditbox", true);
            } else {
                canvas = svg.select(".canvas");
            }
            // Update the canvas dimensions
            canvas.attr({
                width: canvasW,
                height: canvasH
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            // Add Chart
            canvas.select(".chartbox").datum(data).attr({
                transform: "translate(" + 0 + "," + chartTop + ")"
            }).call(chart);
            // Add Legend
            if (legend && (typeof chart.colorScale === "function" || typeof chart.sizeScale === "function")) {
                if (typeof chart.colorScale === "function") {
                    legend.colorScale(chart.colorScale());
                }
                if (typeof chart.sizeScale === "function") {
                    legend.sizeScale(chart.sizeScale());
                }
                canvas.select(".legendbox").attr({
                    transform: "translate(" + (canvasW - legend.width()) + "," + title.height() + ")"
                }).call(legend);
            }
            // Add Title
            if (title) {
                canvas.select(".titlebox").attr({
                    transform: "translate(" + width / 2 + "," + 0 + ")"
                }).call(title);
            }
            // Add Credit Tag
            canvas.select(".creditbox").attr({
                transform: "translate(" + (width - 20) + "," + (height - 20) + ")"
            }).call(creditTag);
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
            console.log(_);
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Discrete Bar Chart
 *
 * @example
 * var myChart = d3.ez.discreteBarChart()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .colors(d3.scale.category10().range());
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.discreteBarChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "discreteBarChart";
    var colors = d3.ez.colors.categorical(4);
    var gap = 0;
    // Data Options (Populated by 'init' function)
    var chartW = 0;
    var chartH = 0;
    var maxValue = 0;
    var categoryNames = [];
    var xScale = undefined;
    var yScale = undefined;
    var yAxisLabel = undefined;
    var xAxis = undefined;
    var yAxis = undefined;
    var colorScale = undefined;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        chartW = width - (margin.left + margin.right);
        chartH = height - (margin.top + margin.bottom);
        yAxisLabel = d3.values(data)[0];
        maxValue = d3.max(data.values, function(d) {
            return d.value;
        });
        categoryNames = d3.values(data)[1].map(function(d) {
            return d.key;
        });
        // X & Y Scales
        xScale = d3.scale.ordinal().domain(categoryNames).rangeRoundBands([ 0, chartW ], .1);
        yScale = d3.scale.linear().domain([ 0, maxValue ]).range([ chartH, 0 ]);
        // X & Y Axis
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
        yAxis = d3.svg.axis().scale(yScale).orient("left");
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scale.ordinal().range(colors).domain(categoryNames);
        }
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: chartW,
                height: chartH
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            // Add axis to chart
            chart.select(".x-axis").attr({
                transform: "translate(0," + chartH + ")"
            }).call(xAxis);
            chart.select(".y-axis").call(yAxis);
            // Add labels to chart
            ylabel = chart.select(".y-axis").selectAll(".y-label").data([ data.key ]);
            ylabel.enter().append("text").classed("y-label", true).attr("transform", "rotate(-90)").attr("y", -35).attr("dy", ".71em").style("text-anchor", "end");
            ylabel.transition().text(function(d) {
                return d;
            });
            // Add bars to the chart
            var gapSize = xScale.rangeBand() / 100 * gap;
            var barW = xScale.rangeBand() - gapSize;
            var bars = chart.selectAll(".bar").data(data.values);
            bars.enter().append("rect").attr("class", function(d) {
                return d.key + " bar";
            }).attr("fill", function(d) {
                return colorScale(d.key);
            }).attr({
                width: barW,
                x: function(d, i) {
                    return xScale(d.key) + gapSize / 2;
                },
                y: chartH,
                height: 0
            }).on("mouseover", dispatch.customHover);
            bars.transition().ease(transition.ease).duration(transition.duration).attr({
                width: barW,
                x: function(d, i) {
                    return xScale(d.key) + gapSize / 2;
                },
                y: function(d, i) {
                    return yScale(d.value);
                },
                height: function(d, i) {
                    return chartH - yScale(d.value);
                }
            });
            bars.exit().transition().style({
                opacity: 0
            }).remove();
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Grouped Bar Chart
 *
 * @example
 * var myChart = d3.ez.groupedBarChart()
 *     .width(400)
 *     .height(300)
 *     .transition({ease: "bounce", duration: 1500})
 *     .groupType("stacked");
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.groupedBarChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "groupedBarChart";
    var colors = d3.ez.colors.categorical(4);
    var gap = 0;
    var yAxisLabel = null;
    var groupType = "clustered";
    // Data Options (Populated by 'init' function)
    var chartW = 0;
    var chartH = 0;
    var groupNames = undefined;
    var categoryNames = [];
    var categoryTotals = [];
    var groupTotals = [];
    var maxValue = 0;
    var maxGroupTotal = undefined;
    var xScale = undefined;
    var yScale = undefined;
    var xAxis = undefined;
    var yAxis = undefined;
    var colorScale = undefined;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
        // Group and Category Names
        groupNames = data.map(function(d) {
            return d.key;
        });
        categoryNames = [];
        data.map(function(d) {
            return d.values;
        })[0].forEach(function(d, i) {
            categoryNames[i] = d.key;
        });
        // Group and Category Totals
        categoryTotals = [];
        groupTotals = [];
        maxValue = 0;
        d3.map(data).values().forEach(function(d) {
            grp = d.key;
            d.values.forEach(function(d) {
                categoryTotals[d.key] = typeof categoryTotals[d.key] === "undefined" ? 0 : categoryTotals[d.key];
                categoryTotals[d.key] += d.value;
                groupTotals[grp] = typeof groupTotals[grp] === "undefined" ? 0 : groupTotals[grp];
                groupTotals[grp] += d.value;
                maxValue = d.value > maxValue ? d.value : maxValue;
            });
        });
        maxGroupTotal = d3.max(d3.values(groupTotals));
        // X & Y Scales
        xScale = d3.scale.ordinal().rangeRoundBands([ 0, chartW ], .1).domain(groupNames);
        yScale = d3.scale.linear().range([ chartH, 0 ]).domain([ 0, groupType == "stacked" ? maxGroupTotal : maxValue ]);
        // X & Y Axis
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
        yAxis = d3.svg.axis().scale(yScale).orient("left");
        // Colour Scale
        colorScale = d3.scale.ordinal().range(colors).domain(categoryNames);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true).append("text").attr("transform", "rotate(-90)").attr("y", -35).attr("dy", ".71em").style("text-anchor", "end").text(yAxisLabel);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            // Add axis to chart
            chart.select(".x-axis").attr({
                transform: "translate(0," + chartH + ")"
            }).call(xAxis);
            chart.select(".y-axis").call(yAxis);
            // Create gar group
            var barGroup = chart.selectAll(".barGroup").data(data);
            barGroup.enter().append("g").attr("class", "barGroup").attr("transform", function(d, i) {
                return "translate(" + xScale(d.key) + ", 0)";
            }).on("mouseover", dispatch.customHover);
            // Add bars to group
            var bars = barGroup.selectAll(".bar").data(function(d) {
                series = [];
                var y0 = 0;
                d3.map(d.values).values().forEach(function(d, i) {
                    series[i] = {
                        name: d.key,
                        value: d.value,
                        y0: y0,
                        y1: y0 + d.value
                    };
                    y0 += d.value;
                });
                return series;
            });
            if (groupType === "stacked") {
                var gapSize = xScale.rangeBand() / 100 * gap;
                var barW = xScale.rangeBand() - gapSize;
                bars.enter().append("rect").classed("bar", true).attr("class", function(d) {
                    return d.name + " bar";
                }).attr({
                    width: barW,
                    x: 0,
                    y: chartH,
                    height: 0
                }).attr("fill", function(d) {
                    return colorScale(d.name);
                });
                bars.transition().ease(transition.ease).duration(transition.duration).attr({
                    width: barW,
                    x: 0,
                    y: function(d) {
                        return yScale(d.y1);
                    },
                    height: function(d) {
                        return yScale(d.y0) - yScale(d.y1);
                    }
                }).attr("fill", function(d) {
                    return colorScale(d.name);
                });
                bars.exit().transition().style({
                    opacity: 0
                }).remove();
            } else if (groupType === "clustered") {
                var x1 = d3.scale.ordinal().rangeRoundBands([ 0, xScale.rangeBand() ]).domain(categoryNames);
                bars.enter().append("rect").classed("bar", true).attr({
                    width: x1.rangeBand(),
                    x: function(d) {
                        return x1(d.name);
                    },
                    y: chartH,
                    height: 0
                }).attr("fill", function(d) {
                    return colorScale(d.name);
                });
                bars.transition().ease(transition.ease).duration(transition.duration).attr({
                    width: x1.rangeBand(),
                    x: function(d) {
                        return x1(d.name);
                    },
                    y: function(d) {
                        return yScale(d.value);
                    },
                    height: function(d) {
                        return chartH - yScale(d.value);
                    }
                }).attr("fill", function(d) {
                    return colorScale(d.name);
                });
                bars.exit().transition().style({
                    opacity: 0
                }).remove();
            }
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
    my.groupType = function(_) {
        if (!arguments.length) return groupType;
        groupType = _;
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Radial Bar Chart
 *
 * @example
 * var myChart = d3.ez.radialBarChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 *
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.radialBarChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "radialBarChart";
    var colors = d3.ez.colors.categorical(4);
    var radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
    var capitalizeLabels = false;
    var colorLabels = false;
    // Data Options (Populated by 'init' function)
    var tickValues = [];
    var tickCircleValues = [];
    var domain = [];
    var numBars = undefined;
    var barScale = undefined;
    var keys = undefined;
    var labelRadius = 0;
    var categoryTotals = [];
    var groupTotals = [];
    var maxValue = 0;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        // Bars
        keys = d3.values(data)[1].map(function(d) {
            return d.key;
        });
        numBars = keys.length;
        // Radius of the key labels
        labelRadius = radius * 1.025;
        // Totals Max, etc
        maxValue = d3.max(data.values, function(d) {
            return d.value;
        });
        // Tick Circle Rings
        tickCircleValues = [];
        for (var i = 0; i <= maxValue; i++) {
            tickCircleValues.push(i);
        }
        // tickCircleValues (don't know the difference really?)
        tickValues = tickCircleValues;
        tickValues.push(maxValue + 1);
        // Domain
        domain = [ 0, maxValue + 1 ];
        // Scale
        barScale = d3.scale.linear().domain(domain).range([ 0, radius ]);
        // Colour Scale
        colorScale = d3.scale.ordinal().range(colors).domain(keys);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG element (if it does not exist already)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("tickCircles", true);
                chart.append("g").classed("segments", true);
                chart.append("g").classed("spokes", true);
                chart.append("g").classed("axis", true);
                chart.append("circle").classed("outerCircle", true);
                chart.append("g").classed("labels", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")"
            });
            // Concentric tick circles
            tickCircles = chart.select(".tickCircles").selectAll("circle").data(tickCircleValues);
            tickCircles.enter().append("circle").style("fill", "none");
            tickCircles.transition().attr("r", function(d) {
                return barScale(d);
            }).ease(transition.ease).duration(transition.duration);
            tickCircles.exit().remove();
            // Arc Generator
            var arc = d3.svg.arc().innerRadius(0).outerRadius(function(d, i) {
                return barScale(d.value);
            }).startAngle(function(d, i) {
                return i * 2 * Math.PI / numBars;
            }).endAngle(function(d, i) {
                return (i + 1) * 2 * Math.PI / numBars;
            });
            // Segment enter/exit/update
            var segments = chart.select(".segments").selectAll("path").data(data.values);
            segments.enter().append("path").style("fill", function(d, i) {
                if (!colors) return;
                return colors[i % colors.length];
            }).classed("segment", true).on("mouseover", dispatch.customHover);
            segments.exit().remove();
            segments.transition().ease(transition.ease).duration(transition.duration).attr("d", arc);
            // Spokes
            var spokes = chart.select(".spokes").selectAll("line").data(keys).enter().append("line").attr("y2", -radius).attr("transform", function(d, i) {
                return "rotate(" + i * 360 / numBars + ")";
            });
            // Axis
            var axisScale = d3.scale.linear().domain(domain).range([ 0, -radius ]);
            var axis = d3.svg.axis().scale(axisScale).orient("right");
            //if(tickValues) axis.tickValues(tickValues);
            axis = chart.select(".axis").call(axis);
            // Outer Circle
            outerCircle = chart.select(".outerCircle").attr("r", radius).style("fill", "none");
            // Labels
            var labels = chart.select(".labels");
            labels.append("def").append("path").attr("id", "label-path").attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
            labels.selectAll("text").data(keys).enter().append("text").style("text-anchor", "middle").style("fill", function(d, i) {
                return colorLabels ? colors[i % colors.length] : null;
            }).append("textPath").attr("xlink:href", "#label-path").attr("startOffset", function(d, i) {
                return i * 100 / numBars + 50 / numBars + "%";
            }).text(function(d) {
                return capitalizeLabels ? d.toUpperCase() : d;
            });
        });
    }
    // Configuration Getters & Setters
    my.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Circular Heat Chart
 *
 * @example
 * var myChart = d3.ez.circularHeatChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 *
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.circularHeatChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "circularHeatChart";
    var colors = [ "white", "orange" ];
    var radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
    var innerRadius = 50;
    // Data Options (Populated by 'init' function)
    var domain = undefined;
    var radialLabels = [];
    var numRadials = 24;
    var segmentLabels = [];
    var numSegments = 24;
    var segmentHeight = 0;
    var maxValue = 0;
    var colorScale = undefined;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        radialLabels = data.map(function(d) {
            return d.key;
        });
        numRadials = radialLabels.length;
        segmentLabels = d3.values(data[0].values).map(function(d) {
            return d.key;
        });
        numSegments = segmentLabels.length;
        segmentHeight = (radius - innerRadius) / numRadials;
        d3.map(data).values().forEach(function(d) {
            d.values.forEach(function(d) {
                maxValue = d.value > maxValue ? d.value : maxValue;
            });
        });
        domain = [ 0, maxValue ];
        colorScale = d3.scale.linear().domain(domain).range(colors);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create chart element (if it does not exist already)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("rings", true);
                chart.append("g").classed("radialLabels", true);
                chart.append("g").classed("segmentLabels", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")"
            });
            // Arc Generator
            var arc = d3.svg.arc().innerRadius(function(d, i) {
                return innerRadius + d.ring * segmentHeight;
            }).outerRadius(function(d, i) {
                return innerRadius + segmentHeight + d.ring * segmentHeight;
            }).startAngle(function(d, i) {
                return i * 2 * Math.PI / numSegments;
            }).endAngle(function(d, i) {
                return (i + 1) * 2 * Math.PI / numSegments;
            });
            // Rings
            chart.select(".rings").selectAll("g").data(data).enter().append("g").classed("ring", true).on("mouseover", dispatch.customHover);
            // Ring Segments
            chart.selectAll(".ring").selectAll("path").data(function(d, i) {
                // Add index (used to calculate ring number)
                for (j = 0; j < numSegments; j++) {
                    d.values[j].ring = i;
                }
                return d.values;
            }).enter().append("path").attr("d", arc).attr("fill", function(d) {
                return colorScale(accessor(d.value));
            }).classed("segment", true);
            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = chart.selectAll(".circularHeat")[0].length;
            // Radial Labels
            var lsa = .01;
            // Label start angle
            var radLabels = chart.select(".radialLabels").classed("labels", true);
            radLabels.selectAll("def").data(radialLabels).enter().append("def").append("path").attr("id", function(d, i) {
                return "radialLabelPath" + id + "-" + i;
            }).attr("d", function(d, i) {
                var r = innerRadius + (i + .2) * segmentHeight;
                return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + " a" + r + " " + r + " 0 1 1 -1 0";
            });
            radLabels.selectAll("text").data(radialLabels).enter().append("text").append("textPath").attr("xlink:href", function(d, i) {
                return "#radialLabelPath" + id + "-" + i;
            }).text(function(d) {
                return d;
            });
            // Segment Labels
            var segmentLabelOffset = 2;
            var r = innerRadius + numRadials * segmentHeight + segmentLabelOffset;
            var segLabels = chart.select(".segmentLabels").classed("labels", true);
            segLabels.append("def").append("path").attr("id", "segmentLabelPath" + id).attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");
            segLabels.selectAll("text").data(segmentLabels).enter().append("text").append("textPath").attr("xlink:href", "#segmentLabelPath" + id).attr("startOffset", function(d, i) {
                return i * 100 / numSegments + "%";
            }).text(function(d) {
                return d;
            });
        });
    }
    var accessor = function(d) {
        return d;
    };
    // Configuration Getters & Setters
    my.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
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
    my.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return this;
    };
    my.dispatch = function(_) {
        if (!arguments.length) return dispatch();
        dispatch = _;
        return this;
    };
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Tabular Heat Chart
 *
 * @example
 * var myChart = d3.ez.tabularHeatChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.tabularHeatChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 600;
    var height = 600;
    var margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "tabularHeatChart";
    var colors = [ d3.rgb(214, 245, 0), d3.rgb(255, 166, 0), d3.rgb(255, 97, 0), d3.rgb(200, 65, 65) ];
    // Data Options (Populated by 'init' function)
    var thresholds = undefined;
    var minValue = 0;
    var maxValue = 0;
    var numCols = 0;
    var numRows = 0;
    var gridSize = 0;
    var colNames = [];
    var rowNames = [];
    var colorScale = undefined;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover", "customMouseOver", "customMouseOut", "customClick");
    function init(data) {
        // Group and Category Names
        colNames = data.map(function(d) {
            return d.key;
        });
        numCols = colNames.length;
        /*
     The following bit of code is a little dirty! Its purpose is to identify the complete list of row names.
     In some cases the first (index 0) set of values may not contain the complete list of key names.
     This typically this happens in 'matrix' (site A to site B) type scenario, for example where no data
     would exist where both site A is the same as site B.
     The code therefore takes the list of keys from the first (index 0) set of values and then concatenates
     it with the last (index max) set of values, finally removing duplicates.
     */
        var a = [];
        var b = [];
        data.map(function(d) {
            return d.values;
        })[0].forEach(function(d, i) {
            a[i] = d.key;
        });
        data.map(function(d) {
            return d.values;
        })[numCols - 1].forEach(function(d, i) {
            b[i] = d.key;
        });
        rowNames = b.concat(a.filter(function(element) {
            return b.indexOf(element) < 0;
        }));
        numRows = rowNames.length;
        gridSize = Math.floor((d3.min([ width, height ]) - (margin.left + margin.right)) / d3.max([ numCols, numRows ]));
        // Calculate the Max Value
        var values = [];
        d3.map(data).values().forEach(function(d) {
            d.values.forEach(function(d) {
                values.push(d.value);
            });
        });
        // If thresholds values are not already set attempt to auto-calculate some thresholds
        if (!thresholds) {
            minValue = d3.min(values);
            maxValue = d3.max(values);
            thresholds = [ Math.floor(maxValue * .25), Math.floor(maxValue * .5), Math.floor(maxValue * .75), Math.floor(maxValue + 1) ];
        }
        // Colour Scale
        colorScale = d3.scale.threshold().domain(thresholds).range(colors);
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
                chart.append("g").classed("y-axis axis", true);
                chart.append("g").classed("cards", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            var deck = chart.select(".cards").selectAll(".deck").data(data);
            deck.enter().append("g").attr("class", "deck").attr("transform", function(d, i) {
                return "translate(0, " + colNames.indexOf(d.key) * gridSize + ")";
            });
            deck.transition().attr("class", "deck");
            var cards = deck.selectAll(".card").data(function(d) {
                // Map row, column and value to new data array
                var ret = [];
                d3.map(d.values).values().forEach(function(v, i) {
                    ret[i] = {
                        row: d.key,
                        column: v.key,
                        value: v.value
                    };
                });
                return ret;
            });
            cards.enter().append("rect").attr("x", function(d) {
                return rowNames.indexOf(d.column) * gridSize;
            }).attr("y", 0).attr("rx", 5).attr("ry", 5).attr("class", "card").attr("width", gridSize).attr("height", gridSize).on("click", dispatch.customClick).on("mouseover", dispatch.customMouseOver).on("mouseout", dispatch.customMouseOut);
            cards.transition().duration(1e3).style("fill", function(d) {
                return colorScale(d.value);
            });
            cards.select("title").text(function(d) {
                return d.value;
            });
            cards.exit().remove();
            var colLabels = chart.select(".x-axis").selectAll(".colLabel").data(colNames).enter().append("text").text(function(d) {
                return d;
            }).attr("x", 0).attr("y", function(d, i) {
                return i * gridSize;
            }).style("text-anchor", "end").attr("transform", "translate(-6," + gridSize / 2 + ")").attr("class", function(d, i) {
                return i >= 0 && i <= 4 ? "colLabel mono axis axis-workweek" : "colLabel mono axis";
            });
            var rowLabels = chart.select(".y-axis").selectAll(".rowLabel").data(rowNames).enter().append("g").attr("transform", function(d, i) {
                return "translate(" + (i * gridSize + gridSize / 2) + ", -6)";
            }).append("text").text(function(d) {
                return d;
            }).style("text-anchor", "start").attr("class", function(d, i) {
                return i >= 7 && i <= 16 ? "rowLabel mono axis axis-worktime" : "rowLabel mono axis";
            }).attr("transform", function(d) {
                return "rotate(-90)";
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
    my.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return this;
    };
    my.dispatch = function(_) {
        if (!arguments.length) return dispatch();
        dispatch = _;
        return this;
    };
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Donut Chart
 *
 * @example
 * var myChart = d3.ez.donutChart()
 *     .width(400)
 *     .height(300)
 *     .radius(200)
 *     .innerRadius(50);
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.donutChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: "cubic",
        duration: 300
    };
    var classed = "donutChart";
    var colors = d3.ez.colors.categorical(4);
    var radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
    var innerRadius = 70;
    // Data Options (Populated by 'init' function)
    var values = [];
    var categoryNames = [];
    var colorScale = undefined;
    var pie = undefined;
    var arc = undefined;
    var outerArc = undefined;
    var key = undefined;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        values = d3.values(data)[1].map(function(d) {
            return d.value;
        });
        categoryNames = d3.values(data)[1].map(function(d) {
            return d.key;
        });
        pie = d3.layout.pie().sort(null);
        arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius);
        outerArc = d3.svg.arc().innerRadius(radius * .9).outerRadius(radius * .9);
        if (!colorScale) {
            // If the colorScale has not already been passed
            // then attempt to calculate.
            colorScale = d3.scale.ordinal().range(colors).domain(categoryNames);
        }
    }
    function key(d, i) {
        return data.values[i].key;
    }
    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }
    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").attr("class", "slices");
                chart.append("g").attr("class", "labels");
                chart.append("g").attr("class", "lines");
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + (width - margin.right + margin.left) / 2 + "," + (height - margin.bottom + margin.top) / 2 + ")"
            });
            // Slices
            var slices = chart.select(".slices").selectAll("path.slice").data(pie(values));
            slices.enter().append("path").attr("class", "slice").attr("fill", function(d, i) {
                return colorScale(data.values[i].key);
            }).attr("d", arc).each(function(d) {
                this._current = d;
            }).on("mouseover", dispatch.customHover);
            slices.transition().ease(transition.ease).duration(transition.duration).attrTween("d", arcTween);
            slices.exit().remove();
            // Labels
            var labels = chart.select(".labels").selectAll("text.label").data(pie(values), key);
            labels.enter().append("text").attr("class", "label").attr("dy", ".35em");
            labels.transition().duration(transition.duration).text(function(d, i) {
                return data.values[i].key;
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
            var lines = chart.select(".lines").selectAll("polyline.line").data(pie(values));
            lines.enter().append("polyline").attr("class", "line");
            lines.transition().duration(transition.duration).attrTween("points", function(d) {
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
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
        return this;
    };
    my.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        radius = d3.min([ width - (margin.right + margin.left), height - (margin.top + margin.bottom) ]) / 2;
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Punchcard
 *
 * @example
 * var myChart = d3.ez.punchCard()
 *     .width(600)
 *     .height(350)
 *     .color("green")
 *     .minRadius(5)
 *     .maxRadius(19)
 *     .useGlobalScale(true);
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 */
d3.ez.punchCard = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 40,
        right: 80,
        bottom: 20,
        left: 20
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "punchCard";
    var color = "steelblue";
    var sizeScale = undefined;
    var sizeDomain = [];
    var maxRadius = 18;
    var minRadius = 2;
    var formatTick = d3.format("0000");
    var useGlobalScale = true;
    // Data Options (Populated by 'init' function)
    var chartW = 0;
    var chartH = 0;
    // Data Options (Populated by 'init' function)
    var xAxis = undefined;
    var xScale = undefined;
    var colorScale = undefined;
    var valDomain;
    var rowHeight;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
        // Cut the data in different ways....
        var allValues = [];
        var rowCount = 0;
        data.forEach(function(d) {
            allValues = allValues.concat(d.values);
            rowCount++;
        });
        //var categoryNames = d3.extent(allValues, function(d) { return d['key']; });
        var categoryNames = [];
        var categoryTotals = [];
        var maxValue = 0;
        data.map(function(d) {
            return d.values;
        })[0].forEach(function(d, i) {
            categoryNames[i] = d.key;
        });
        rowHeight = chartH / rowCount;
        // var rowHeight = (maxRadius * 2) + 2;
        valDomain = d3.extent(allValues, function(d) {
            return d["value"];
        });
        // X (& Y) Scales
        xScale = d3.scale.ordinal().domain(categoryNames).rangeRoundBands([ 0, chartW ], 1);
        // X (& Y) Axis
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(data[0].values.length);
        // Colour Scale
        colorScale = d3.scale.linear().domain(d3.extent(allValues, function(d) {
            return d["value"];
        })).range([ d3.rgb(color).brighter(), d3.rgb(color).darker() ]);
    }
    function my(selection) {
        selection.each(function(data) {
            // If it is a single object, wrap it in an array
            if (data.constructor !== Array) data = [ data ];
            // Initialise Data
            init(data);
            // Create SVG and Chart containers (if they do not already exist)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                chart = svg.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
            } else {
                chart = selection.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: width,
                height: height
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            // Add axis to chart
            chart.select(".x-axis").attr({
                transform: "translate(0," + chartH + ")"
            }).call(xAxis);
            for (var j = 0; j < data.length; j++) {
                sizeDomain = useGlobalScale ? valDomain : [ 0, d3.max(data[j]["values"], function(d) {
                    return d["value"];
                }) ];
                sizeScale = d3.scale.linear().domain(sizeDomain).range([ minRadius, maxRadius ]);
                var g = chart.append("g");
                var circles = g.selectAll("circle").data(data[j]["values"]).enter().append("circle").attr("cy", chartH - rowHeight * 2 - j * rowHeight + rowHeight).attr("cx", function(d, i) {
                    return xScale(d["key"]);
                }).attr("r", function(d) {
                    return sizeScale(d["value"]);
                }).attr("class", "punchSpot").style("fill", function(d) {
                    return colorScale(d["value"]);
                });
                var text = g.selectAll("text").data(data[j]["values"]).enter().append("text").attr("y", chartH - rowHeight * 2 - j * rowHeight + rowHeight).attr("x", function(d, i) {
                    return xScale(d["key"]);
                }).attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("class", "punchValue").text(function(d) {
                    return d["value"];
                }).style("fill", function(d) {
                    return colorScale(d["value"]);
                }).style("display", "none");
                g.append("text").attr("y", chartH - rowHeight * 2 - j * rowHeight + rowHeight).attr("x", chartW).attr("text-anchor", "start").attr("dominant-baseline", "start").attr("class", "label").text(data[j]["key"]).on("mouseover", mouseover).on("mouseout", mouseout);
            }
        });
    }
    function mouseover(d) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display", "none");
        d3.select(g).selectAll("text.punchValue").style("display", "block");
        dispatch.customHover(d);
    }
    function mouseout(d) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display", "block");
        d3.select(g).selectAll("text.punchValue").style("display", "none");
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
        rowHeight = maxRadius * 2 + 2;
        return this;
    };
    my.color = function(_) {
        if (!arguments.length) return color;
        color = _;
        return this;
    };
    my.sizeScale = function(_) {
        if (!arguments.length) return sizeScale;
        sizeScale = _;
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Time Series Chart
 *
 * @example
 * var formatDate = d3.time.format("%b %Y");
 * var myChart = d3.ez.timeSeriesChart()
 * 	.x(function(d) { return formatDate.parse(d.date); })
 * 	.y(function(d) { return +d.price; })
 * 	.width(600)
 * 	.height(350);
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.timeSeriesChart = function module() {
    // SVG and Chart containers (Populated by 'my' function)
    var svg;
    var chart;
    // Default Options (Configurable via setters)
    var width = 400;
    var height = 300;
    var margin = {
        top: 50,
        right: 40,
        bottom: 50,
        left: 40
    };
    var transition = {
        ease: "bounce",
        duration: 500
    };
    var classed = "timeSeriesChart";
    var color = "steelblue";
    var xValue = function(d) {
        return d[0];
    };
    var yValue = function(d) {
        return d[1];
    };
    // Data Options (Populated by 'init' function)
    var chartW = 0;
    var chartH = 0;
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
    function init(data) {
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
    }
    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            init(data);
            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function(d, i) {
                return [ xValue.call(data, d, i), yValue.call(data, d, i) ];
            });
            // X & Y Scales
            var xScale = d3.time.scale().domain(d3.extent(data, function(d) {
                return d[0];
            })).range([ 0, chartW ]);
            var yScale = d3.scale.linear().domain([ 0, d3.max(data, function(d) {
                return d[1];
            }) ]).range([ chartH, 0 ]);
            // X & Y Axis
            var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
            var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 6);
            // Setup the Line and Area
            var area = d3.svg.area().x(function(d) {
                return xScale(d[0]);
            }).y1(function(d) {
                return yScale(d[1]);
            });
            var line = d3.svg.line().x(function(d) {
                return xScale(d[0]);
            }).y(function(d) {
                return yScale(d[1]);
            });
            // Create SVG element (if it does not exist already)
            if (!svg) {
                svg = function(selection) {
                    var el = selection[0][0];
                    if (!!el.ownerSVGElement || el.tagName === "svg") {
                        return selection;
                    } else {
                        return selection.append("svg");
                    }
                }(d3.select(this));
                svg.classed("d3ez", true).attr({
                    width: width,
                    height: height
                });
                var chart = svg.append("g").classed("chart", true);
                chart.append("path").classed("chart-area-path", true);
                chart.append("path").classed("chart-line-path", true);
                chart.append("g").classed("x-axis-group axis", true);
                chart.append("g").classed("y-axis-group axis", true);
            } else {
                chart = svg.select(".chart");
            }
            // Update the chart dimensions
            chart.classed(classed, true).attr({
                width: chartW,
                height: chartH
            }).attr({
                transform: "translate(" + margin.left + "," + margin.top + ")"
            });
            // Add axis to chart
            chart.select(".x-axis-group.axis").attr({
                transform: "translate(0," + yScale.range()[0] + ")"
            }).call(xAxis);
            chart.select(".y-axis-group.axis").call(yAxis);
            // Update the area path
            chart.select(".chart-area-path").data([ data ]).attr("d", area.y0(yScale.range()[0])).attr("fill", color);
            // Update the line path
            chart.select(".chart-line-path").data([ data ]).attr("d", line).attr("fill", "none");
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
    my.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return this;
    };
    my.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return this;
    };
    my.color = function(_) {
        if (!arguments.length) return color;
        color = _;
        return this;
    };
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Simple HTML Table
 *
 * @example
 * var myTable = d3.ez.htmlTable()
 *     .classed("myClass")
 *     .width("600");
 * d3.select("#tableholder")
 *     .datum(data)
 *     .call(myTable);
 */
d3.ez.htmlTable = function module() {
    // HTML Table Element (Populated by 'my' function)
    var tableEl;
    // Default Options (Configurable via setters)
    var classed = "htmlTable";
    var width = 800;
    // Data Options (Populated by 'init' function)
    var rowNames = undefined;
    var columnNames = [];
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
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
            }).on("mouseover", dispatch.customHover);
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
    d3.rebind(my, dispatch, "on");
    return my;
};

/**
 * Simple HTML List
 *
 * @example
 * var myList = d3.ez.htmlList()
 *      .classed("myClass");
 * d3.select("#listholder")
 *     .datum(data)
 *     .call(myList);
 */
d3.ez.htmlList = function module() {
    // HTML List Element (Populated by 'my' function)
    var listEl;
    // Default Options (Configurable via setters)
    var classed = "htmlList";
    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");
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
                dispatch.customHover(d);
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
            function collapse(d) {
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
    d3.rebind(my, dispatch, "on");
    return my;
};

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
        var titleGroup = this.selectAll("#titleGroup").data([ 0 ]).enter().append("g").attr("id", "titleGroup");
        var title = titleGroup.append("text").text(mainText).classed("title", true);
        var subTitle = titleGroup.append("text").text(subText).classed("subTitle", true);
        // Centre Text
        var titleOffset = 1 - d3.select("#titleGroup").selectAll(".title").node().getBBox().width / 2;
        var subTitleOffset = 1 - d3.select("#titleGroup").selectAll(".subTitle").node().getComputedTextLength() / 2;
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
        var creditTag = this.selectAll("#creditTag").data([ 0 ]).enter().append("g").attr("id", "creditTag");
        var creditText = creditTag.append("text").text(text).attr({
            "xlink:href": href
        }).on("click", function() {
            window.open(href);
        });
        // Right Justify Text
        var xPos = 0 - d3.select("#creditTag").selectAll("text").node().getBBox().width;
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
    var opacity = .7;
    var fill = "#ffffff";
    var stroke = "#000000";
    var strokewidth = "1px";
    var spacing = 5;
    function my() {
        height = height ? height : this.attr("height");
        width = width ? width : this.attr("width");
        // Legend Box
        var legendBox = this.selectAll("#legendBox").data([ 0 ]).enter().append("g").attr("id", "legendBox");
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
            max = colorScale.domain()[position + 1] - 1;
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
