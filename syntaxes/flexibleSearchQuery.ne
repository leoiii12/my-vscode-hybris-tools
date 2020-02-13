main -> query _ {% (elems) => (elems[0]) %}

query ->
  "SELECT"i __ select_expression ( _ "," _ select_expression ):* __
	"FROM"i __ table_expression
	( __ "WHERE"i __ expression ):?
	( __ "GROUP"i __ "BY"i __ column_ref ( _ "," _ column_ref ):* ( __ "HAVING"i __ expression ):? ):?
	( __ "ORDER"i __ "BY"i __ order ( _ "," _ order ):* ):?
	( __ "UNION"i ( __ "ALL"i ):? __ query ):?
	( __ "EXCEPT"i __ query ):?
	( __ "MINUS"i __ query ):?
	( __ "INTERSECT"i __ query ):? {%
        (elems) => {
			return {
				select: [elems[2], ...elems[3].map(subElements => subElements[3])],
				from: elems[7],
				where: elems[8] == null ? null : elems[8][3],
                // TODO
				groupBy: elems[9],
                // TODO
				orderBy: elems[10],
				union: elems[11] == null ? null : { isAll: elems[11][2] != null, query: elems[11][4] },
				except: elems[12] == null ? null : { query: elems[12][3] },
				minus: elems[13] == null ? null : { query: elems[13][3] },
				intersect: elems[14] == null ? null : { query: elems[14][3] },
			}
		}
    %}

select_expression ->
    "*" {%
        (elems) => {
            return { columnName: "*" }
        }
    %}
	| name _ "." _ "*" {%
        (elems) => {
            return { tableAlias: elems[0], columnName: "*" }
        }
    %}
    | "{" _ name _ "." _ "*" _  "}" {%
        (elems) => {
            return { type: elems[2], columnName: "*" }
        }
    %}
    | term ( ( __ "AS"i ):? __ name ):? {%
        (elems) => {
            return { term: elems[0], as: elems[1] == null ? null : elems[1][2] }
        }
    %}

table_expression ->
    (
        subquery                                        {% (elems) => { return { subquery: elems[0] } } %}
        | "(" __ subquery __ ")" ( __ "AS" ):? __ name  {% (elems) => { return { subquery: elems[2], as: elems[7] } } %}
        | types                                         {% (elems) => { return { types: elems[0] } } %}
    ) ( _ "," _ table_expression ):? {%
        (elems) => {
            if (elems[1] === null) {
                return elems[0]
            }

            return [elems[0], elems[1][3]]
        }
    %}

order ->
    column_ref ( __ ( "ASC"i | "DESC"i ) ):? ( __ "NULLS"i __ ( "FIRST"i | "LAST"i ) ):? {%
        (elems) => {
            return {
                column: elems[0],
                ascDesc: elems[1] === null || elems[1][1] === null  ? null : elems[1][1][0].toLowerCase(),
                nullsFirstLast: elems[2] === null || elems[2][3] === null ? null : elems[2][3][0].toLowerCase()
            }
        }
    %}

# ####################
# Types
# ####################

types ->
	type | type_join {%
        (elems) => (elems[0])
    %}
type ->
	"{" _ single_type_cluase _ "}" {%
		(elems) => ({ type: elems[2] })
	%}
type_join ->
    "{" _ single_type_cluase ( ( __ "LEFT"i ):? __ "JOIN"i __ single_type_cluase __ "ON"i __ expression ):+ _ "}"  {%
		(elems) => ({
			type: elems[2],
			typeJoin: elems[3].map((joinelems) => {
				return {
					isLeft: joinelems[0] != null ,
					type: joinelems[4],
					on: joinelems[8]
				}
			})
		})
	%}
single_type_cluase ->
    name (_ "!"):? ( ( __ "AS"i ):? __ name):? {%
        (elems) => ({ name: elems[0], isSolid: elems[1] !== null, as: elems[2] == null ? null : elems[2][3] })
    %}

# ####################
# Expression
# ####################

