'use stric'

const assert = require('assert')
const _ = require('lodash')
const fs = require('fs-extra')
const {
  parseCsvFile,
  readAndParseCsvFile,
  composeCsvFile
} = require('../index')

const VALID_CSV_FILE_PATH = './test_data/valid_csv_file.csv'
const TOO_SHORT_TYPE_ROW_CSV_FILE_PATH = './test_data/too_short_type_row_csv_file.csv'

const VALID_CSV_FILE_CONTENT = [{
    label: 'timestamp',
    type: 'Number',
    unit: 's',
    values: [0, 1]
  },
  {
    label: 'a.b',
    type: 'Number',
    unit: 'W',
    values: [1.2, null]
  },
  {
    label: 'a.c.d',
    type: 'Boolean',
    unit: '',
    values: [true, false]
  },
  {
    label: 'a.c.e',
    type: 'String',
    unit: '',
    values: ['a', 'b']
  }
]

describe('./index.js', () => {
  describe('parseCsvFile()', () => {
    let validCsvFileContent
    let tooShortTypeRowContent
    before(async () => {
      validCsvFileContent = await fs.readFile(VALID_CSV_FILE_PATH, {
        encoding: 'utf8'
      })
      tooShortTypeRowContent = await fs.readFile(TOO_SHORT_TYPE_ROW_CSV_FILE_PATH, {
        encoding: 'utf8'
      })
    })

    it('should parse the content of a valid csv file', () => {
      const pc = parseCsvFile(validCsvFileContent, {
        columnSeparator: ';'
      })

      assert(_.isEqual(pc, VALID_CSV_FILE_CONTENT))
    })

    it('should throw an exception if the type row is shorter than the header row', () => {
      try {
        const pc = parseCsvFile(tooShortTypeRowContent, {
          columnSeparator: ';'
        })
      } catch (error) {
        return
      }

      assert(false, 'expected error has not been thrown')
    })
  })

  describe('readAndParseCsvFile()', () => {
    it('should read and parse the content of a valid csv file', async () => {
      const pc = await readAndParseCsvFile(VALID_CSV_FILE_PATH, {
        columnSeparator: ';'
      })

      assert(_.isEqual(pc, VALID_CSV_FILE_CONTENT))
    })

    it('should throw an error if the file is not presen', async () => {
      try {
        await readAndParseCsvFile('INVALID_PATH')
      } catch (error) {
        return
      }

      assert(false, 'expected exeption has not been thrown')
    })
  })

  describe('composeCsvFile()', () => {
    it('should compose the content of a csv file', async () => {
      const templateText = await fs.readFile(VALID_CSV_FILE_PATH, {encoding: 'utf8'})
      const template = parseCsvFile(templateText, {
        columnSeparator: ';'
      })

      const text = composeCsvFile(template, {
        columnSeparator: ';',
        rowSeparator: '\n',
        lastLineIsEmptyLine: true
      })

      assert(_.isEqual(text, templateText), 'composed text does not match templateText')
    })

    it('should throw an error if the file is not presen', async () => {
      try {
        await readAndParseCsvFile('INVALID_PATH')
      } catch (error) {
        return
      }

      assert(false, 'expected exeption has not been thrown')
    })
  })
})