import json from 'rollup-plugin-json';

var banner = "/** \n\
 * d3-ez \n\
 * \n\
 * @author James Saunders [james@saunders-family.net] \n\
 * @copyright Copyright (C) 2018 James Saunders \n\
 * @license GPLv3 \n\
 */\n";

export default {
  input: 'index.js',
  output: {
    file: 'build/d3-ez.js',
    format: 'umd',
    extend: true,
    name: 'd3',
    banner: banner,
    strict: true,
    globals: {
      'd3': 'd3'
    }
  },
  external: ['d3'],
  plugins: [
  json({
      exclude: ['node_modules/**']
    })
]
};
