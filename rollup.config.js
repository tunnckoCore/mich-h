'use strict'

const buble = require('rollup-plugin-buble')
const zopfli = require('rollup-plugin-zopfli')
const uglify = require('rollup-plugin-uglify')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

let config = {
  entry: 'src/index.js'
}

if (process.env.BROWSER) {
  config = Object.assign(config, {
    dest: 'dist/mich-h.min.js',
    format: 'umd',
    moduleName: 'michH',
    useStrict: false,
    sourceMap: true,
    plugins: [
      resolve(),
      commonjs(),
      buble({
        target: {
          ie: '11',
          edge: '12',
          safari: '8',
          chrome: '48',
          firefox: '44'
        }
      }),
      uglify({ compress: { warnings: false } }),
      zopfli({ options: { numiterations: 1000 } })
    ]
  })
} else {
  config = Object.assign(config, {
    plugins: [
      buble({
        target: { node: '4' }
      })
    ],
    external: ['mich-parse-selector'],
    targets: [
      { dest: 'dist/mich-h.common.js', format: 'cjs' },
      { dest: 'dist/mich-h.es.js', format: 'es' }
    ]
  })
}

module.exports = config
