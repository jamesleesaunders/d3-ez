# d3-ez Makefile

CSS_FILES :=       css/global.css \
                   css/htmlList.css \
                   css/htmlTable.css \
                   css/barChart.css \
                   css/bubbleChart.css \
                   css/candleSticks.css \
                   css/donutChart.css \
                   css/heatMapRadial.css \
                   css/heatMapTable.css \
                   css/lineChart.css \
                   css/polarAreaChart.css \
                   css/punchCard.css \
                   css/roseChart.css

GENERATED_FILES := build/d3-ez.js \
                   build/d3-ez.min.js \
                   build/d3-ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip docs
.PHONY: js css min zip docs

js:
	@echo Compiling JS Files...
	@rm -f build/d3-ez.js
	@./node_modules/rollup/bin/rollup -c config/rollup.config.js

css: $(CSS_FILES)
	@echo Concatenating CSS Files...
	@rm -f build/d3-ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > build/d3-ez.css

min:
	@echo Minifying...
	@rm -f build/d3-ez.min.js
	@./node_modules/uglify-es/bin/uglifyjs build/d3-ez.js > build/d3-ez.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f build/d3-ez.zip
	@zip -qj build/d3-ez.zip $^

docs:
	@echo Generating Docs...
	@rm -rf docs
	@node ./node_modules/jsdoc/jsdoc.js -c config/jsdoc.conf.json
