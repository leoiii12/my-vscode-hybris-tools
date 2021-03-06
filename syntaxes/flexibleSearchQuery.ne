@{%
  const moo = require('moo')
  const mooRules = require('./flexibleSearchQuery.moo-rules.js')

  const lexer = moo.compile(mooRules.rules);
%}

@lexer lexer

main ->
  query _ {% (elems) => (elems[0]) %}

query ->
  %select __ select_expression ( _ %comma _ select_expression ):* __
  %from __ from
  ( __ %where __ expression ):?
  ( __ %group_by __ ( column_ref ( _ %comma _ column_ref ):* ) ( __ %having __ expression):? ):?
  ( __ %order_by __ ( order_expression ( _ %comma _ order_expression ):* ) ):?
  ( __ %union __ ( %all _ ):? query ):?
  ( __ %except __ query ):?
  ( __ %minus __ query ):?
  ( __ %intersect __ query ):? {%
    (elems) => {
      return {
        select: [elems[2], ...elems[3].map(subElements => subElements[3])],
        from: elems[7],
        where: elems[8] == null ? null : elems[8][3],
        groupBy: elems[9] == null ? null : {
          type: 'group_by',
          columns: [elems[9][3][0], ...elems[9][3][1].map((elem) => elem[3])],
          having: elems[9][4] == null ? null : elems[9][4][3],
        },
        orderBy: elems[10] == null ? null : [
          elems[10][3][0], ...elems[10][3][1].map((elem) => elem[3])
        ],
        union: elems[11] == null ? null : { isAll: elems[11][3] != null, query: elems[11][4] },
        except: elems[12] == null ? null : { query: elems[12][3] },
        minus: elems[13] == null ? null : { query: elems[13][3] },
        intersect: elems[14] == null ? null : { query: elems[14][3] },
      }
    }
  %}

select_expression ->
  identifier _ %dot _ %times {%
    (elems) => {
      return { type: 'select_expression', tableAlias: elems[0], column: "*" }
    }
  %}
  | %lcbrac _ identifier _ %dot _ %times _  %rcbrac {%
    (elems) => {
      return { type: 'select_expression', typeAlias: elems[2], column: "*" }
    }
  %}
  | operand ( ( __ %as ):? __ identifier ):? {%
    (elems) => {
      return { type: 'select_expression', term: elems[0], as: elems[1] == null ? null : elems[1][2] }
    }
  %}

from ->
  table_expression ( _ %comma _ table_expression ):* {%
    (elems) => ([elems[0], ...elems[1].map((elem) => elem[3])])
  %}

table_expression ->
  subqueries {% (elems) => { return { type: 'subquery_expression', subqueries: elems[0] } } %}
  | types {% (elems) => { return { type: 'table_expression', types: elems[0] } } %}

subqueries ->
  single_subquery_clause ( ( _ %left ):? __ %join __ single_subquery_clause ( __ %on __ expression ):? ):* {%
    (elems) => ({ 
      type: 'subquery', 
      subquery: elems[0],
      subqueryJoin: elems[1].map((joinElems) => {
        return {
          type: 'subquery_join',
          isLeft: joinElems[0] != null,
          subquery: joinElems[4],
          on: joinElems[5] == null ? null : joinElems[5][3]
        }
      })
    })
  %}

single_subquery_clause -> 
  %lparen _ subquery _ %rparen ( __ %as ):? __ identifier {% (elems) => ({ type: 'single_subquery_clause', query: elems[2], as: elems[7] }) %}
  | subquery {% (elems) => ({ type: 'single_subquery_clause', query: elems[0], as: null }) %}

order_expression ->
  column_ref ( __ ( %asc | %desc ) ):? ( __ %nulls __ ( %first | %last ) ):? {%
    (elems) => {
      return {
        type: 'order_expression',
        column: elems[0],
        ascDesc: elems[1] === null || elems[1][1] === null ? null : elems[1][1][0],
        nullsFirstLast: elems[2] === null || elems[2][3] === null ? null : elems[2][3][0]
      }
    }
  %}

# ####################
# Types (htype = `Hybris Type`)
# ####################

