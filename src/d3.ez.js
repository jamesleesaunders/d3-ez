// D3.EZ Test File
// Use before Makefile

include('js/header.js');
include('js/chart.js');
include('js/component.js');
include('js/colors.js');
include('js/chart/discreteBar.js');
include('js/chart/groupedBar.js');
include('js/chart/radialBar.js');
include('js/chart/circularHeat.js');
include('js/chart/tabularHeat.js');
include('js/chart/donut.js');
include('js/chart/punchCard.js');
include('js/chart/multiSeriesLine.js');
include('js/html/table.js');
include('js/html/list.js');

function include(file) {
  var loc = document.currentScript.src;
  var path = loc.substring(0, loc.lastIndexOf("/") + 1);
  var src = path + file;
  var type = 'text/javascript';

  document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}
