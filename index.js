/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */

import { default as dataParse } from "./src/dataParse";
import { default as colors } from "./src/colors";
import { default as base } from "./src/base";

// Chart Components
import { default as componentBarsCircular } from "./src/component/barsCircular";
import { default as componentBarsStacked } from "./src/component/barsStacked";
import { default as componentBarsVertical } from "./src/component/barsVertical";
import { default as componentBubbles } from "./src/component/bubbles";
import { default as componentCandleSticks } from "./src/component/candleSticks";
import { default as componentCircularAxis } from "./src/component/circularAxis";
import { default as componentCircularRingLabels } from "./src/component/circularRingLabels";
import { default as componentCircularSectorLabels } from "./src/component/circularSectorLabels";
import { default as componentDonut } from "./src/component/donut";
import { default as componentHeatMapRing } from "./src/component/heatMapRing";
import { default as componentHeatMapRow } from "./src/component/heatMapRow";
import { default as componentHtmlList } from "./src/component/htmlList";
import { default as componentHtmlTable } from "./src/component/htmlTable";
import { default as componentLineChart } from "./src/component/lineChart";
import { default as componentNumberCard } from "./src/component/numberCard";
import { default as componentPolarArea } from "./src/component/polarArea";
import { default as componentProportionalAreaCircles } from "./src/component/proportionalAreaCircles";
import { default as componentScatterPlot } from "./src/component/scatterPlot";

// Other Components
import { default as componentLabeledNode } from "./src/component/labeledNode";
import { default as componentLegend } from "./src/component/legend";
import { default as componentTitle } from "./src/component/title";
import { default as componentCreditTag } from "./src/component/creditTag";

// Charts
import { default as chartBarChartCircular } from "./src/chart/barChartCircular";
import { default as chartBarChartClustered } from "./src/chart/barChartClustered";
import { default as chartBarChartStacked } from "./src/chart/barChartStacked";
import { default as chartBarChartVertical } from "./src/chart/barChartVertical";
import { default as chartBubbleChart } from "./src/chart/bubbleChart";
import { default as chartCandlestickChart } from "./src/chart/candlestickChart";
import { default as chartDonutChart } from "./src/chart/donutChart";
import { default as chartHeatMapRadial } from "./src/chart/heatMapRadial";
import { default as chartHeatMapTable } from "./src/chart/heatMapTable";
import { default as chartLineChart } from "./src/chart/lineChart";
import { default as chartPolarAreaChart } from "./src/chart/polarAreaChart";
import { default as chartPunchCard } from "./src/chart/punchCard";

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

export { my as ez };
