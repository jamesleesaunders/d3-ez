// D3.EZ Test File
// Use before Makefile

include('../src/header.js');
include('../src/chart.js');
include('../src/component.js');
include('../src/colors.js');
include('../src/chart/discreteBar.js');
include('../src/chart/groupedBar.js');
include('../src/chart/radialBar.js');
include('../src/chart/circularHeat.js');
include('../src/chart/tabularHeat.js');
include('../src/chart/donut.js');
include('../src/chart/punchcard.js');
include('../src/chart/multiSeriesLine.js');
include('../src/html/table.js');
include('../src/html/list.js');

function include(file) {
  var loc = document.currentScript.src;
  var path = loc.substring(0, loc.lastIndexOf("/") + 1);
  var src = path + file;
  var type = 'text/javascript';

  document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}
