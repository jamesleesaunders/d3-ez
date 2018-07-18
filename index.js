/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

let author = "James Saunders";
let date = new Date();
let copyright = "Copyright (C) " + date.getFullYear() + " " + author;
import { version, license } from "./package.json";

import { default as base } from "./src/base";
import { default as chart } from "./src/chart";
import { default as component } from "./src/component";
import { default as palette } from "./src/palette";
import { default as dataTransform } from "./src/dataTransform";

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
