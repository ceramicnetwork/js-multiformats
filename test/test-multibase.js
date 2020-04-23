/* globals describe, it */
'use strict'
const { Buffer } = require('buffer')
const assert = require('assert')
const same = assert.deepStrictEqual
const multiformat = require('../')
const test = it

const testThrow = (fn, message) => {
  try {
    fn()
  } catch (e) {
    if (e.message !== message) throw e
    return
  }
  throw new Error('Test failed to throw')
}

const encode = buffer => buffer.toString('base64')
const decode = string => Buffer.from(string, 'base64')

describe('multibase', () => {
  const { multibase } = multiformat()
  multibase.add([{ prefix: 'm', name: 'base64', encode, decode }])
  test('encode/decode base64', () => {
    const string = multibase.encode(Buffer.from('test'), 'base64')
    same(string[0], 'm')
    const buffer = multibase.decode(string)
    same(buffer, Buffer.from('test'))
  })
  test('get fails', () => {
    let msg = 'Missing multibase implementation for "f"'
    testThrow(() => multibase.get('f'), msg)
    msg = 'Missing multibase implementation for "notfound"'
    testThrow(() => multibase.get('notfound'), msg)
  })
  test('encode string failure', () => {
    const msg = 'Can only multibase encode buffer instances'
    testThrow(() => multibase.encode('asdf'), msg)
  })
  test('decode int failure', () => {
    const msg = 'Can only multibase decode strings'
    testThrow(() => multibase.decode(1), msg)
  })
})