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
    // SVG container (Populated by 'my' function)
    var svg;
    // Default Options (Configurable via setters)
    var width = 600;
    var height = 600;
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var transition = {ease: "bounce", duration: 500};
    var classed = "tabularHeatChart";
    var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

    // Data Options (Populated by 'init' function)
    var domain = null;
    var maxValue = 0;
    var numberCols = 0;
    var numRows = 0;
    var gridSize = 0;
    var legendElementWidth = gridSize * 2;
    var colNames = ["asfd", "brig", "popl",	"winn"];
    var rowNames = ["Apples", "Oranges", "Pears", "Bananas"];

    // Dispatch (Custom events)
    var dispatch = d3.dispatch("customHover");

    function init(data) {

        numCols = colNames.length;
        numRows = rowNames.length;
        gridSize = Math.floor((width - (margin.left + margin.right)) / numCols);

        d3.map(data).values().forEach(function(d) {
            d.values.forEach(function(d) {
                maxValue = d.value > maxValue ? d.value : maxValue;
            });
        });
        domain = [ 0, maxValue ];

        colorScale = d3.scale.quantile()
            .domain(domain)
            .range(colors);
    }

    function my(selection) {
        selection.each(function(data) {
            // Initialise Data
            console.log(data);
            init(data);

            // Create SVG element (if it does not exist already)
            if (!svg) {
                svg = d3.select(this).append("svg").classed("d3ez", true).classed(classed, true);
                var container = svg.append("g").classed("container", true);
                container.append("g").classed("rings", true);
                container.append("g").classed("radialLabels", true);
                container.append("g").classed("segmentLabels", true);
            }

            // Update the outer dimensions
            svg.transition().attr({width: width, height: height});

            // Update the inner dimensions
            svg.select(".container").attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

            var colLabels = container.selectAll(".colLabel")
                .data(colNames)
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 2 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "controllerLabel mono axis axis-workweek" : "controllerLabel mono axis"); });

            var rowLabels = container.selectAll(".rowLabel")
                .data(rowNames)
                .enter()
                .append("g")
                .attr("transform", function(d, i) {
                    return "translate(" +  ((i * gridSize) + (gridSize / 2)) + ", -6)";
                })
                .append("text")
                .text(function(d) { return d; })
                .style("text-anchor", "start")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "responderLabel mono axis axis-worktime" : "responderLabel mono axis"); })
                .attr("transform", function(d) {
                    return "rotate(-90)"
                });


            var cards = container.selectAll(".hour")
                .data(data, function(d) {return colNames.indexOf(d.key) + ':' + rowNames.indexOf(d.key);});

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function(d) { return (colNames.indexOf(d.key)) * gridSize; })
                .attr("y", function(d) { console.log(d.values[colNames.indexOf(d.key)].key); return (rowNames.indexOf(d.values[colNames.indexOf(d.key)].key)) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

            cards.select("title").text(function(d) { return d.value; });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

            legend.exit().remove();


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
    my.colors = function(_) {
        if (!arguments.length) return colors;
        colors = _;
        return this;
    };
    my.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return this;
    };
    my.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return this;
    };
    d3.rebind(my, dispatch, "on");
    return my;
};