types ->
  ( type | type_join ) {%
    (elems) => (elems[0][0])
  %}
type ->
  %lcbrac _ single_type_clause _ %rcbrac {%
    (elems) => ({ type: 'htype', htype: elems[2] })
  %}
type_join ->
  %lcbrac _ single_type_clause ( ( __ %left ):? __ %join __ single_type_clause ( __ %on __ expression ):?  ):+ _ %rcbrac {%
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
  %}
single_type_clause ->
  identifier ( _ %exclamation_mark ):? ( ( __ %as ):? __ identifier ):? {%
    (elems) => ({ type: 'single_type_clause', typeName: elems[0], isSolid: elems[1] != null, as: elems[2] == null ? null : elems[2][2] })
  %}

# ####################
# Expression
# ####################

expression ->
  and_condition ( __ %or __ and_condition):*  {%
    (elems) => {
      if (elems[1].length == 0) {
        return elems[0]
      }
      return {
        type: 'or_condition',
        operands: [elems[0], ...elems[1].map(elem => (elem[3]))]
      }
    }
  %}

and_condition ->
  condition ( __ %and __ condition ):* {%
    (elems) => {
      if (elems[1].length == 0) {
        return elems[0]
      }
      return {
        type: 'and_condition',
        operands: [elems[0], ...elems[1].map(elem => (elem[3]))]
      }
    }
  %}

condition ->
  operand _ compare _ operand {%
    (elems) => ({ type: 'condition', operand_1: elems[0], comparator: elems[2], operand_2: elems[4] })
  %}
  | operand __ ( %not __ ):? %in_ __ operand {%
    (elems) => {
      if (elems[2] == null) {
        return { type: 'condition', operand_1: elems[0], comparator: 'IN', operand_2: elems[5] }
      }
      return { type: 'condition', operand_1: elems[0], comparator: 'NOT IN', operand_2: elems[5] }
    }
  %}
  | operand __ ( %not __ ):? %like __ operand {%
    (elems) => {
      if (elems[2] == null) {
        return { type: 'condition', operand_1: elems[0], comparator: 'LIKE', operand_2: elems[5] }
      }
      return { type: 'condition', operand_1: elems[0], comparator: 'NOT LIKE', operand_2: elems[5] }
    }
  %}
  | operand __ ( %not __ ):? %regexp __ operand {%
    (elems) => {
      if (elems[2] == null) {
        return { type: 'condition', operand_1: elems[0], comparator: 'REGEXP', operand_2: elems[5] }
      }
      return { type: 'condition', operand_1: elems[0], comparator: 'NOT REGEXP', operand_2: elems[5] }
    }
  %}
  | operand __ ( %not __ ):? %between __ operand __ %and __ operand {%
    (elems) => {
      if (elems[2] == null) {
        return { type: 'condition', operand_1: elems[0], comparator: 'BETWEEN', operand_2: elems[5], operand_3: elems[9] }
      }
      return { type: 'condition', operand_1: elems[0], comparator: 'NOT BETWEEN', operand_2: elems[5], operand_3: elems[9] }
    }
  %}
  | operand __ %is __ (%not __):? ( type_null | type_boolean ) {%
    (elems) => {
      if (elems[4] == null) {
        return { type: 'condition', operand_1: elems[0], comparator: 'IS', operand_2: elems[5][0] }
      }
      return { type: 'condition', operand_1: elems[0], comparator: 'IS NOT', operand_2: elems[5][0] }
    }
  %}
  | ( %not __ ):? %exists __ operand {%
    (elems) => {
      if (elems[0] == null) {
        return { type: 'condition',comparator: 'EXISTS', operand_1: elems[3] }
      }
      return { type: 'condition', comparator: 'NOT EXISTS', operand_1: elems[3] }
    }
  %}
  | type_int {%
    (elems) => ({ type: 'condition', expression: elems[0] })
  %}
  | column_ref {%
    (elems) => ({ type: 'condition', expression: elems[0] })
  %}
  | %not __ expression {%
    (elems) => ({ type: 'condition', expression: elems[2], isNot: true })
  %}
  | %lparen _ expression _ %rparen {%
    (elems) => ({ type: 'condition', expression: elems[2] })
  %}