expression ->
    and_condition ( __ "OR"i __ and_condition):* {%
		(elems) => {
			if (elems[1].length == 0) {
				return elems[0]
			}
			return {
				operand_1: elems[0],
				operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
			}
		}
	%}

and_condition ->
    condition ( __ "AND"i __ condition ):* {%
		(elems) => {
			if (elems[1].length == 0) {
				return elems[0]
			}
			return {
				operand_1: elems[0],
				operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
			}
		}
	%}

condition ->
    operand _ compare _ operand {%
        (elems) => ({ operand_1: elems[0], comparator: elems[2], operand_2: elems[4] })
    %}
	| operand __ ( "NOT"i __ ):? "IN"i __ "(" _ operand _ ")"
	| operand __ ( "NOT"i __ ):? "LIKE"i __ operand {%
        (elems) => {
            if (elems[2] == null) {
                return { operand_1: elems[0], comparator: 'like', operand_2: elems[5] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'like', operand_2: elems[5] }
            }
        }
    %}
	| operand __ ( "NOT"i __ ):? "BETWEEN"i __ operand __ "AND"i __ operand {%
        (elems) => {
            if (elems[2] == null) {
                return { operand_1: elems[0], comparator: 'between', operand_2: elems[6], operand_3: elems[10] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'between', operand_2: elems[6], operand_3: elems[10] }
            }
        }
    %}
	| operand __ "IS"i __ ("NOT"i __):? type_null {%
        (elems) => {
            if (elems[4] == null) {
                return { operand_1: elems[0], comparator: 'is', operand_2: elems[5] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'is', operand_2: elems[5] }
            }
        }
    %}
    | "NOT"i __ expression          {% (elems) => ({ not: elems[2] }) %}
    | "(" _ expression _ ")"        {% (elems) => (elems[1]) %}

column_ref ->
    "{" _ ( name _ [.:] _ ):? name ( _ language ):? ( _ [.:] _ modifiers ):? _ "}" {%
		(elems) => {
			return {
				attributeName: elems[3],
				typeAlias: elems[2] == null ? null : elems[2][0],
				language: elems[4] == null ? null : elems[4][1],
				modifiers: elems[5] == null ? null : elems[5][3]
			}
		}
	%}
	| name _ [.:] _ name {%
		(elems) => {
			return {
				tableAlias: elems[0],
				columnName: elems[4]
			}
		}
	%}
language ->
	"[" _ name _ "]"                                {% (elems) => (elems[2]) %}
modifiers ->
    [clo]:+                                         {% (elems) => (elems.join("")) %}

compare ->
    ( "<>" | "<=" | ">=" | "=" | "<" | ">" | "!=" ) {% (elems) => { return elems[0][0]; } %}

# ####################
# Operand
# ####################

operand ->
    summand ( __ "||" __ summand ):* {%
		(elems) => {
			if (elems[1].length == 0) {
				return elems[0]
			}
			return {
				operand_1: elems[0],
				operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
			}
		}
	%}

summand ->
    factor ( __ ( "+" | "-" ) __ factor ):* {%
		(elems) => {
			if (elems[1].length == 0) {
				return elems[0]
			}
			return {
				operand_1: elems[0],
				operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
			}
		}
	%}

factor ->
    term ( __ ( "*" | "/" ) __ term ):* {%
		(elems) => {
			if (elems[1].length == 0) {
				return elems[0]
			}
			return {
				operand_1: elems[0],
				operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
			}
		}
	%}

# ####################
# Term
# ####################

term ->
    value                   {% (elems) => { return elems[0]; } %}
    | bind_parameter        {% (elems) => { return elems[0]; } %}
    | function              {% (elems) => { return elems[0]; } %}
    | case                  {% (elems) => { return elems[0]; } %}
    | case_when             {% (elems) => { return elems[0]; } %}
    | "(" _ operand _ ")"   {% (elems) => { return elems[2]; } %}
    | ( ( "DISTINCT"i | "ALL"i ) __ ):? column_ref {%
		(elems) => {
			return {
				isDistinct: elems[0] != null ? elems[0][0][0].toLowerCase() === 'distinct': false,
				column: elems[1]
			};
		}
	%}
    | row_value_constructor {% (elems) => { return elems[0]; } %}
	| subquery              {% (elems) => { return elems[0]; } %}

