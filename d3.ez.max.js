function include(file)
{
    // Add new script tag to head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var path = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);
    
    script.type = 'text/javascript';
    script.src = 'scripts/d3.ez/' + file;
    head.appendChild(script);
}

include('js/header.js');
include('js/radialBarChart.js');
include('js/circularHeatChart.js');
include('js/discreteBarChart.js');
include('js/groupedBarChart.js');
include('js/punchCard.js');
include('js/timeSeriesChart.js');
include('js/donutChart.js');
include('js/htmlTable.js');
include('js/htmlList.js');
include('js/reusableComponents.js');