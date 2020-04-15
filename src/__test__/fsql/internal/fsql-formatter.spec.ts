import { Parser } from 'nearley'

import { FsqlFormatter } from '../../../lang-fsql/internal/fsql-formatter'
import { kases } from './assests'

const fsqlGrammar = require('../../../../syntaxes/flexibleSearchQuery.js')
const cases = kases.map(kase => kase.split('**').map(fsql => fsql.trim()))

test.each(cases)('.getFormatted(%#)', (fsql, expectedFsql) => {
  const parser = new Parser(fsqlGrammar)
  parser.feed(fsql)
  parser.finish()

  expect(parser.results.length).toBeGreaterThan(0)

  const formatter = new FsqlFormatter()
  const formattedFsql = formatter.getFormattedFsql(parser.results[0])

  expect(formattedFsql).toBe(expectedFsql)
})
