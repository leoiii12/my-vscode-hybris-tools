const moo = require('moo')

function ci(text) {
  return [text.toLowerCase(), text.toUpperCase()];
};

const mooRules = {
  comment: /--.*?$/,

  group_by: ci('group by'),
  order_by: ci('order by'),

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
      union: ci('union'),
      except: ci('except'),
      minus: ci('minus'),
      intersect: ci('intersect'),

      all: ci('all'),
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
      exists: ci('exists'),
      is: ci('is'),
      in_: ci('in'),
      regexp: ci('regexp'),

      group_concat: ci('group_concat'),
      separator: ci('separator'),
      cast: ci('cast'),
      character: ci('character'),
      set: ci('set'),
      distinct: ci('distinct'),
      interval: ci('interval'),

      case_: ci('case'),
      when: ci('when'),
      then: ci('then'),
      else_: ci('else'),
      end: ci('end'),

      as: ci('as'),
    }),
  },

  number_literal: /[0-9]+/,
  string_literal: /\'(?:\'\'|[^\'\'])*\'/,
  any: /.+?/
}

module.exports = {
  rules: mooRules
}