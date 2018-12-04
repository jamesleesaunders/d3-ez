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

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	base: base,
	chart: chart,
	component: component,
	palette: palette,
	dataTransform: dataTransform
};
