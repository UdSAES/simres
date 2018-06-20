'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const assert = require('assert')

const CSV_FILE_STANDARD_OPTIONS = {
  columnSeparator: '\t',
  rowSeparator: '\r\n',
  automaticRowEndDetection: true
}

/*
timestamp\ta.b.c\ta.b.d\ta.b.e
Number\tNumber\tBoolean\tString
s\tW\t\t
0\t\1t\true\tTest
*/

/**
 * parse the content of a csv file
 * @param {String} text 
 */
function parseCsvFile (text, options) {
  options = _.merge(_.cloneDeep(CSV_FILE_STANDARD_OPTIONS), options)
  let {
    columnSeparator,
    rowSeparator,
    automaticRowEndDetection
  } = options

  if (automaticRowEndDetection === true) {
    text = text.replace(/\r\n/g, '\n')
    rowSeparator = '\n'
  }

  const rows = text.split(rowSeparator)
  let headers
  let types
  let units
  let tsArray = []
  _.forEach(rows, (row, index) => {
    if (index === rows.length - 1 && row === '') {
      return
    } else if (row === '') {
      throw new Error('empty row')
    }
    
    const columns = row.split(columnSeparator)
    if (index === 0) {
      headers = columns
      return
    } else if (index === 1) {
      types = columns
      if (headers.length !== types.length) {
        throw new Error("lengths of header row and types row don't match")
      }
      return
    } else if (index === 2) {
      units = columns
      if (headers.length !== units.length) {
        throw new Error("lengths of header row and unit row don't match")
      }
      return
    } else if (index === 3) {
      _.forEach(headers, () => {
        tsArray.push([])
      }) 
    }

    if (headers.length !== columns.length) {
      throw new Error("lengths of header row and current row don't match")
    }
    
    _.forEach(columns, (column, index) => {
      switch (types[index]) {
        case 'Number': {
          const value = parseFloat(column)
          tsArray[index].push(_.isNaN(value)?null:value)
          break
        }
        case 'Boolean': {
          let value = null
          switch (column) {
            case 'true': {
              value = true
              break
            }
            case 'false': {
              value = false
              break
            }
          }
          tsArray[index].push(value)
          break
        }
        case 'String': {
          tsArray[index].push(column)
        }
      }
    })
  })

  const result = []
  _.forEach(headers, (header, index) => {
    const timeseries = {
      label: header,
      type: types[index],
      unit: units[index],
      values: tsArray[index]
    }
    result.push(timeseries)
  })
  
  return result
}

function composeCsvFile (tableObject, options) {
  options = _.merge(_.cloneDeep(CSV_FILE_STANDARD_OPTIONS), options)
  let {
    columnSeparator,
    rowSeparator,
    lastLineIsEmptyLine
  } = options

  let headers = []
  let types = []
  let units = []
  let timeseriesCollection = []
  
  _.forEach(tableObject, (item) => {
    headers.push(item.label)
    types.push(item.type)
    units.push(item.unit)
    timeseriesCollection.push(item.values)
  })

  assert(_.isArray(headers), 'headers is not an array')
  assert(_.isArray(types), 'headers is not an array')
  assert(_.isArray(units), 'headers is not an array')
  assert(_.isArray(timeseriesCollection), 'headers is not an array')
  assert(headers.length > 0, 'headers must have a length longer than 0')
  assert.equal(types.length, headers.length, 'types length does not match headers length')
  assert.equal(units.length, headers.length, 'units length does not match headers length')
  assert.equal(timeseriesCollection.length, headers.length, 'timeseriesCollection length does not match headers length')
  
  let length
  _.forEach(timeseriesCollection, (timeseries) => {
    assert(_.isArray(timeseries), 'timeseries is not an array')
    if (!_.isNil(length)) {
      assert.equal(timeseries.length, length, 'timeseries has wrong length')
    }
    length = timeseries.length
  })

  let lines = []
  lines.push(headers.join(columnSeparator))
  lines.push(types.join(columnSeparator))
  lines.push(units.join(columnSeparator))


  for (let i = 0; i < timeseriesCollection[0].length; i++) {
    const line = _.map(timeseriesCollection, (timeseries, index) => {
      const value = timeseries[i]

      if (_.isNil(value)) {
        return ''
      }

      switch (types[index]) {
        case 'Number': {
          if (_.isNaN(value)) {
            return ''
          } else {
            return String(value)
          }
          break
        }
        case 'Boolean': {
          return value ? 'true' : 'false'
        }
        case 'String': {
          return value
        }
        default: {
          assert(false, 'type not supported')
        }
      }
    })

    lines.push(line.join(columnSeparator))
  }

  if (lastLineIsEmptyLine) {
    lines.push('')
  }
  return lines.join(rowSeparator)
}

async function readAndParseCsvFile (pathToFile, options) {
  const fileContent = await fs.readFile(pathToFile, {encoding: 'utf8'})
  return parseCsvFile(fileContent, options)
}

async function composeAndWriteCsvFile(pathToFile, tableObject, options) {
  const fileContent = composeCsvFile(tableObject, options)
  await fs.writeFile(pathToFile, {encoding: 'utf8'})
}

exports.parseCsvFile = parseCsvFile
exports.readAndParseCsvFile = readAndParseCsvFile
exports.composeCsvFile = composeCsvFile
exports.composeAndWriteCsvFile = composeAndWriteCsvFile
