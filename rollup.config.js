import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

let banner = "/**\n\
 * d3-ez\n\
 *\n\
 * @author James Saunders [james@saunders-family.net]\n\
 * @copyright Copyright (C) 2018 James Saunders\n\
 * @license GPLv2\n\
 */\n";

export default {
  input: "index.js",
  output: {
    file: "build/d3-ez.js",
    format: "umd",
    extend: true,
    name: "d3.ez",
    banner: banner,
    strict: true,
    globals: { d3: "d3" }
  },
  external: ["d3"],
  plugins: [
    babel({
      exclude: ["node_modules/**", "*.json"],
      babelrc: false,
      presets: [["env", { modules: false }]],
      plugins: [
         "external-helpers",
         "transform-object-assign"
      ]
    }),
    json({
      exclude: ["node_modules/**"]
    })
  ]
};