value ->
    ( type_numeric | type_boolean | type_null | type_string ) {% (elems) => { return elems[0][0]; } %}

bind_parameter ->
    ( "?" number | "?" name ) {%
        (elems) => ({ bindName: elems[0][1] })
    %}

function ->
    "COUNT"i _ "(" (_ "DISTINCT"i __):? ("*" | term) ")"    {%
        // TODO
        (elems) => ({ func: 'count', args: [ { isDistinct: elems[3] == null, column: elems[4][0] } ] })
    %}
    | name _ "(" (_ term):? ( _ "," _ term ):* _ ")"        {%
        (elems) => {
            if (elems[2] == null) {
                return { func: elems[0], args: [] }
            }

            return { func: elems[0], args: [elems[3][1], ...elems[4].map(subElems => subElems[3])] }
        }
    %}

case ->
    "CASE"i __ term ( __ "WHEN"i __ expression __ "THEN"i __ term ):+ ( __ "ELSE"i __ term ):? __ "END"i {%
        (elems) => {
            // TODO
            return { case: elems[2], when: elems[3], else: elems[4] }
        }
    %}

case_when ->
    "CASE"i ( __ "WHEN"i __ expression  __ "THEN"i __ term ):+ ( __ "ELSE"i __ term ):? __ "END"i {%
        (elems) => {
            // TODO
            return { when: elems[1], else: elems[2] }
        }
    %}

row_value_constructor ->
    "(" ( _ term ) (_ "," _ term ):* _ ")" {%
        (elems) => ([elems[1][1], ...elems[2].map(subElements => subElements[3])])
    %}

subquery ->
   "{{" _ query _ "}}" {%
        (elems) => (elems[2])
    %}

# ####################
# Name
# ####################

name ->
    [a-zA-Z_] [a-zA-Z_0-9]:*    {% (elems) => ([elems[0], ...elems[1]].join("")) %}
	| quoted_name               {% (elems) => (elems[0]) %}

quoted_name ->
    dqstring                    {% (elems) => (elems[0]) %}

# ####################
# Types
# ####################

type_null -> "NULL"i            {% (elems) => (null) %}

type_boolean ->
    ( "TRUE"i | "FALSE"i )      {% (elems) => (elems[0][0].toLowerCase() === "true") %}

type_numeric ->
    ( type_int | type_decimal ) {% (elems) => (elems[0][0]) %}
type_int ->
    "-":? number                {% (elems) => (JSON.parse(elems.join(""))) %}
type_decimal ->
    "-":? number "." number     {% (elems) => (JSON.parse(elems.join(""))) %}

type_string ->
    sqstring                    {% (elems) => (elems[0]) %}

# ####################
# Number
# ####################

number ->
    [0-9]:+                     {% (elems) => (elems[0].join("")) %}

# ####################
# String
# ####################

dqstring ->
    "\"" dstrchar:* "\""        {% function(d) { return d[1].join(""); } %}
sqstring ->
    "'"  sstrchar:* "'"         {% function(d) { return d[1].join(""); } %}

dstrchar -> [^\\"\n] {% id %}
    | "\\" strescape {%
    function(d) {
        return JSON.parse("\""+d.join("")+"\"");
    }
%}

sstrchar -> [^\\'\n] {% id %}
    | "\\" strescape {%
        function(d) { return JSON.parse("\"" + d.join("") + "\""); }
    %}
    | "\\'" {%
        function(d) { return "'"; }
    %}

strescape -> ["\\/bfnrt] {% id %}
    | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {%
        function(d) {
            return d.join("");
        }
    %}

# ####################
# Whitespace `builtin/whitespace.ne`
# ####################

_  -> wschar:* {% function(d) {return null;} %}
__ -> wschar:+ {% function(d) {return null;} %}

wschar -> [ \t\n\v\f] {% id %}