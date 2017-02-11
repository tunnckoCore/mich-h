/*!
 * mich-h <https://github.com/tunnckoCore/mich-h>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var parseSelector = require('mich-parse-selector')

module.exports = function michH (selector, properties, children) {
  var component = typeof selector === 'function'
  var node = component ? parseSelector() : parseSelector(selector)

  var args = [].slice.call(arguments, 1)

  function item (arg) {
    if (Array.isArray(arg)) {
      arg.forEach(function (val) {
        addChild(node.children, val)
      })
    } else if (arg && typeof arg === 'object' && !('type' in arg)) {
      for (var prop in arg) {
        addProperty(node.properties, prop, arg[prop])
      }
    } else {
      addChild(node.children, arg)
    }
  }

  while (args.length) {
    item(args.shift())
  }

  if (component) {
    node.properties.children = node.children
    return selector(node.properties, node.children)
  }

  return node
}

function addChild (nodes, children) {
  var type = typeof children
  if (type === 'string' || type === 'number') {
    children = {
      type: 'text',
      value: String(children)
    }
  }
  nodes.push(children)
}

function addProperty (props, key, value) {
  if (key === 'style' && value && typeof value === 'object') {
    for (var prop in value) {
      (props.style || {})[prop] = value[prop]
    }
  }
  if (key === 'className') {
    value = typeof value === 'string' ? value.split(' ') : value
    props[key] = (props[key] || []).concat(value)
  } else {
    props[key] = value
  }
}
