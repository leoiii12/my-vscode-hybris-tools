import * as moo from 'moo'

function ci(text: string) {
  return [text.toLowerCase(), text.toUpperCase()]
}

export const lexerRules = {
  group_by: ['group by', 'GROUP BY'],
  order_by: ['order by', 'ORDER BY'],

  ws: /[ \t\v\f]+/,
  nl: { match: /[\r\n]+/, lineBreaks: true },

  plus: '+',
  minus: '-',
  times: '*',
  obelus: '/',

  not_equal: /<>|!=/,
  less_than_and_equal: '<=',
  greater_than_and_equal: '>=',
  less_than: '<',
  greater_than: '>',
  equal: '=',

  lcbrac: '{',
  rcbrac: '}',
  lparen: '(',
  rparen: ')',
  lsbrac: '[',
  rsbrac: ']',

  dot: '.',
  colon: ':',
  comma: ',',
  question_mark: '?',
  exclamation_mark: '!',

  quoted_identifier: /\".*?\"/,

  identifier: {
    match: /[a-zA-Z\_][a-zA-Z\_0-9]*/,
    type: moo.keywords({
      true: ci('true'),
      false: ci('false'),
      null: ci('null'),

      select: ci('select'),
      from: ci('from'),
      where: ci('where'),
      having: ci('having'),

      asc: ci('asc'),
      desc: ci('desc'),
      nulls: ci('nulls'),
      first: ci('first'),
      last: ci('last'),

      left: ci('left'),
      join: ci('join'),
      on: ci('on'),

      or: ci('or'),
      or_: ci('||'),
      and: ci('and'),
      not: ci('not'),
      like: ci('like'),
      between: ci('between'),
      is: ci('is'),
      in_: ci('in'),

      union: ci('union'),
      all: ci('all'),
      except: ci('except'),
      minus: ci('minus'),
      intersect: ci('intersect'),

      group_concat: ci('group_concat'),
      separator: ci('separator'),
      count: ci('count'),
      distinct: ci('distinct'),

      case_: ci('case'),
      when: ci('when'),
      then: ci('then'),
      else_: ci('else'),
      end: ci('end'),

      as: ci('as'),
    }),
  },

  number_literal: /[0-9]+/,
  string_literal: /\'.*?\'/,
  any: /.+?/,
}
