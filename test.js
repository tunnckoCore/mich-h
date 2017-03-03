/*!
 * mich-h <https://github.com/tunnckoCore/mich-h>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

const test = require('mukla')
const h = require('./dist/mich-h.common.js')

test('mich-h', (done) => {
  h()
  done()
})

var ast = h('div#page.foo.bar.qux', { className: 'ok fool' },
  h('#header', // if tag name is not given, defaults to `div`
    h('h1.classy', null, { style: 'background-color: #333; color: purple' })),
  h('nav#menu', { style: { 'background': '#2f2', 'font-size': '12px' } },
    h('ul', [
      h('li', 'one', { dataset: { foo: 'bar', set: 'ok' } }),
      h('li.sec', 'two', { className: ['huh'] }),
      h('li', 'three')
    ])),
  h('h2#title', 'content title', { style: {'background-color': 'red'} }),
  h('p.first', // classes of that `p` would be `first, foobie`
    { className: 'foobie' },
    "so it's just like a templating engine,\n",
    'but easy to use inline with javascript\n',
    { onclick: () => {} }
  ),
  h('.foo', {
    'data-abc': 'hello',
    'data-bar': 'world'
  }),
  h('p',
    { className: 'lastParagraph' },
    'the intention is for this to be used to create\n',
    h('strong', 'charlike', {
      className: ['bold'],
      style: 'background: white; color: green'
    }),
    ' reusable, interactive html widgets. '))

console.log(ast)

/**
 * Example Components
 */

var Foo = function (props) {
  return h('user', { name: props.name }, props.children.map(function (child) {
    child.properties.last = props.last
    return child
  }))
}
var foo = h(Foo, {
  name: 'Charlike',
  last: 'Reagent'
}, h('strong', { visible: true }, 'hello'))

console.log(foo)
