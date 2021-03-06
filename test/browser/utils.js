var utils = {}

// whether is browser
utils.isBrowser = function() {
  var isElectron = utils.isElectron()
  var isNW = utils.isNW()
  return !isElectron && !isNW && !(typeof window === 'undefined' || typeof navigator === 'undefined')
}

// whether is Node
utils.isNode = function() {
  return !(typeof process === 'undefined' || !process.platform || !process.versions)
}

// whether is NW.js (Node-webkit)
utils.isNW = function() {
  var isNode = utils.isNode()
  return isNode && !(typeof global === 'undefined' || !process.__node_webkit || !process.versions['node-webkit'])
}

// whether is Electron
utils.isElectron = function() {
  var isNode = utils.isNode()
  return isNode && !(typeof global === 'undefined' || !process.versions.electron)
}

// detect object type
utils.type = function(obj) {
  return Object.prototype.toString.call(obj).split(' ')[1].replace(']', '')
}

// return a number between 'min' and 'max'
utils.rangeNumber = function(num, min, max) {
  return num > max ? max : num < min ? min : num
}

utils.each = function(stack, handler) {
  var len = stack.length

  // Array
  if (len) {
    for (var i = 0; i < len; i++) {
      if (handler.call(stack[i], stack[i], i) === false) {break}
    }
  }
  // Object
  else if (typeof len === 'undefined') {
    for (var name in stack) {
      if (handler.call(stack[name], stack[name], name) === false) {break}
    }
  }
}

// shallow copy
// utils.extend(target, obj1, obj2, ...)
utils.extend = function(target) {
  utils.each(arguments, function(source, index) {
    if (index > 0) {
      utils.each(source, function(value, key) {
        if (typeof value !== 'undefined') {
          target[key] = value
        }
      })
    }
  })
}

// setter
utils.setter = function(target, name, value) {
  var nameType = utils.type(name)

  // setter(name, value)
  if (nameType === 'String') {
    if (typeof target[name] === 'undefined') {
      throw new Error('Invalid configuration name.')
    }

    if (typeof value === 'undefined') {
      throw new Error('Lack of a value corresponding to the name')
    }

    if (utils.type(value) === 'Object' && utils.type(target[name]) === 'Object') {
      utils.extend(target[name], value)
    } else {
      target[name] = value
    }
  }
  // setter({...})
  else if (nameType === 'Object') {
    value = name
    utils.extend(target, value)
  }
  // otherwise throws
  else {
    throw new Error('Invalid arguments')
  }
}

// get image format
utils.getImageFormat = function(str) {
  var format = str.substr(str.lastIndexOf('.') + 1, str.length)
  format = format === 'jpg' ? 'jpeg' : format
  return 'image/' + format
}

// uppercase first letter
utils.upperCaseFirstLetter = function(str) {
  return str.replace(str.charAt(0), function(a) {
    return a.toUpperCase()
  })
}

describe('utils', function() {
  it('isBrowser() works', function() {
    should(utils.isBrowser()).equal(true)
  })

  it('isNode() works', function() {
    should(utils.isNode()).equal(false)
  })

  it('isNW() works', function() {
    should(utils.isNW()).equal(false)
  })

  it('isElectron() works', function() {
    should(utils.isElectron()).equal(false)
  })

  it('type() works', function() {
    should(utils.type([])).equal('Array')
    should(utils.type({})).equal('Object')
    should(utils.type()).equal('Undefined')
    should(utils.type('hello')).equal('String')
    should(utils.type('')).equal('String')
    should(utils.type('1')).equal('String')
    should(utils.type('true')).equal('String')
    should(utils.type(1)).equal('Number')
    should(utils.type(true)).equal('Boolean')
    should(utils.type(new Image)).equal('HTMLImageElement')
  })

  it('rangeNumber(num, min, max) works', function() {
    utils.rangeNumber(10, 1, 92).should.equal(10)
    utils.rangeNumber(1, 1, 92).should.equal(1)
    utils.rangeNumber(-1, 1, 92).should.equal(1)
    utils.rangeNumber(0, 1, 92).should.equal(1)
    utils.rangeNumber(92, 1, 92).should.equal(92)
    utils.rangeNumber(100, 1, 92).should.equal(92)
    utils.rangeNumber(91, 1, 92).should.equal(91)
  })

  it('extend(target, obj1, obj2, ...) works', function() {
    var target = {a: 1}
    utils.extend(target, {b: 2})
    should(target).eql({a: 1, b: 2})

    target = {a: 1}
    utils.extend(target, {a: 11, b: 2}, {c: 3})
    should(target).eql({a: 11, b: 2, c: 3})
  })

  it('getImageFormat(str) works', function() {
    utils.getImageFormat(jpgImagePath).should.equal('image/jpeg')
    utils.getImageFormat(pngImagePath).should.equal('image/png')
  })

  it('upperCaseFirstLetter(str) works', function() {
    utils.upperCaseFirstLetter('apple').should.equal('Apple')
  })
})