column_ref ->
  %lcbrac _ identifier ( _ language ):? _ %rcbrac {%
    (elems) => {
      return {
        type: 'column_ref',
        typeAlias: null,
        attribute: elems[2],
        language: elems[3] == null ? null : elems[3][1],
        modifiers: null
      }
    }
  %}
  | %lcbrac _ ( identifier _ ( %dot | %colon ) _ ) identifier ( _ language ):? (_ ( %dot | %colon ) _ modifiers ):? _ %rcbrac {%
    (elems) => {
      return {
        type: 'column_ref',
        typeAlias: elems[2] == null ? null : elems[2][0],
        attribute: elems[3],
        language: elems[4] == null ? null : elems[4][1],
        modifiers: elems[5] == null ? null : elems[5][3]
      }
    }
  %}
  | identifier _ ( %dot | %colon ) _ identifier {%
    (elems) => {
      return {
        type: 'column_ref',
        tableAlias: elems[0],
        column: elems[4]
      }
    }
  %}
  | identifier {%
    (elems) => {
      return {
        type: 'column_ref',
        column: elems[0]
      }
    }
  %}
  | %times {%
    (elems) => {
      return {
        type: 'column_ref',
        column: elems[0]
      }
    }
  %}
language ->
  %lsbrac _ %identifier _ %rsbrac {%
    (elems) => (elems[2])
  %}
modifiers ->
  %identifier {%
    (elems) => (elems[0])
  %}

compare ->
  ( %not_equal | %less_than_and_equal | %greater_than_and_equal | %equal | %less_than | %greater_than ) {%
    (elems) => { return elems[0][0]; }
  %}

# ####################
# Operand
# ####################

operand ->
  summand ( __ %or_ __ summand ):* {%
    (elems) => {
      if (elems[1].length == 0) {
        return elems[0]
      }
      return {
        type: 'or_operand',
        operand_1: elems[0],
        operands: elems[1].map(subElements => ({ operator: subElements[1][0], operand: subElements[3] }))
      }
    }
  %}

summand ->
  factor ( __ ( %plus | %minus ) __ factor ):* {%
    (elems) => {
      if (elems[1].length == 0) {
        return elems[0]
      }
      return {
        type: 'pm_operand',
        operand_1: elems[0],
        operands: elems[1].map(subElements => ({ operator: subElements[1][0], operand: subElements[3] }))
      }
    }
  %}

factor ->
  term ( __ ( %times | %obelus ) __ term ):* {%
    (elems) => {
      if (elems[1].length == 0) {
        return elems[0]
      }
      return {
        type: 'to_operand',
        operand_1: elems[0],
        operands: elems[1].map(subElements => ({ operator: subElements[1][0], operand: subElements[3] }))
      }
    }
  %}

# ####################
# Term
# ####################

term ->
  value {% (elems) => (elems[0]) %}
  | bind_parameter {% (elems) => (elems[0]) %}
  | function {% (elems) => (elems[0]) %}
  | case {% (elems) => (elems[0]) %}
  | case_when {% (elems) => (elems[0]) %}
  | row_value_constructor {% (elems) => (elems[0]) %}
  | %lparen _ operand _ %rparen  {% (elems) => (elems[2]) %}
  | ( ( %distinct | %all ) _ ):? column_ref {%
    (elems) => { 
      const columnRef = elems[1]
      columnRef['isDistinct']  = elems[0] == null ? false : true

      return columnRef
    }
  %}
  | subquery {% (elems) => (elems[0]) %}
  | interval {% (elems) => (elems[0]) %}

value ->
  ( type_numeric | type_boolean | type_null | type_string ) {%
    (elems) => (elems[0][0])
  %}

bind_parameter ->
  ( %question_mark %number_literal | %question_mark %identifier ) {%
    (elems) => ({ type: 'bind_parameter', parameter_name: elems[0][1] })
  %}

