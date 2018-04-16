/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */

import { version } from "./package.json";

import { default as dataParse } from "./src/dataParse";
import { default as palette } from "./src/palette";
import { default as base } from "./src/base";
import { default as component } from "./src/component";
import { default as chart } from "./src/chart";

let my = {
  version: version,
  author: "James Saunders",
  copyright: "Copyright (C) 2018 James Saunders",
  license: "GPL-3.0",
  base: base,
  dataParse: dataParse,
  palette: palette,
  component: component,
  chart: chart
};

export { my as ez };
