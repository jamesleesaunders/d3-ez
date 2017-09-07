// D3.EZ Test File
// Use before Makefile

include('js/header.js');
include('js/base.js');
include('js/discreteBarChart.js');
include('js/groupedBarChart.js');
include('js/radialBarChart.js');
include('js/circularHeatChart.js');
include('js/tabularHeatChart.js');
include('js/donutChart.js');
include('js/punchCard.js');
include('js/timeSeriesChart.js');
include('js/htmlTable.js');
include('js/htmlList.js');
include('js/reusableComponents.js');

function include(file) {
  var loc = document.currentScript.src;
  var path = loc.substring(0, loc.lastIndexOf("/") + 1);
  var src = path + file;
  var type = 'text/javascript';

  document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}