function ->
  %group_concat _ ( %lparen _ operand ( _ %separator _ type_string ):? _ %rparen ) {%
    (elems) => ({
      type: 'function',
      function: 'GROUP_CONCAT',
      args: elems[2][3] === null ?
        [elems[2][2]] :
        [elems[2][2], elems[2][3][3]]
    })
  %}
  | %cast _ ( %lparen _ operand __ %as __ type_mysql _ %rparen ) {%
    (elems) => ({
      type: 'function',
      function: 'CAST',
      args: [elems[2][2], elems[2][6]]
    })
  %}
  | %iff _ ( %lparen _ expression _ %comma _ term _ %comma _ term _ %rparen ) {%
    (elems) => ({
      type: 'function',
      function: 'if',
      args: [elems[2][2], elems[2][6], elems[2][10]]
    })
  %}
  | %identifier _ ( %lparen ( _ operand ):? ( _ %comma _ operand ):* _ %rparen ) {%
    (elems) => {
      if (elems[2][1] === null) {
        return ({ type: 'function', function: elems[0], args: [] })
      }

      return ({ type: 'function', function: elems[0], args: [elems[2][1][1], ...elems[2][2].map(elem => elem[3])] })
    }
  %}

case ->
  %case_ __ term ( __ %when __ expression __ %then __ term ):+ ( __ %else_ __ term ):? __ %end {%
    (elems) => ({ 
      type: 'case',
      case: elems[2], 
      when: elems[3].map(whenElem => ({ when: whenElem[3], then: whenElem[7] })),
      else: elems[4] === null ? null : elems[4][3],
    })
  %}

case_when ->
  %case_ ( __ %when __ expression  __ %then __ term ):+ ( __ %else_ __ term ):? __ %end {%
    (elems) => ({
      type: 'case_when',
      when: elems[1].map(whenElem => ({ when: whenElem[3], then: whenElem[7] })),
      else: elems[2] === null ? null : elems[2][3],
    })
  %}

row_value_constructor ->
  %lparen ( _ term ) ( _ %comma _ term ):+ _ %rparen {%
    (elems) => ({ type: 'row_value_constructor', terms: [elems[1][1], ...elems[2].map((elem) => elem[3])] })
  %}

subquery ->
  ( %lcbrac %lcbrac ) _ query _ ( %rcbrac %rcbrac ) {%
    (elems) => ({type: 'real_subquery', query: elems[2]})
  %}

interval ->
  %interval __ term __ %identifier {%
    (elems) => ({ type: 'interval', interval: elems[0], term: elems[2], unit: elems[4] })
  %}

# ####################
# Identifier
# ####################

identifier ->
  %identifier                               {% (elems) => (elems[0]) %}
  | %quoted_identifier                      {% (elems) => (elems[0]) %}

# ####################
# Type
# ####################

type_mysql -> %identifier ( %lparen _ type_int _ %rparen ):? ( __ %character __ %set __ %identifier ):? {%
  (elems) => {
    let str = `${elems[0]}`

    if (elems[1]) { str += `(${elems[1][2]})` }
    if (elems[2]) { str += ` CHARACTER SET ${elems[2][5]}` }

    return str
  }
%}

type_null -> %null                          {% (elems) => (elems[0]) %}

type_boolean -> ( %true | %false )          {% (elems) => (elems[0][0]) %}

type_numeric -> ( type_int | type_decimal ) {% (elems) => (elems[0][0]) %}
type_int ->
  %minus:? %number_literal                  {% (elems) => (JSON.parse(elems.join(""))) %}
type_decimal ->
  %minus:? %number_literal
  %dot %number_literal                      {% (elems) => (JSON.parse(elems.join(""))) %}

type_string -> %string_literal              {% (elems) => (elems[0]) %}

# ####################
# Misc
# ####################

_ ->
  ( %ws | %nl ):*                               {% function(d) { return null; } %}
  | ( %ws | %nl ):* %comment ( %ws | %nl ):*    {% function(d) { return null; } %}

__ ->
  ( %ws | %nl ):+                               {% function(d) { return null; } %}
  | ( %ws | %nl ):+ %comment ( %ws | %nl ):*    {% function(d) { return null; } %}
