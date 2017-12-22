# D3.EZ Makefile

JS_FILES :=        src/header.js \
                   src/baseFunctions.js \
                   src/chart.js \
                   src/vega.js \
                   src/colors.js \
                   src/component/barGrouped.js \
                   src/component/barStacked.js \
                   src/component/barRadial.js \
                   src/component/donut.js \
                   src/component/creditTag.js \
                   src/component/labeledNode.js \
                   src/component/legend.js \
                   src/component/lineChart.js \
                   src/component/heatMap.js \
                   src/component/heatCircle.js \
                   src/component/punchCard.js \
                   src/component/numberCard.js \
                   src/component/title.js \
                   src/component/circularAxis.js \
                   src/component/circularLabels.js \
                   src/component/htmlTable.js \
                   src/component/htmlList.js \
                   src/chart/discreteBar.js \
                   src/chart/groupedBar.js \
                   src/chart/radialBar.js \
                   src/chart/circularHeat.js \
                   src/chart/tabularHeat.js \
                   src/chart/donut.js \
                   src/chart/punchCard.js \
                   src/chart/multiSeriesLine.js

CSS_FILES :=       css/global.css \
                   css/barGrouped.css \
                   css/radialBar.css \
                   css/circularHeat.css \
                   css/tabularHeat.css \
                   css/donut.css \
                   css/punchCard.css \
                   css/lineChart.css \
                   css/htmlList.css \
                   css/htmlTable.css

GENERATED_FILES := build/d3-ez.js \
                   build/d3-ez.min.js \
                   build/d3-ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js: $(JS_FILES)
	@echo Concatinating JS Files...
	@rm -f build/d3-ez.js
	@uglifyjs $^ --beautify indent_level=4 --comments all > build/d3-ez.js

css: $(CSS_FILES)
	@echo Concatinating CSS Files...
	@rm -f build/d3-ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > build/d3-ez.css

min:
	@echo Minifying...
	@rm -f build/d3-ez.min.js
	@uglifyjs build/d3-ez.js > build/d3-ez.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-ez.zip
	@zip -q build/d3-ez.zip $^
