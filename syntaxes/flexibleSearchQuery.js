// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["query", "_"], "postprocess": (elems) => (elems[0])},
    {"name": "query$subexpression$1", "symbols": [/[sS]/, /[eE]/, /[lL]/, /[eE]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$1", "symbols": []},
    {"name": "query$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "select_expression"]},
    {"name": "query$ebnf$1", "symbols": ["query$ebnf$1", "query$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$subexpression$2", "symbols": [/[fF]/, /[rR]/, /[oO]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[wW]/, /[hH]/, /[eE]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$2$subexpression$1", "symbols": ["__", "query$ebnf$2$subexpression$1$subexpression$1", "__", "expression"]},
    {"name": "query$ebnf$2", "symbols": ["query$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$3$subexpression$1$subexpression$1", "symbols": [/[gG]/, /[rR]/, /[oO]/, /[uU]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$3$subexpression$1$subexpression$2", "symbols": [/[bB]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1", "symbols": []},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "column_ref"]},
    {"name": "query$ebnf$3$subexpression$1$ebnf$1", "symbols": ["query$ebnf$3$subexpression$1$ebnf$1", "query$ebnf$3$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$ebnf$3$subexpression$1$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[hH]/, /[aA]/, /[vV]/, /[iI]/, /[nN]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$3$subexpression$1$ebnf$2$subexpression$1", "symbols": ["__", "query$ebnf$3$subexpression$1$ebnf$2$subexpression$1$subexpression$1", "__", "expression"]},
    {"name": "query$ebnf$3$subexpression$1$ebnf$2", "symbols": ["query$ebnf$3$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$3$subexpression$1", "symbols": ["__", "query$ebnf$3$subexpression$1$subexpression$1", "__", "query$ebnf$3$subexpression$1$subexpression$2", "__", "column_ref", "query$ebnf$3$subexpression$1$ebnf$1", "query$ebnf$3$subexpression$1$ebnf$2"]},
    {"name": "query$ebnf$3", "symbols": ["query$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$4$subexpression$1$subexpression$1", "symbols": [/[oO]/, /[rR]/, /[dD]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$4$subexpression$1$subexpression$2", "symbols": [/[bB]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$4$subexpression$1$ebnf$1", "symbols": []},
    {"name": "query$ebnf$4$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "order"]},
    {"name": "query$ebnf$4$subexpression$1$ebnf$1", "symbols": ["query$ebnf$4$subexpression$1$ebnf$1", "query$ebnf$4$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "query$ebnf$4$subexpression$1", "symbols": ["__", "query$ebnf$4$subexpression$1$subexpression$1", "__", "query$ebnf$4$subexpression$1$subexpression$2", "__", "order", "query$ebnf$4$subexpression$1$ebnf$1"]},
    {"name": "query$ebnf$4", "symbols": ["query$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$5$subexpression$1$subexpression$1", "symbols": [/[uU]/, /[nN]/, /[iI]/, /[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[lL]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", "query$ebnf$5$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1", "symbols": ["query$ebnf$5$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$5$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$5$subexpression$1", "symbols": ["__", "query$ebnf$5$subexpression$1$subexpression$1", "query$ebnf$5$subexpression$1$ebnf$1", "__", "query"]},
    {"name": "query$ebnf$5", "symbols": ["query$ebnf$5$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$6$subexpression$1$subexpression$1", "symbols": [/[eE]/, /[xX]/, /[cC]/, /[eE]/, /[pP]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$6$subexpression$1", "symbols": ["__", "query$ebnf$6$subexpression$1$subexpression$1", "__", "query"]},
    {"name": "query$ebnf$6", "symbols": ["query$ebnf$6$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$7$subexpression$1$subexpression$1", "symbols": [/[mM]/, /[iI]/, /[nN]/, /[uU]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$7$subexpression$1", "symbols": ["__", "query$ebnf$7$subexpression$1$subexpression$1", "__", "query"]},
    {"name": "query$ebnf$7", "symbols": ["query$ebnf$7$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$7", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query$ebnf$8$subexpression$1$subexpression$1", "symbols": [/[iI]/, /[nN]/, /[tT]/, /[eE]/, /[rR]/, /[sS]/, /[eE]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query$ebnf$8$subexpression$1", "symbols": ["__", "query$ebnf$8$subexpression$1$subexpression$1", "__", "query"]},
    {"name": "query$ebnf$8", "symbols": ["query$ebnf$8$subexpression$1"], "postprocess": id},
    {"name": "query$ebnf$8", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "query", "symbols": ["query$subexpression$1", "__", "select_expression", "query$ebnf$1", "__", "query$subexpression$2", "__", "table_expression", "query$ebnf$2", "query$ebnf$3", "query$ebnf$4", "query$ebnf$5", "query$ebnf$6", "query$ebnf$7", "query$ebnf$8"], "postprocess": 
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
            },
    {"name": "select_expression", "symbols": [{"literal":"*"}], "postprocess": 
        (elems) => {
            return { columnName: "*" }
        }
            },
    {"name": "select_expression", "symbols": ["name", "_", {"literal":"."}, "_", {"literal":"*"}], "postprocess": 
        (elems) => {
            return { tableAlias: elems[0], columnName: "*" }
        }
            },
    {"name": "select_expression", "symbols": [{"literal":"{"}, "_", "name", "_", {"literal":"."}, "_", {"literal":"*"}, "_", {"literal":"}"}], "postprocess": 
        (elems) => {
            return { type: elems[2], columnName: "*" }
        }
            },
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", "select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1", "symbols": ["select_expression$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "select_expression$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "select_expression$ebnf$1$subexpression$1", "symbols": ["select_expression$ebnf$1$subexpression$1$ebnf$1", "__", "name"]},
    {"name": "select_expression$ebnf$1", "symbols": ["select_expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "select_expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "select_expression", "symbols": ["term", "select_expression$ebnf$1"], "postprocess": 
        (elems) => {
            return { term: elems[0], as: elems[1] == null ? null : elems[1][2] }
        }
            },
    {"name": "table_expression$subexpression$1", "symbols": ["subquery"], "postprocess": (elems) => { return { subquery: elems[0] } }},
    {"name": "table_expression$subexpression$1$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"A"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_expression$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", "table_expression$subexpression$1$ebnf$1$subexpression$1$string$1"]},
    {"name": "table_expression$subexpression$1$ebnf$1", "symbols": ["table_expression$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_expression$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expression$subexpression$1", "symbols": [{"literal":"("}, "__", "subquery", "__", {"literal":")"}, "table_expression$subexpression$1$ebnf$1", "__", "name"], "postprocess": (elems) => { return { subquery: elems[2], as: elems[7] } }},
    {"name": "table_expression$subexpression$1", "symbols": ["types"], "postprocess": (elems) => { return { types: elems[0] } }},
    {"name": "table_expression$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "table_expression"]},
    {"name": "table_expression$ebnf$1", "symbols": ["table_expression$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_expression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expression", "symbols": ["table_expression$subexpression$1", "table_expression$ebnf$1"], "postprocess": 
        (elems) => {
            if (elems[1] === null) {
                return elems[0]
            }
        
            return [elems[0], elems[1][3]]
        }
            },
    {"name": "order$ebnf$1$subexpression$1$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[sS]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "order$ebnf$1$subexpression$1$subexpression$1", "symbols": ["order$ebnf$1$subexpression$1$subexpression$1$subexpression$1"]},
    {"name": "order$ebnf$1$subexpression$1$subexpression$1$subexpression$2", "symbols": [/[dD]/, /[eE]/, /[sS]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "order$ebnf$1$subexpression$1$subexpression$1", "symbols": ["order$ebnf$1$subexpression$1$subexpression$1$subexpression$2"]},
    {"name": "order$ebnf$1$subexpression$1", "symbols": ["__", "order$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "order$ebnf$1", "symbols": ["order$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "order$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[nN]/, /[uU]/, /[lL]/, /[lL]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "order$ebnf$2$subexpression$1$subexpression$2$subexpression$1", "symbols": [/[fF]/, /[iI]/, /[rR]/, /[sS]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "order$ebnf$2$subexpression$1$subexpression$2", "symbols": ["order$ebnf$2$subexpression$1$subexpression$2$subexpression$1"]},
    {"name": "order$ebnf$2$subexpression$1$subexpression$2$subexpression$2", "symbols": [/[lL]/, /[aA]/, /[sS]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "order$ebnf$2$subexpression$1$subexpression$2", "symbols": ["order$ebnf$2$subexpression$1$subexpression$2$subexpression$2"]},
    {"name": "order$ebnf$2$subexpression$1", "symbols": ["__", "order$ebnf$2$subexpression$1$subexpression$1", "__", "order$ebnf$2$subexpression$1$subexpression$2"]},
    {"name": "order$ebnf$2", "symbols": ["order$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "order$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order", "symbols": ["column_ref", "order$ebnf$1", "order$ebnf$2"], "postprocess": 
        (elems) => {
            return {
                column: elems[0],
                ascDesc: elems[1] === null || elems[1][1] === null  ? null : elems[1][1][0].toLowerCase(),
                nullsFirstLast: elems[2] === null || elems[2][3] === null ? null : elems[2][3][0].toLowerCase()
            }
        }
            },
    {"name": "types", "symbols": ["type"]},
    {"name": "types", "symbols": ["type_join"], "postprocess": 
        (elems) => (elems[0])
            },
    {"name": "type", "symbols": [{"literal":"{"}, "_", "single_type_cluase", "_", {"literal":"}"}], "postprocess": 
        (elems) => ({ type: elems[2] })
        	},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[lL]/, /[eE]/, /[fF]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", "type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[jJ]/, /[oO]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$1$subexpression$2", "symbols": [/[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$1", "symbols": ["type_join$ebnf$1$subexpression$1$ebnf$1", "__", "type_join$ebnf$1$subexpression$1$subexpression$1", "__", "single_type_cluase", "__", "type_join$ebnf$1$subexpression$1$subexpression$2", "__", "expression"]},
    {"name": "type_join$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$1"]},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[lL]/, /[eE]/, /[fF]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1", "symbols": ["__", "type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1", "symbols": ["type_join$ebnf$1$subexpression$2$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "type_join$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_join$ebnf$1$subexpression$2$subexpression$1", "symbols": [/[jJ]/, /[oO]/, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$2$subexpression$2", "symbols": [/[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_join$ebnf$1$subexpression$2", "symbols": ["type_join$ebnf$1$subexpression$2$ebnf$1", "__", "type_join$ebnf$1$subexpression$2$subexpression$1", "__", "single_type_cluase", "__", "type_join$ebnf$1$subexpression$2$subexpression$2", "__", "expression"]},
    {"name": "type_join$ebnf$1", "symbols": ["type_join$ebnf$1", "type_join$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "type_join", "symbols": [{"literal":"{"}, "_", "single_type_cluase", "type_join$ebnf$1", "_", {"literal":"}"}], "postprocess": 
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
        	},
    {"name": "single_type_cluase$ebnf$1$subexpression$1", "symbols": ["_", {"literal":"!"}]},
    {"name": "single_type_cluase$ebnf$1", "symbols": ["single_type_cluase$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "single_type_cluase$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_cluase$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "single_type_cluase$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": ["__", "single_type_cluase$ebnf$2$subexpression$1$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "single_type_cluase$ebnf$2$subexpression$1$ebnf$1", "symbols": ["single_type_cluase$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "single_type_cluase$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_cluase$ebnf$2$subexpression$1", "symbols": ["single_type_cluase$ebnf$2$subexpression$1$ebnf$1", "__", "name"]},
    {"name": "single_type_cluase$ebnf$2", "symbols": ["single_type_cluase$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "single_type_cluase$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "single_type_cluase", "symbols": ["name", "single_type_cluase$ebnf$1", "single_type_cluase$ebnf$2"], "postprocess": 
        (elems) => ({ name: elems[0], isSolid: elems[1] !== null, as: elems[2] == null ? null : elems[2][3] })
            },
    {"name": "expression$ebnf$1", "symbols": []},
    {"name": "expression$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "expression$ebnf$1$subexpression$1", "symbols": ["__", "expression$ebnf$1$subexpression$1$subexpression$1", "__", "and_condition"]},
    {"name": "expression$ebnf$1", "symbols": ["expression$ebnf$1", "expression$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression", "symbols": ["and_condition", "expression$ebnf$1"], "postprocess": 
        (elems) => {
        	if (elems[1].length == 0) {
        		return elems[0]
        	}
        	return {
        		operand_1: elems[0],
        		operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
        	}
        }
        	},
    {"name": "and_condition$ebnf$1", "symbols": []},
    {"name": "and_condition$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "and_condition$ebnf$1$subexpression$1", "symbols": ["__", "and_condition$ebnf$1$subexpression$1$subexpression$1", "__", "condition"]},
    {"name": "and_condition$ebnf$1", "symbols": ["and_condition$ebnf$1", "and_condition$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "and_condition", "symbols": ["condition", "and_condition$ebnf$1"], "postprocess": 
        (elems) => {
        	if (elems[1].length == 0) {
        		return elems[0]
        	}
        	return {
        		operand_1: elems[0],
        		operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
        	}
        }
        	},
    {"name": "condition", "symbols": ["operand", "_", "compare", "_", "operand"], "postprocess": 
        (elems) => ({ operand_1: elems[0], comparator: elems[2], operand_2: elems[4] })
            },
    {"name": "condition$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$ebnf$1$subexpression$1", "symbols": ["condition$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "condition$ebnf$1", "symbols": ["condition$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$subexpression$1", "symbols": [/[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$1", "condition$subexpression$1", "__", {"literal":"("}, "_", "operand", "_", {"literal":")"}]},
    {"name": "condition$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$ebnf$2$subexpression$1", "symbols": ["condition$ebnf$2$subexpression$1$subexpression$1", "__"]},
    {"name": "condition$ebnf$2", "symbols": ["condition$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$subexpression$2", "symbols": [/[lL]/, /[iI]/, /[kK]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$2", "condition$subexpression$2", "__", "operand"], "postprocess": 
        (elems) => {
            if (elems[2] == null) {
                return { operand_1: elems[0], comparator: 'like', operand_2: elems[5] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'like', operand_2: elems[5] }
            }
        }
            },
    {"name": "condition$ebnf$3$subexpression$1$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$ebnf$3$subexpression$1", "symbols": ["condition$ebnf$3$subexpression$1$subexpression$1", "__"]},
    {"name": "condition$ebnf$3", "symbols": ["condition$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition$subexpression$3", "symbols": [/[bB]/, /[eE]/, /[tT]/, /[wW]/, /[eE]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$subexpression$4", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition", "symbols": ["operand", "__", "condition$ebnf$3", "condition$subexpression$3", "__", "operand", "__", "condition$subexpression$4", "__", "operand"], "postprocess": 
        (elems) => {
            if (elems[2] == null) {
                return { operand_1: elems[0], comparator: 'between', operand_2: elems[6], operand_3: elems[10] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'between', operand_2: elems[6], operand_3: elems[10] }
            }
        }
            },
    {"name": "condition$subexpression$5", "symbols": [/[iI]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$ebnf$4$subexpression$1$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition$ebnf$4$subexpression$1", "symbols": ["condition$ebnf$4$subexpression$1$subexpression$1", "__"]},
    {"name": "condition$ebnf$4", "symbols": ["condition$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "condition$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "condition", "symbols": ["operand", "__", "condition$subexpression$5", "__", "condition$ebnf$4", "type_null"], "postprocess": 
        (elems) => {
            if (elems[4] == null) {
                return { operand_1: elems[0], comparator: 'is', operand_2: elems[5] }
            }
            return {
                not: { operand_1: elems[0], comparator: 'is', operand_2: elems[5] }
            }
        }
            },
    {"name": "condition$subexpression$6", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "condition", "symbols": ["condition$subexpression$6", "__", "expression"], "postprocess": (elems) => ({ not: elems[2] })},
    {"name": "condition", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": (elems) => (elems[1])},
    {"name": "column_ref$ebnf$1$subexpression$1", "symbols": ["name", "_", /[.:]/, "_"]},
    {"name": "column_ref$ebnf$1", "symbols": ["column_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref$ebnf$2$subexpression$1", "symbols": ["_", "language"]},
    {"name": "column_ref$ebnf$2", "symbols": ["column_ref$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref$ebnf$3$subexpression$1", "symbols": ["_", /[.:]/, "_", "modifiers"]},
    {"name": "column_ref$ebnf$3", "symbols": ["column_ref$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "column_ref$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column_ref", "symbols": [{"literal":"{"}, "_", "column_ref$ebnf$1", "name", "column_ref$ebnf$2", "column_ref$ebnf$3", "_", {"literal":"}"}], "postprocess": 
        (elems) => {
        	return {
        		attributeName: elems[3],
        		typeAlias: elems[2] == null ? null : elems[2][0],
        		language: elems[4] == null ? null : elems[4][1],
        		modifiers: elems[5] == null ? null : elems[5][3]
        	}
        }
        	},
    {"name": "column_ref", "symbols": ["name", "_", /[.:]/, "_", "name"], "postprocess": 
        (elems) => {
        	return {
        		tableAlias: elems[0],
        		columnName: elems[4]
        	}
        }
        	},
    {"name": "language", "symbols": [{"literal":"["}, "_", "name", "_", {"literal":"]"}], "postprocess": (elems) => (elems[2])},
    {"name": "modifiers$ebnf$1", "symbols": [/[clo]/]},
    {"name": "modifiers$ebnf$1", "symbols": ["modifiers$ebnf$1", /[clo]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifiers", "symbols": ["modifiers$ebnf$1"], "postprocess": (elems) => (elems.join(""))},
    {"name": "compare$subexpression$1$string$1", "symbols": [{"literal":"<"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "compare$subexpression$1", "symbols": ["compare$subexpression$1$string$1"]},
    {"name": "compare$subexpression$1$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "compare$subexpression$1", "symbols": ["compare$subexpression$1$string$2"]},
    {"name": "compare$subexpression$1$string$3", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "compare$subexpression$1", "symbols": ["compare$subexpression$1$string$3"]},
    {"name": "compare$subexpression$1", "symbols": [{"literal":"="}]},
    {"name": "compare$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "compare$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "compare$subexpression$1$string$4", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "compare$subexpression$1", "symbols": ["compare$subexpression$1$string$4"]},
    {"name": "compare", "symbols": ["compare$subexpression$1"], "postprocess": (elems) => { return elems[0][0]; }},
    {"name": "operand$ebnf$1", "symbols": []},
    {"name": "operand$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "operand$ebnf$1$subexpression$1", "symbols": ["__", "operand$ebnf$1$subexpression$1$string$1", "__", "summand"]},
    {"name": "operand$ebnf$1", "symbols": ["operand$ebnf$1", "operand$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "operand", "symbols": ["summand", "operand$ebnf$1"], "postprocess": 
        (elems) => {
        	if (elems[1].length == 0) {
        		return elems[0]
        	}
        	return {
        		operand_1: elems[0],
        		operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
        	}
        }
        	},
    {"name": "summand$ebnf$1", "symbols": []},
    {"name": "summand$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "summand$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "summand$ebnf$1$subexpression$1", "symbols": ["__", "summand$ebnf$1$subexpression$1$subexpression$1", "__", "factor"]},
    {"name": "summand$ebnf$1", "symbols": ["summand$ebnf$1", "summand$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "summand", "symbols": ["factor", "summand$ebnf$1"], "postprocess": 
        (elems) => {
        	if (elems[1].length == 0) {
        		return elems[0]
        	}
        	return {
        		operand_1: elems[0],
        		operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
        	}
        }
        	},
    {"name": "factor$ebnf$1", "symbols": []},
    {"name": "factor$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "factor$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "factor$ebnf$1$subexpression$1", "symbols": ["__", "factor$ebnf$1$subexpression$1$subexpression$1", "__", "term"]},
    {"name": "factor$ebnf$1", "symbols": ["factor$ebnf$1", "factor$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "factor", "symbols": ["term", "factor$ebnf$1"], "postprocess": 
        (elems) => {
        	if (elems[1].length == 0) {
        		return elems[0]
        	}
        	return {
        		operand_1: elems[0],
        		operands: elems[1].map(subElements => ({ operator: subElements[1], operand: subElements[3] }))
        	}
        }
        	},
    {"name": "term", "symbols": ["value"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": ["bind_parameter"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": ["function"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": ["case"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": ["case_when"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": [{"literal":"("}, "_", "operand", "_", {"literal":")"}], "postprocess": (elems) => { return elems[2]; }},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1$subexpression$1", "symbols": [/[dD]/, /[iI]/, /[sS]/, /[tT]/, /[iI]/, /[nN]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1", "symbols": ["term$ebnf$1$subexpression$1$subexpression$1$subexpression$1"]},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1$subexpression$2", "symbols": [/[aA]/, /[lL]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "term$ebnf$1$subexpression$1$subexpression$1", "symbols": ["term$ebnf$1$subexpression$1$subexpression$1$subexpression$2"]},
    {"name": "term$ebnf$1$subexpression$1", "symbols": ["term$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "term$ebnf$1", "symbols": ["term$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "term$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "term", "symbols": ["term$ebnf$1", "column_ref"], "postprocess": 
        (elems) => {
        	return {
        		isDistinct: elems[0] != null ? elems[0][0][0].toLowerCase() === 'distinct': false,
        		column: elems[1]
        	};
        }
        	},
    {"name": "term", "symbols": ["row_value_constructor"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "term", "symbols": ["subquery"], "postprocess": (elems) => { return elems[0]; }},
    {"name": "value$subexpression$1", "symbols": ["type_numeric"]},
    {"name": "value$subexpression$1", "symbols": ["type_boolean"]},
    {"name": "value$subexpression$1", "symbols": ["type_null"]},
    {"name": "value$subexpression$1", "symbols": ["type_string"]},
    {"name": "value", "symbols": ["value$subexpression$1"], "postprocess": (elems) => { return elems[0][0]; }},
    {"name": "bind_parameter$subexpression$1", "symbols": [{"literal":"?"}, "number"]},
    {"name": "bind_parameter$subexpression$1", "symbols": [{"literal":"?"}, "name"]},
    {"name": "bind_parameter", "symbols": ["bind_parameter$subexpression$1"], "postprocess": 
        (elems) => ({ bindName: elems[0][1] })
            },
    {"name": "function$subexpression$1", "symbols": [/[cC]/, /[oO]/, /[uU]/, /[nN]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "function$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[dD]/, /[iI]/, /[sS]/, /[tT]/, /[iI]/, /[nN]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "function$ebnf$1$subexpression$1", "symbols": ["_", "function$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "function$ebnf$1", "symbols": ["function$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function$subexpression$2", "symbols": [{"literal":"*"}]},
    {"name": "function$subexpression$2", "symbols": ["term"]},
    {"name": "function", "symbols": ["function$subexpression$1", "_", {"literal":"("}, "function$ebnf$1", "function$subexpression$2", {"literal":")"}], "postprocess": 
        // TODO
        (elems) => ({ func: 'count', args: [ { isDistinct: elems[3] == null, column: elems[4][0] } ] })
            },
    {"name": "function$ebnf$2$subexpression$1", "symbols": ["_", "term"]},
    {"name": "function$ebnf$2", "symbols": ["function$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "function$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function$ebnf$3", "symbols": []},
    {"name": "function$ebnf$3$subexpression$1", "symbols": ["_", {"literal":","}, "_", "term"]},
    {"name": "function$ebnf$3", "symbols": ["function$ebnf$3", "function$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "function", "symbols": ["name", "_", {"literal":"("}, "function$ebnf$2", "function$ebnf$3", "_", {"literal":")"}], "postprocess": 
        (elems) => {
            if (elems[2] == null) {
                return { func: elems[0], args: [] }
            }
        
            return { func: elems[0], args: [elems[3][1], ...elems[4].map(subElems => subElems[3])] }
        }
            },
    {"name": "case$subexpression$1", "symbols": [/[cC]/, /[aA]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[wW]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$1$subexpression$1$subexpression$2", "symbols": [/[tT]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$1$subexpression$1", "symbols": ["__", "case$ebnf$1$subexpression$1$subexpression$1", "__", "expression", "__", "case$ebnf$1$subexpression$1$subexpression$2", "__", "term"]},
    {"name": "case$ebnf$1", "symbols": ["case$ebnf$1$subexpression$1"]},
    {"name": "case$ebnf$1$subexpression$2$subexpression$1", "symbols": [/[wW]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$1$subexpression$2$subexpression$2", "symbols": [/[tT]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$1$subexpression$2", "symbols": ["__", "case$ebnf$1$subexpression$2$subexpression$1", "__", "expression", "__", "case$ebnf$1$subexpression$2$subexpression$2", "__", "term"]},
    {"name": "case$ebnf$1", "symbols": ["case$ebnf$1", "case$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[eE]/, /[lL]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case$ebnf$2$subexpression$1", "symbols": ["__", "case$ebnf$2$subexpression$1$subexpression$1", "__", "term"]},
    {"name": "case$ebnf$2", "symbols": ["case$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case$subexpression$2", "symbols": [/[eE]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case", "symbols": ["case$subexpression$1", "__", "term", "case$ebnf$1", "case$ebnf$2", "__", "case$subexpression$2"], "postprocess": 
        (elems) => {
            // TODO
            return { case: elems[2], when: elems[3], else: elems[4] }
        }
            },
    {"name": "case_when$subexpression$1", "symbols": [/[cC]/, /[aA]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$1$subexpression$1$subexpression$1", "symbols": [/[wW]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$1$subexpression$1$subexpression$2", "symbols": [/[tT]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$1$subexpression$1", "symbols": ["__", "case_when$ebnf$1$subexpression$1$subexpression$1", "__", "expression", "__", "case_when$ebnf$1$subexpression$1$subexpression$2", "__", "term"]},
    {"name": "case_when$ebnf$1", "symbols": ["case_when$ebnf$1$subexpression$1"]},
    {"name": "case_when$ebnf$1$subexpression$2$subexpression$1", "symbols": [/[wW]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$1$subexpression$2$subexpression$2", "symbols": [/[tT]/, /[hH]/, /[eE]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$1$subexpression$2", "symbols": ["__", "case_when$ebnf$1$subexpression$2$subexpression$1", "__", "expression", "__", "case_when$ebnf$1$subexpression$2$subexpression$2", "__", "term"]},
    {"name": "case_when$ebnf$1", "symbols": ["case_when$ebnf$1", "case_when$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "case_when$ebnf$2$subexpression$1$subexpression$1", "symbols": [/[eE]/, /[lL]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when$ebnf$2$subexpression$1", "symbols": ["__", "case_when$ebnf$2$subexpression$1$subexpression$1", "__", "term"]},
    {"name": "case_when$ebnf$2", "symbols": ["case_when$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_when$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_when$subexpression$2", "symbols": [/[eE]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "case_when", "symbols": ["case_when$subexpression$1", "case_when$ebnf$1", "case_when$ebnf$2", "__", "case_when$subexpression$2"], "postprocess": 
        (elems) => {
            // TODO
            return { when: elems[1], else: elems[2] }
        }
            },
    {"name": "row_value_constructor$subexpression$1", "symbols": ["_", "term"]},
    {"name": "row_value_constructor$ebnf$1", "symbols": []},
    {"name": "row_value_constructor$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "term"]},
    {"name": "row_value_constructor$ebnf$1", "symbols": ["row_value_constructor$ebnf$1", "row_value_constructor$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "row_value_constructor", "symbols": [{"literal":"("}, "row_value_constructor$subexpression$1", "row_value_constructor$ebnf$1", "_", {"literal":")"}], "postprocess": 
        (elems) => ([elems[1][1], ...elems[2].map(subElements => subElements[3])])
            },
    {"name": "subquery$string$1", "symbols": [{"literal":"{"}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "subquery$string$2", "symbols": [{"literal":"}"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "subquery", "symbols": ["subquery$string$1", "_", "query", "_", "subquery$string$2"], "postprocess": 
        (elems) => (elems[2])
            },
    {"name": "name$ebnf$1", "symbols": []},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": [/[a-zA-Z_]/, "name$ebnf$1"], "postprocess": (elems) => ([elems[0], ...elems[1]].join(""))},
    {"name": "name", "symbols": ["quoted_name"], "postprocess": (elems) => (elems[0])},
    {"name": "quoted_name", "symbols": ["dqstring"], "postprocess": (elems) => (elems[0])},
    {"name": "type_null$subexpression$1", "symbols": [/[nN]/, /[uU]/, /[lL]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_null", "symbols": ["type_null$subexpression$1"], "postprocess": (elems) => (null)},
    {"name": "type_boolean$subexpression$1$subexpression$1", "symbols": [/[tT]/, /[rR]/, /[uU]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_boolean$subexpression$1", "symbols": ["type_boolean$subexpression$1$subexpression$1"]},
    {"name": "type_boolean$subexpression$1$subexpression$2", "symbols": [/[fF]/, /[aA]/, /[lL]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "type_boolean$subexpression$1", "symbols": ["type_boolean$subexpression$1$subexpression$2"]},
    {"name": "type_boolean", "symbols": ["type_boolean$subexpression$1"], "postprocess": (elems) => (elems[0][0].toLowerCase() === "true")},
    {"name": "type_numeric$subexpression$1", "symbols": ["type_int"]},
    {"name": "type_numeric$subexpression$1", "symbols": ["type_decimal"]},
    {"name": "type_numeric", "symbols": ["type_numeric$subexpression$1"], "postprocess": (elems) => (elems[0][0])},
    {"name": "type_int$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "type_int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_int", "symbols": ["type_int$ebnf$1", "number"], "postprocess": (elems) => (JSON.parse(elems.join("")))},
    {"name": "type_decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "type_decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type_decimal", "symbols": ["type_decimal$ebnf$1", "number", {"literal":"."}, "number"], "postprocess": (elems) => (JSON.parse(elems.join("")))},
    {"name": "type_string", "symbols": ["sqstring"], "postprocess": (elems) => (elems[0])},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": (elems) => (elems[0].join(""))},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) { return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) { return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) { return JSON.parse("\"" + d.join("") + "\""); }
            },
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": 
        function(d) { return "'"; }
            },
    {"name": "strescape", "symbols": [/["\\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
            },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
