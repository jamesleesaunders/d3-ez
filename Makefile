# D3.EZ Makefile

JS_FILES :=        src/header.js \
                   src/chart.js \
									 src/vega.js \
                   src/colors.js \
                   src/component/barGrouped.js \
                   src/component/barStacked.js \
                   src/component/creditTag.js \
                   src/component/labeledNode.js \
                   src/component/legend.js \
                   src/component/lineChart.js \
                   src/component/title.js \
									 src/component/htmlTable.js \
									 src/component/htmlList.js \
                   src/chart/discreteBar.js \
                   src/chart/groupedBar.js \
                   src/chart/radialBar.js \
                   src/chart/circularHeat.js \
                   src/chart/tabularHeat.js \
                   src/chart/donut.js \
                   src/chart/punchcard.js \
                   src/chart/multiSeriesLine.js


CSS_FILES :=       css/global.css \
                   css/chart/groupedBar.css \
                   css/chart/radialBar.css \
                   css/chart/circularHeat.css \
                   css/chart/tabularHeat.css \
                   css/chart/donut.css \
                   css/chart/punchcard.css \
                   css/chart/multiSeriesLine.css \
                   css/html/list.css \
                   css/html/table.css

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
