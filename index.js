/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const date = new Date();
const copyright = "Copyright (C) " + date.getFullYear() + " " + author;
import { version, license } from "./package.json";

import base from "./src/base";
import chart from "./src/chart";
import component from "./src/component";
import palette from "./src/palette";
import dataTransform from "./src/dataTransform";

const ez = function() {
	const my = base;
	my.version = version;
	my.author = author;
	my.copyright = copyright;
	my.license = license;
	my.chart = chart;
	my.component = component;
	my.palette = palette;
	my.dataTransform = dataTransform;

	// TODO: Remove when new 'ez' base fully tested.
	my.base = base;

	return my;
}();

export default ez;
