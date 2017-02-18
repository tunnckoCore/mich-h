/*!
 * mich-h <https://github.com/tunnckoCore/mich-h>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

import parseSelector from 'mich-parse-selector'

export default function michH (selector) {
  var isComponent = typeof selector === 'function'
  var node = isComponent ? parseSelector() : parseSelector(selector)
  var args = [].slice.call(arguments, 1)

  function item (arg) {
    if (arg) {
      if (arg.map) {
        while (arg.length) {
          addChild(node.children, arg.shift())
        }
      } else if (typeof arg === 'object' && !isNode(arg)) {
        for (var prop in arg) {
          addProperty(node.properties, prop, arg[prop])
        }
      } else {
        addChild(node.children, arg)
      }
    }
  }

  while (args.length) {
    item(args.shift())
  }

  if (isComponent) {
    return selector(node.properties, node.children)
  }

  return node
}

function isNode (val) {
  return val.tagName &&
    val.properties &&
    typeof val.properties === 'object' &&
    Array.isArray(val.children) &&
    val.type === 'element'
}

function addChild (nodes, children) {
  var type = typeof children
  if (type === 'string' || type === 'number') {
    children = {
      type: 'text',
      value: children + ''
    }
  }
  nodes.push(children)
}

function addProperty (props, key, value) {
  if (key === 'style' && value && typeof value === 'object') {
    props.style = props.style || {}
    for (var k in value) {
      props.style[k] = value[k]
    }
  }

  if (key === 'className') {
    value = typeof value === 'string' ? value.split(' ') : value
    props[key] = (props[key] || []).concat(value)
  } else if (key.slice(0, 5) === 'data-') {
    props.dataset = props.dataset || {}
    props.dataset[key.slice(5)] = value
  } else {
    props[key] = value
  }
}
