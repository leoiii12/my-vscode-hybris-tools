// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const moo = require('moo')

  const LETTER_REGEXP = /[a-zA-Z]/;
  const isCharLetter = (char) => LETTER_REGEXP.test(char);

  function ci(text) {
    return [text.toLowerCase(), text.toUpperCase()];
  };

  const lexer = moo.compile({
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
        group: ci('group'),
        having: ci('having'),
        order: ci('order'),
        by: ci('by'),

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
    any: /.+?/
  });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["query", "_"], "postprocess": (elems) => (elems[0])},
    {"name": "query$ebnf$1", "symbols": []},
    {"name": "query$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "select_expression"]},
    {"name": "query$ebnf$1", "symbols": ["query$ebnf$1", "query$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("where") ? {type: "where"} : where), "__", "expression"]},
    {"name": "query$ebnf$2", "symbols": ["query$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$3$subexpression$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "query$ebnf$3$subexpression$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "column_ref"]},
    {"name": "query$ebnf$3$subexpression$1$subexpression$1$ebnf$1", "symbols": ["query$ebnf$3$subexpression$1$subexpression$1$ebnf$1", "query$ebnf$3$subexpression$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$ebnf$3$subexpression$1$subexpression$1", "symbols": ["column_ref", "query$ebnf$3$subexpression$1$subexpression$1$ebnf$1"]},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("having") ? {type: "having"} : having), "__", "expression"]},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1", "symbols": ["query$ebnf$3$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$3$subexpression$1", "symbols": ["__", (lexer.has("group") ? {type: "group"} : group), "__", (lexer.has("by") ? {type: "by"} : by), "__", "query$ebnf$3$subexpression$1$subexpression$1", "query$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "query$ebnf$3", "symbols": ["query$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$4$subexpression$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "query$ebnf$4$subexpression$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "order_expression"]},
    {"name": "query$ebnf$4$subexpression$1$subexpression$1$ebnf$1", "symbols": ["query$ebnf$4$subexpression$1$subexpression$1$ebnf$1", "query$ebnf$4$subexpression$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$ebnf$4$subexpression$1$subexpression$1", "symbols": ["order_expression", "query$ebnf$4$subexpression$1$subexpression$1$ebnf$1"]},
    {"name": "query$ebnf$4$subexpression$1", "symbols": ["__", (lexer.has("order") ? {type: "order"} : order), "__", (lexer.has("by") ? {type: "by"} : by), "__", "query$ebnf$4$subexpression$1$subexpression$1"]},
    {"name": "query$ebnf$4", "symbols": ["query$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("all") ? {type: "all"} : all), "_"]},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1", "symbols": ["query$ebnf$5$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$5$subexpression$1", "symbols": ["__", (lexer.has("union") ? {type: "union"} : union), "__", "query$ebnf$5$subexpression$1$ebnf$1", "query"]},
    {"name": "query$ebnf$5", "symbols": ["query$ebnf$5$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$6$subexpression$1", "symbols": ["__", (lexer.has("except") ? {type: "except"} : except), "__", "query"]},
    {"name": "query$ebnf$6", "symbols": ["query$ebnf$6$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$7$subexpression$1", "symbols": ["__", (lexer.has("minus") ? {type: "minus"} : minus), "__", "query"]},
    {"name": "query$ebnf$7", "symbols": ["query$ebnf$7$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$7", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$8$subexpression$1", "symbols": ["__", (lexer.has("intersect") ? {type: "intersect"} : intersect), "__", "query"]},
    {"name": "query$ebnf$8", "symbols": ["query$ebnf$8$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$8", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query", "symbols": [(lexer.has("select") ? {type: "select"} : select), "__", "select_expression", "query$ebnf$1", "_", (lexer.has("from") ? {type: "from"} : from), "__", "from", "query$ebnf$2", "query$ebnf$3", "query$ebnf$4", "query$ebnf$5", "query$ebnf$6", "query$ebnf$7", "query$ebnf$8"], "postprocess": 
        (elems) => {
          return {
            select: [elems[2], ...elems[3].map(subElements => subElements[3])],
            from: elems[7],
            where: elems[8] == null ? null : elems[8][3],
            groupBy: elems[9] == null ? null : {
              type: 'group_by',
              columns: [elems[9][5][0], ...elems[9][5][1].map((elem) => elem[3])],
              having: elems[9][6] == null ? null : elems[9][6][3],
            },
            orderBy: elems[10] == null ? null : [
              elems[10][5][0], ...elems[10][5][1].map((elem) => elem[3])
            ],
            union: elems[11] == null ? null : { isAll: elems[11][2] != null, query: elems[11][4] },
            except: elems[12] == null ? null : { query: elems[12][3] },
            minus: elems[13] == null ? null : { query: elems[13][3] },
            intersect: elems[14] == null ? null : { query: elems[14][3] },
          }
        }
          },
    {"name": "select_expression", "symbols": [(lexer.has("times") ? {type: "times"} : times)], "postprocess": 
        (elems) => {
          return { type: 'select_expression', column: "*" }
        }
          },
    {"name": "select_expression", "symbols": ["identifier", "_", (lexer.has("dot") ? {type: "dot"} : dot), "_", (lexer.has("times") ? {type: "times"} : times)], "postprocess": 
        (elems) => {
          return { type: 'select_expression', tableAlias: elems[0], column: "*" }
        }
          },
    {"name": "select_expression", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", "identifier", "_", (lexer.has("dot") ? {type: "dot"} : dot), "_", (lexer.has("times") ? {type: "times"} : times), "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)], "postprocess": 
        (elems) => {
          return { type: 'select_expression', typeAlias: elems[2], column: "*" }
        }
          },
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("as") ? {type: "as"} : as)]},
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1", "symbols": ["select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "select_expression$ebnf$1$subexpression$1", "symbols": ["select_expression$ebnf$1$subexpression$1$ebnf$1", "__", "identifier"]},
    {"name": "select_expression$ebnf$1", "symbols": ["select_expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "select_expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "select_expression", "symbols": ["term", "select_expression$ebnf$1"], "postprocess": 
        (elems) => {
          return { type: 'select_expression', term: elems[0], as: elems[1] == null ? null : elems[1][2] }
        }
          },
    {"name": "from$ebnf$1", "symbols": []},
    {"name": "from$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "table_expression"]},
    {"name": "from$ebnf$1", "symbols": ["from$ebnf$1", "from$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "from", "symbols": ["table_expression", "from$ebnf$1"], "postprocess": 
        (elems) => ([elems[0], ...elems[1].map((elem) => elem[3])])
          },
    {"name": "table_expression", "symbols": ["subquery"], "postprocess": (elems) => { return { type: 'table_expression', subquery: elems[0] } }},
    {"name": "table_expression$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("as") ? {type: "as"} : as)]},
    {"name": "table_expression$ebnf$1", "symbols": ["table_expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expression", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "__", "subquery", "__", (lexer.has("rparen") ? {type: "rparen"} : rparen), "table_expression$ebnf$1", "__", "identifier"], "postprocess": (elems) => { return { type: 'table_expression', subquery: elems[2], as: elems[7] } }},
    {"name": "table_expression", "symbols": ["types"], "postprocess": (elems) => { return { type: 'table_expression', types: elems[0] } }},
    {"name": "order_expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("asc") ? {type: "asc"} : asc)]},
    {"name": "order_expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("desc") ? {type: "desc"} : desc)]},
    {"name": "order_expression$ebnf$1$subexpression$1", "symbols": ["__", "order_expression$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "order_expression$ebnf$1", "symbols": ["order_expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "order_expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_expression$ebnf$2$subexpression$1$subexpression$1", "symbols": [(lexer.has("first") ? {type: "first"} : first)]},
    {"name": "order_expression$ebnf$2$subexpression$1$subexpression$1", "symbols": [(lexer.has("last") ? {type: "last"} : last)]},
    {"name": "order_expression$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("nulls") ? {type: "nulls"} : nulls), "__", "order_expression$ebnf$2$subexpression$1$subexpression$1"]},
    {"name": "order_expression$ebnf$2", "symbols": ["order_expression$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "order_expression$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_expression", "symbols": ["column_ref", "order_expression$ebnf$1", "order_expression$ebnf$2"], "postprocess": 
        (elems) => {
          return {
            type: 'order_expression',
            column: elems[0],
            ascDesc: elems[1] === null || elems[1][1] === null ? null : elems[1][1][0],
            nullsFirstLast: elems[2] === null || elems[2][3] === null ? null : elems[2][3][0]
          }
        }
          },
    {"name": "types$subexpression$1", "symbols": ["type"]},
    {"name": "types$subexpression$1", "symbols": ["type_join"]},
    {"name": "types", "symbols": ["types$subexpression$1"], "postprocess": 
        (elems) => (elems[0][0])
          },
    {"name": "type", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", "single_type_clause", "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)], "postprocess": 
        (elems) => ({ type: 'htype', htype: elems[2] })
          },
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("left") ? {type: "left"} : left)]},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("on") ? {type: "on"} : on), "__", "expression"]},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$2", "symbols": ["type_join$ebnf$1$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$1", "symbols": ["type_join$ebnf$1$subexpression$1$ebnf$1", "__", (lexer.has("join") ? {type: "join"} : join), "__", "single_type_clause", "type_join$ebnf$1$subexpression$1$ebnf$2"]},
    {"name": "type_join$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$1"]},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("left") ? {type: "left"} : left)]},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("on") ? {type: "on"} : on), "__", "expression"]},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$2", "symbols": ["type_join$ebnf$1$subexpression$2$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$2", "symbols": ["type_join$ebnf$1$subexpression$2$ebnf$1", "__", (lexer.has("join") ? {type: "join"} : join), "__", "single_type_clause", "type_join$ebnf$1$subexpression$2$ebnf$2"]},
    {"name": "type_join$ebnf$1", "symbols": ["type_join$ebnf$1", "type_join$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "type_join", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", "single_type_clause", "type_join$ebnf$1", "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)], "postprocess": 
        (elems) => ({
          type: 'htype',
          htype: elems[2],
          htypeJoin: elems[3].map((joinElems) => {
            return {
              type: 'htype_join',
              isLeft: joinElems[0] != null,
              htype: joinElems[4],
              on: joinElems[5] == null ? null : joinElems[5][3]
            }
          })
        })
          },
    {"name": "single_type_clause$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("exclamation_mark") ? {type: "exclamation_mark"} : exclamation_mark)]},
    {"name": "single_type_clause$ebnf$1", "symbols": ["single_type_clause$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "single_type_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_clause$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("as") ? {type: "as"} : as)]},
    {"name": "single_type_clause$ebnf$2$subexpression$1$ebnf$1", "symbols": ["single_type_clause$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "single_type_clause$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_clause$ebnf$2$subexpression$1", "symbols": ["single_type_clause$ebnf$2$subexpression$1$ebnf$1", "__", "identifier"]},
    {"name": "single_type_clause$ebnf$2", "symbols": ["single_type_clause$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "single_type_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_clause", "symbols": ["identifier", "single_type_clause$ebnf$1", "single_type_clause$ebnf$2"], "postprocess": 
        (elems) => ({ type: 'single_type_clause', typeName: elems[0], isSolid: elems[1] != null, as: elems[2] == null ? null : elems[2][2] })
          },
    {"name": "expression$ebnf$1", "symbols": []},
    {"name": "expression$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("or") ? {type: "or"} : or), "__", "and_condition"]},
    {"name": "expression$ebnf$1", "symbols": ["expression$ebnf$1", "expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression", "symbols": ["and_condition", "expression$ebnf$1"], "postprocess": 
        (elems) => {
          if (elems[1].length == 0) {
            return elems[0]
          }
          return {
            type: 'or_condition',
            operands: [elems[0], ...elems[1].map(elem => (elem[3]))]
          }
        }
          },
    {"name": "and_condition$ebnf$1", "symbols": []},
    {"name": "and_condition$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("and") ? {type: "and"} : and), "__", "condition"]},
    {"name": "and_condition$ebnf$1", "symbols": ["and_condition$ebnf$1", "and_condition$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "and_condition", "symbols": ["condition", "and_condition$ebnf$1"], "postprocess": 
        (elems) => {
          if (elems[1].length == 0) {
            return elems[0]
          }
          return {
            type: 'and_condition',
            operands: [elems[0], ...elems[1].map(elem => (elem[3]))]
          }
        }
          },
    {"name": "condition", "symbols": ["operand", "_", "compare", "_", "operand"], "postprocess": 
        (elems) => ({ type: 'condition', operand_1: elems[0], comparator: elems[2], operand_2: elems[4] })
          },
    {"name": "condition$ebnf$1$subexpression$1", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__"]},
    {"name": "condition$ebnf$1", "symbols": ["condition$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$1", (lexer.has("in_") ? {type: "in_"} : in_), "__", (lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "operand", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        (elems) => {
          if (elems[2] == null) {
            return { type: 'condition', operand_1: elems[0], comparator: 'IN', operand_2: elems[7] }
          }
          return { type: 'condition', operand_1: elems[0], comparator: 'NOT IN', operand_2: elems[7] }
        }
          },
    {"name": "condition$ebnf$2$subexpression$1", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__"]},
    {"name": "condition$ebnf$2", "symbols": ["condition$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$2", (lexer.has("like") ? {type: "like"} : like), "__", "operand"], "postprocess": 
        (elems) => {
          if (elems[2] == null) {
            return { type: 'condition', operand_1: elems[0], comparator: 'LIKE', operand_2: elems[5] }
          }
          return { type: 'condition', operand_1: elems[0], comparator: 'NOT LIKE', operand_2: elems[5] }
        }
          },
    {"name": "condition$ebnf$3$subexpression$1", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__"]},
    {"name": "condition$ebnf$3", "symbols": ["condition$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$3", (lexer.has("between") ? {type: "between"} : between), "__", "operand", "__", (lexer.has("and") ? {type: "and"} : and), "__", "operand"], "postprocess": 
        (elems) => {
          if (elems[2] == null) {
            return { type: 'condition', operand_1: elems[0], comparator: 'BETWEEN', operand_2: elems[6], operand_3: elems[10] }
          }
          return { type: 'condition', operand_1: elems[0], comparator: 'NOT BETWEEN', operand_2: elems[6], operand_3: elems[10] }
        }
          },
    {"name": "condition$ebnf$4$subexpression$1", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__"]},
    {"name": "condition$ebnf$4", "symbols": ["condition$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["operand", "__", (lexer.has("is") ? {type: "is"} : is), "__", "condition$ebnf$4", "type_null"], "postprocess": 
        (elems) => {
          if (elems[4] == null) {
            return { type: 'condition', operand_1: elems[0], comparator: 'IS', operand_2: elems[5] }
          }
          return { type: 'condition', operand_1: elems[0], comparator: 'IS NOT', operand_2: elems[5] }
        }
          },
    {"name": "condition", "symbols": [(lexer.has("not") ? {type: "not"} : not), "__", "expression"], "postprocess": 
        (elems) => ({ type: 'condition', expression: elems[2], isNot: true })
          },
    {"name": "condition", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "expression", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        (elems) => ({ type: 'condition', expression: elems[2] })
          },
    {"name": "column_ref$ebnf$1$subexpression$1", "symbols": ["_", "language"]},
    {"name": "column_ref$ebnf$1", "symbols": ["column_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", "identifier", "column_ref$ebnf$1", "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)], "postprocess": 
        (elems) => {
          return {
            type: 'column_ref',
            typeAlias: null,
            attribute: elems[2],
            language: elems[3] == null ? null : elems[3][1],
            modifiers: null
          }
        }
          },
    {"name": "column_ref$subexpression$1$subexpression$1", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot)]},
    {"name": "column_ref$subexpression$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)]},
    {"name": "column_ref$subexpression$1", "symbols": ["identifier", "_", "column_ref$subexpression$1$subexpression$1", "_"]},
    {"name": "column_ref$ebnf$2$subexpression$1", "symbols": ["_", "language"]},
    {"name": "column_ref$ebnf$2", "symbols": ["column_ref$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref$ebnf$3$subexpression$1$subexpression$1", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot)]},
    {"name": "column_ref$ebnf$3$subexpression$1$subexpression$1", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)]},
    {"name": "column_ref$ebnf$3$subexpression$1", "symbols": ["_", "column_ref$ebnf$3$subexpression$1$subexpression$1", "_", "modifiers"]},
    {"name": "column_ref$ebnf$3", "symbols": ["column_ref$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", "column_ref$subexpression$1", "identifier", "column_ref$ebnf$2", "column_ref$ebnf$3", "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)], "postprocess": 
        (elems) => {
          return {
            type: 'column_ref',
            typeAlias: elems[2] == null ? null : elems[2][0],
            attribute: elems[3],
            language: elems[4] == null ? null : elems[4][1],
            modifiers: elems[5] == null ? null : elems[5][3]
          }
        }
          },
    {"name": "column_ref$subexpression$2", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot)]},
    {"name": "column_ref$subexpression$2", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)]},
    {"name": "column_ref", "symbols": ["identifier", "_", "column_ref$subexpression$2", "_", "identifier"], "postprocess": 
        (elems) => {
          return {
            type: 'column_ref',
            tableAlias: elems[0],
            column: elems[4]
          }
        }
          },
    {"name": "language", "symbols": [(lexer.has("lsbrac") ? {type: "lsbrac"} : lsbrac), "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("rsbrac") ? {type: "rsbrac"} : rsbrac)], "postprocess": 
        (elems) => (elems[2])
          },
    {"name": "modifiers", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        (elems) => (elems[0])
          },
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("not_equal") ? {type: "not_equal"} : not_equal)]},
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("less_than_and_equal") ? {type: "less_than_and_equal"} : less_than_and_equal)]},
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("greater_than_and_equal") ? {type: "greater_than_and_equal"} : greater_than_and_equal)]},
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal)]},
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("less_than") ? {type: "less_than"} : less_than)]},
    {"name": "compare$subexpression$1", "symbols": [(lexer.has("greater_than") ? {type: "greater_than"} : greater_than)]},
    {"name": "compare", "symbols": ["compare$subexpression$1"], "postprocess": 
        (elems) => { return elems[0][0]; }
          },
    {"name": "operand$ebnf$1", "symbols": []},
    {"name": "operand$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("or_") ? {type: "or_"} : or_), "__", "summand"]},
    {"name": "operand$ebnf$1", "symbols": ["operand$ebnf$1", "operand$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operand", "symbols": ["summand", "operand$ebnf$1"], "postprocess": 
        (elems) => {
          if (elems[1].length == 0) {
            return elems[0]
          }
          return {
            type: 'or_operand',
            operand_1: elems[0],
            operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
          }
        }
          },
    {"name": "summand$ebnf$1", "symbols": []},
    {"name": "summand$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("plus") ? {type: "plus"} : plus)]},
    {"name": "summand$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)]},
    {"name": "summand$ebnf$1$subexpression$1", "symbols": ["__", "summand$ebnf$1$subexpression$1$subexpression$1", "__", "factor"]},
    {"name": "summand$ebnf$1", "symbols": ["summand$ebnf$1", "summand$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "summand", "symbols": ["factor", "summand$ebnf$1"], "postprocess": 
        (elems) => {
          if (elems[1].length == 0) {
            return elems[0]
          }
          return {
            type: 'pm_operand',
            operand_1: elems[0],
            operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
          }
        }
          },
    {"name": "factor$ebnf$1", "symbols": []},
    {"name": "factor$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("times") ? {type: "times"} : times)]},
    {"name": "factor$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("obelus") ? {type: "obelus"} : obelus)]},
    {"name": "factor$ebnf$1$subexpression$1", "symbols": ["__", "factor$ebnf$1$subexpression$1$subexpression$1", "__", "term"]},
    {"name": "factor$ebnf$1", "symbols": ["factor$ebnf$1", "factor$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "factor", "symbols": ["term", "factor$ebnf$1"], "postprocess": 
        (elems) => {
          if (elems[1].length == 0) {
            return elems[0]
          }
          return {
            type: 'to_operand',
            operand_1: elems[0],
            operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
          }
        }
          },
    {"name": "term", "symbols": ["value"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": ["bind_parameter"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": ["function"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": ["case"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": ["case_when"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_", "operand", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": (elems) => (elems[2])},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("distinct") ? {type: "distinct"} : distinct)]},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1", "symbols": [(lexer.has("all") ? {type: "all"} : all)]},
    {"name": "term$ebnf$1$subexpression$1", "symbols": ["term$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "term$ebnf$1", "symbols": ["term$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "term$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "term", "symbols": ["term$ebnf$1", "column_ref"], "postprocess": 
        (elems) => { 
          const columnRef = elems[1]
          columnRef['isDistinct']  = elems[0] == null ? false : true
        
          return columnRef
        }
          },
    {"name": "term", "symbols": ["row_value_constructor"], "postprocess": (elems) => (elems[0])},
    {"name": "term", "symbols": ["subquery"], "postprocess": (elems) => (elems[0])},
    {"name": "value$subexpression$1", "symbols": ["type_numeric"]},
    {"name": "value$subexpression$1", "symbols": ["type_boolean"]},
    {"name": "value$subexpression$1", "symbols": ["type_null"]},
    {"name": "value$subexpression$1", "symbols": ["type_string"]},
    {"name": "value", "symbols": ["value$subexpression$1"], "postprocess": 
        (elems) => (elems[0][0])
          },
    {"name": "bind_parameter$subexpression$1", "symbols": [(lexer.has("question_mark") ? {type: "question_mark"} : question_mark), (lexer.has("number_literal") ? {type: "number_literal"} : number_literal)]},
    {"name": "bind_parameter$subexpression$1", "symbols": [(lexer.has("question_mark") ? {type: "question_mark"} : question_mark), (lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "bind_parameter", "symbols": ["bind_parameter$subexpression$1"], "postprocess": 
        (elems) => ({ type: 'bind_parameter', parameter_name: elems[0][1] })
          },
    {"name": "function$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("distinct") ? {type: "distinct"} : distinct), "_"]},
    {"name": "function$subexpression$1$ebnf$1", "symbols": ["function$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function$subexpression$1$subexpression$1", "symbols": [(lexer.has("times") ? {type: "times"} : times)]},
    {"name": "function$subexpression$1$subexpression$1", "symbols": ["term"]},
    {"name": "function$subexpression$1", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "function$subexpression$1$ebnf$1", "function$subexpression$1$subexpression$1", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "function", "symbols": [(lexer.has("count") ? {type: "count"} : count), "_", "function$subexpression$1"], "postprocess": 
        (elems) => ({ type: 'function', function: 'COUNT', args: [elems[2][1] == null, elems[2][2][0]] })
          },
    {"name": "function$subexpression$2$ebnf$1$subexpression$1", "symbols": ["_", "term"]},
    {"name": "function$subexpression$2$ebnf$1", "symbols": ["function$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function$subexpression$2$ebnf$2", "symbols": []},
    {"name": "function$subexpression$2$ebnf$2$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "term"]},
    {"name": "function$subexpression$2$ebnf$2", "symbols": ["function$subexpression$2$ebnf$2", "function$subexpression$2$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function$subexpression$2", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "function$subexpression$2$ebnf$1", "function$subexpression$2$ebnf$2", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "function", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", "function$subexpression$2"], "postprocess": 
        (elems) => {
          if (elems[2][1] === null) {
            return ({ type: 'function', function: elems[0], args: [] })
          }
        
          return ({ type: 'function', function: elems[0], args: [elems[2][1][1], ...elems[2][2].map(elem => elem[3])] })
        }
          },
    {"name": "case$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("when") ? {type: "when"} : when), "__", "expression", "__", (lexer.has("then") ? {type: "then"} : then), "__", "term"]},
    {"name": "case$ebnf$1", "symbols": ["case$ebnf$1$subexpression$1"]},
    {"name": "case$ebnf$1$subexpression$2", "symbols": ["__", (lexer.has("when") ? {type: "when"} : when), "__", "expression", "__", (lexer.has("then") ? {type: "then"} : then), "__", "term"]},
    {"name": "case$ebnf$1", "symbols": ["case$ebnf$1", "case$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("else_") ? {type: "else_"} : else_), "__", "term"]},
    {"name": "case$ebnf$2", "symbols": ["case$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case", "symbols": [(lexer.has("case_") ? {type: "case_"} : case_), "__", "term", "case$ebnf$1", "case$ebnf$2", "__", (lexer.has("end") ? {type: "end"} : end)], "postprocess": 
        (elems) => ({ 
          type: 'case',
          case: elems[2], 
          when: elems[3].map(whenElem => ({ when: whenElem[3], then: whenElem[7] })),
          else: elems[4] === null ? null : elems[4][3],
        })
          },
    {"name": "case_when$ebnf$1$subexpression$1", "symbols": ["__", (lexer.has("when") ? {type: "when"} : when), "__", "expression", "__", (lexer.has("then") ? {type: "then"} : then), "__", "term"]},
    {"name": "case_when$ebnf$1", "symbols": ["case_when$ebnf$1$subexpression$1"]},
    {"name": "case_when$ebnf$1$subexpression$2", "symbols": ["__", (lexer.has("when") ? {type: "when"} : when), "__", "expression", "__", (lexer.has("then") ? {type: "then"} : then), "__", "term"]},
    {"name": "case_when$ebnf$1", "symbols": ["case_when$ebnf$1", "case_when$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case_when$ebnf$2$subexpression$1", "symbols": ["__", (lexer.has("else_") ? {type: "else_"} : else_), "__", "term"]},
    {"name": "case_when$ebnf$2", "symbols": ["case_when$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_when$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_when", "symbols": [(lexer.has("case_") ? {type: "case_"} : case_), "case_when$ebnf$1", "case_when$ebnf$2", "__", (lexer.has("end") ? {type: "end"} : end)], "postprocess": 
        (elems) => ({
          type: 'case_when',
          when: elems[1].map(whenElem => ({ when: whenElem[3], then: whenElem[7] })),
          else: elems[2] === null ? null : elems[2][3],
        })
          },
    {"name": "row_value_constructor$subexpression$1", "symbols": ["_", "term"]},
    {"name": "row_value_constructor$ebnf$1", "symbols": []},
    {"name": "row_value_constructor$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "term"]},
    {"name": "row_value_constructor$ebnf$1", "symbols": ["row_value_constructor$ebnf$1", "row_value_constructor$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "row_value_constructor", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "row_value_constructor$subexpression$1", "row_value_constructor$ebnf$1", "_", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        (elems) => ({ type: 'row_value_constructor', terms: [elems[1][1], ...elems[2].map((elem) => elem[3])] })
          },
    {"name": "subquery$subexpression$1", "symbols": [(lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac), "_", (lexer.has("lcbrac") ? {type: "lcbrac"} : lcbrac)]},
    {"name": "subquery$subexpression$2", "symbols": [(lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac), "_", (lexer.has("rcbrac") ? {type: "rcbrac"} : rcbrac)]},
    {"name": "subquery", "symbols": ["subquery$subexpression$1", "_", "query", "_", "subquery$subexpression$2"], "postprocess": 
        (elems) => ({ type: 'subquery', query: elems[2]})
          },
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": (elems) => (elems[0])},
    {"name": "identifier", "symbols": [(lexer.has("quoted_identifier") ? {type: "quoted_identifier"} : quoted_identifier)], "postprocess": (elems) => (elems[0])},
    {"name": "type_null", "symbols": [(lexer.has("null") ? {type: "null"} : null)], "postprocess": (elems) => (elems[0])},
    {"name": "type_boolean$subexpression$1", "symbols": [(lexer.has("true") ? {type: "true"} : true)]},
    {"name": "type_boolean$subexpression$1", "symbols": [(lexer.has("false") ? {type: "false"} : false)]},
    {"name": "type_boolean", "symbols": ["type_boolean$subexpression$1"], "postprocess": (elems) => (elems[0][0])},
    {"name": "type_numeric$subexpression$1", "symbols": ["type_int"]},
    {"name": "type_numeric$subexpression$1", "symbols": ["type_decimal"]},
    {"name": "type_numeric", "symbols": ["type_numeric$subexpression$1"], "postprocess": (elems) => (elems[0][0])},
    {"name": "type_int$ebnf$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": id},
    {"name": "type_int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_int", "symbols": ["type_int$ebnf$1", (lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": (elems) => (JSON.parse(elems.join("")))},
    {"name": "type_decimal$ebnf$1", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus)], "postprocess": id},
    {"name": "type_decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_decimal", "symbols": ["type_decimal$ebnf$1", (lexer.has("number_literal") ? {type: "number_literal"} : number_literal), (lexer.has("dot") ? {type: "dot"} : dot), (lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": (elems) => (JSON.parse(elems.join("")))},
    {"name": "type_string", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": (elems) => (elems[0])},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "_$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) { return null; }},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1$subexpression$1"]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("nl") ? {type: "nl"} : nl)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "__$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) { return null; }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
