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
    // SVG container (Populated by 'my' function)
    var svg;

    // Default Options (Configurable via setters)
    var width              = 400;
    var height             = 300;
    var margin             = {top: 20, right: 120, bottom: 20, left: 20};
    var transition         = {ease: "bounce", duration: 500};
    var classed            = "punchCard";
    var color              = "steelblue";
    var sizeScale          = undefined;
    var sizeDomain         = [];
    var maxRadius          = 18;
    var minRadius          = 2;
    var formatTick         = d3.format("0000");
    var useGlobalScale     = true;

    // Data Options (Populated by 'init' function)
    var chartW             = 0;
    var chartH             = 0;

    // Dispatch (Custom events)
    var dispatch           = d3.dispatch("customHover");

    function init(data) {
        chartW = width - margin.left - margin.right;
        chartH = height - margin.top - margin.bottom;
    }

    function mouseover(d) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display", "none");
        d3.select(g).selectAll("text.value").style("display", "block");
        dispatch.customHover(d);
    }

    function mouseout(d) {
        var g = d3.select(this).node().parentNode;
        d3.select(g).selectAll("circle").style("display","block");
        d3.select(g).selectAll("text.value").style("display","none");
    }

    function my(selection) {
        selection.each(function(data) {
            // If it is a single object, wrap it in an array
            if (data.constructor !== Array) data = [data];

            // Initialise Data
            init(data);

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

            data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
              categoryNames[i] = d.key;
            });

            var rowHeight = chartH / rowCount;
            // var rowHeight = (maxRadius * 2) + 2;
            var valDomain = d3.extent(allValues, function(d) { return d['value']; });

            // X (& Y) Scales
            var xScale = d3.scale.ordinal()
                .domain(categoryNames)
                .rangeRoundBands([0, chartW], 1);

            // X (& Y) Axis
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(data[0].values.length);

            // Colour Scale
            var colorScale = d3.scale.linear()
                .domain(d3.extent(allValues, function(d) {return d['value'];}))
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

            // Create chart element (if it does not exist already)
            if (!chart) {
                var chart = selection.append("g").classed("chart", true);
                chart.append("g").classed("x-axis axis", true);
            }
            chart = selection.select(".chart");
            chart.classed(classed, true);

            // Update the outer dimensions
            chart.attr({width: width, height: height})
              .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

            // Add X (& Y) axis to the chart
            chart.select(".x-axis")
                .attr({transform: "translate(0," + chartH + ")"})
                .call(xAxis);

            for (var j = 0; j < data.length; j++) {
                sizeDomain = useGlobalScale ? valDomain : [0, d3.max(data[j]['values'], function(d) { return d['value']; })];
                sizeScale = d3.scale.linear()
                    .domain(sizeDomain)
                    .range([minRadius, maxRadius]);

                var g = chart.append("g");

                var circles = g.selectAll("circle")
                    .data(data[j]['values'])
                    .enter()
                    .append("circle")
                    .attr("cy", (chartH - rowHeight * 2) - (j * rowHeight) + rowHeight)
                    .attr("cx", function(d, i) { return xScale(d['key']); })
                    .attr("r", function(d) { return sizeScale(d['value']); })
                    .style("fill", function(d) { return colorScale(d['value']) });

                var text = g.selectAll("text")
                    .data(data[j]['values'])
                    .enter()
                    .append("text")
                    .attr("y", (chartH - rowHeight * 2) - (j * rowHeight) + (rowHeight + 5))
                    .attr("x", function(d, i) { return xScale(d['key']) - 5; })
                    .attr("class", "value")
                    .text(function(d) { return d['value']; })
                    .style("fill", function(d) { return colorScale(d['value']) })
                    .style("display", "none");

                g.append("text")
                    .attr("y", (chartH - rowHeight * 2) - ( j * rowHeight) + (rowHeight + 5))
                    .attr("x", chartW + rowHeight)
                    .attr("class", "label")
                    .text(data[j]['key'])
                    .style("text-anchor", "end")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout);
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

    my.minRadius = function(_) {
        if (!arguments.length) return minRadius;
        minRadius = _;
        return this;
    };

    my.maxRadius = function(_) {
        if (!arguments.length) return maxRadius;
        maxRadius = _;
        rowHeight = (maxRadius*2)+2;
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
