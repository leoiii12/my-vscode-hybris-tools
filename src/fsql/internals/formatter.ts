export class Formatter {
  static NL = '\n'

  /**
   * Num of Indentations
   */
  private noi = 0

  public getFormattedFsql(query: any) {
    let str = ''

    str += this.gs(this.noi) + 'SELECT' + Formatter.NL

    this.noi += 2
    str += `${this.aa(query['select'], ',' + Formatter.NL)}` + Formatter.NL
    this.noi -= 2

    str += this.gs(this.noi) + `FROM` + Formatter.NL
    this.noi += 2
    str += `${this.aa(query['from'], ',' + Formatter.NL)}`
    this.noi -= 2

    if (query['where']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `WHERE` + Formatter.NL
      this.noi += 2
      str += this.gs(this.noi) + `${this.ao(query['where'])}`
      this.noi -= 2
    }
    if (query['groupBy']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `GROUP BY` + Formatter.NL
      this.noi += 2
      str += `${this.ao(query['groupBy'])}`
      this.noi -= 2
    }
    if (query['orderBy']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `ORDER BY` + Formatter.NL
      this.noi += 2
      str += `${query['orderBy'].map((oe: any) => this.ao(oe)).join(',\n')}`
      this.noi -= 2
    }
    if (query['union']) {
      str += Formatter.NL
      str +=
        this.gs(this.noi) +
        `UNION` +
        (query['union']['isAll'] ? ' ALL' : '') +
        Formatter.NL
      this.noi += 2
      str += `${this.getFormattedFsql(query['union']['query'])}`
      this.noi -= 2
    }
    if (query['except']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `EXCEPT` + Formatter.NL
      this.noi += 2
      str += `${this.getFormattedFsql(query['except']['query'])}`
      this.noi -= 2
    }
    if (query['minus']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `MINUS` + Formatter.NL
      this.noi += 2
      str += `${this.getFormattedFsql(query['minus']['minus'])}`
      this.noi -= 2
    }
    if (query['intersect']) {
      str += Formatter.NL
      str += this.gs(this.noi) + `INTERSECT` + Formatter.NL
      this.noi += 2
      str += `${this.getFormattedFsql(query['intersect']['query'])}`
      this.noi -= 2
    }

    return str
  }

  public aa(elems: any[], separator?: string): string {
    if (separator === undefined) {
      return elems.map(elem => this.ao(elem)).join(', ')
    }

    return elems.map(elem => this.ao(elem)).join(separator)
  }

  public gs(numOfSpaces: number): string {
    let str = ''
    for (let i = 0; i < numOfSpaces; i++) {
      str += ' '
    }
    return str
  }

  public ao(obj: any): string {
    if (obj !== null && typeof obj === 'object' && 'type' in obj) {
      switch (obj['type']) {
        case 'true':
        case 'false':
        case 'null':
          return obj['value'].toUpperCase()

        case 'asc':
        case 'desc':
        case 'nulls':
        case 'first':
        case 'last':
          return obj['value']

        case 'select_expression': {
          let str = ''
          if ('tableAlias' in obj) {
            str += `${obj['tableAlias']}.${obj['column']}`
          } else if ('typeAlias' in obj) {
            str += `{ ${obj['typeAlias']}.${obj['column']} }`
          } else if ('term' in obj && 'as' in obj && obj['as'] !== null) {
            str += `${this.ao(obj['term'])} AS ${this.ao(obj['as'])}`
          } else if ('term' in obj) {
            str += `${this.ao(obj['term'])}`
          } else if ('column' in obj) {
            str += `${obj['column']}`
          } else {
            console.log('Uncaught select_expression')
          }

          return this.gs(this.noi) + `${str}`
        }

        case 'table_expression': {
          let str = ''
          if ('subquery' in obj && 'as' in obj) {
            str = `(${this.ao(obj['subquery'])}) AS ${this.ao(obj['as'])}`
          } else if ('subquery' in obj) {
            str = `(${this.ao(obj['subquery'])})`
          } else if ('types' in obj) {
            str = `${this.ao(obj['types'])}`
          } else {
            console.log('Uncaught table_expression')
          }

          return this.gs(this.noi) + `${str}`
        }

        case 'group_by':
          const columns = obj['columns'] ? this.aa(obj['columns']) : ''
          const having = obj['having']
            ? ` HAVING ${this.ao(obj['having'])}`
            : ''
          return this.gs(this.noi) + `${columns}${having}`

        case 'order_expression':
          const colPart = this.ao(obj['column'])
          const ascDescPart =
            obj['ascDesc'] === null ? '' : ` ${obj['ascDesc']}`
          const nullsPart =
            obj['nullsFirstLast'] === null
              ? ''
              : ` NULLS ${obj['nullsFirstLast']}`

          return this.gs(this.noi) + `${colPart}${ascDescPart}${nullsPart}`

        case 'htype':
          if ('htypeJoin' in obj) {
            let str = ''

            str += `{` + Formatter.NL

            this.noi += 2
            str += this.gs(this.noi) + `${this.ao(obj['htype'])}` + Formatter.NL
            str += `${this.aa(obj['htypeJoin'], Formatter.NL)}` + Formatter.NL
            this.noi -= 2

            str += this.gs(this.noi) + `}`

            return str
          } else if ('htype' in obj) {
            return `{ ${this.ao(obj['htype'])} }`
          }
          break
        case 'htype_join':
          return (
            '' +
            this.gs(this.noi) +
            (obj['isLeft'] ? 'LEFT ' : '') +
            `JOIN ${this.ao(obj['htype'])} ON ${this.ao(obj['on'])}`
          )
        case 'single_type_clause':
          return (
            '' +
            `${obj['typeName']}${obj['isSolid'] ? '!' : ''}` +
            (obj['as'] ? ` AS ${obj['as']}` : '')
          )

        case 'or_condition': {
          let str = ''

          str += `(` + Formatter.NL
          this.noi += 2

          str +=
            this.gs(this.noi) + `${this.ao(obj['operands'][0])}` + Formatter.NL
          for (let i = 1; i < obj['operands'].length; i++) {
            str +=
              this.gs(this.noi) +
              `OR ${this.ao(obj['operands'][i])}` +
              Formatter.NL
          }

          this.noi -= 2
          str += this.gs(this.noi) + `)`

          return str
        }
        case 'and_condition': {
          let str = ''

          str += `(` + Formatter.NL
          this.noi += 2
          str +=
            this.gs(this.noi) + `${this.ao(obj['operands'][0])}` + Formatter.NL
          for (let i = 1; i < obj['operands'].length; i++) {
            str +=
              this.gs(this.noi) +
              `AND ${this.ao(obj['operands'][i])}` +
              Formatter.NL
          }
          this.noi -= 2
          str += this.gs(this.noi) + `)`

          return str
        }
        case 'condition': {
          let str = ''

          if (obj['expression'] && obj['isNot']) {
            str += `NOT (${this.ao(obj['expression'])})`
          } else if (obj['expression']) {
            str += `${this.ao(obj['expression'])}`
          } else if ('operand_1' in obj && 'operand_2' in obj) {
            str += `${this.ao(obj['operand_1'])} `
            str += `${obj['comparator']} `
            str += `${this.ao(obj['operand_2'])}`
          } else {
            str += `${this.ao(obj['comparator'])} ${this.ao(obj['operand_1'])}`
          }

          return str
        }

        case 'column_ref': {
          let str = ''

          if (obj['isDistinct'] === true) {
            str += `DISTINCT `
          }

          if ('tableAlias' in obj) {
            str += `${this.ao(obj['tableAlias'])}.${this.ao(obj['column'])}`
          } else if ('typeAlias' in obj) {
            const typeAliasPart = obj['typeAlias'] ? `${obj['typeAlias']}.` : ''
            const attrPart = `${obj['attribute']}`
            const langPart = obj['language'] ? `[${obj['language']}]` : ''
            const modPart = obj['modifiers'] ? `:${obj['modifiers']}` : ''

            str += `{ ${typeAliasPart}${attrPart}${langPart}${modPart} }`
          } else if ('column' in obj) {
            str += `${this.ao(obj['column'])}`
          } else {
            console.log('Uncaught column_ref')
          }
          return str
        }

        case 'or_operand':
        case 'pm_operand':
        case 'to_operand': {
          let str = ''

          str += `(` + Formatter.NL

          this.noi += 2
          str +=
            this.gs(this.noi) + `${this.ao(obj['operand_1'])}` + Formatter.NL
          for (const operand of obj['operands']) {
            str +=
              this.gs(this.noi) +
              `${this.ao(operand['operator'])} ${this.ao(operand['operand'])}` +
              Formatter.NL
          }
          this.noi -= 2

          str += this.gs(this.noi) + `)`

          return str
        }

        case 'bind_parameter':
          return `?${obj['parameter_name']}`
        case 'function':
          const func = obj['function']
          const args = obj['args']
          if (func.toString() === 'COUNT_S') {
            let str = ''
            str += `${this.ao(func)}`
            str += `(`
            str += `${obj['args'][0] ? 'DISTINCT ' : ''}`
            str += `*`
            str += `)`

            return str
          }

          return `${this.ao(func)}(${this.aa(args)})`
        case 'case': {
          let str = ''

          str += `CASE ${this.ao(obj['case'])}` + Formatter.NL

          this.noi += 2
          for (const whenExp of obj['when']) {
            str +=
              this.gs(this.noi) +
              `WHEN ${this.ao(whenExp['when'])} THEN ${this.ao(
                whenExp['then'],
              )}` +
              Formatter.NL
          }
          if (obj['else'] !== null) {
            str +=
              this.gs(this.noi) + `ELSE ${this.ao(obj['else'])}` + Formatter.NL
          }
          this.noi -= 2

          str += this.gs(this.noi) + `END`

          return str
        }
        case 'case_when': {
          let str = ''

          str += `CASE` + Formatter.NL

          this.noi += 2
          for (const whenExp of obj['when']) {
            str +=
              this.gs(this.noi) +
              `WHEN ${this.ao(whenExp['when'])} THEN ${this.ao(
                whenExp['then'],
              )}` +
              Formatter.NL
          }
          if (obj['else'] !== null) {
            str +=
              this.gs(this.noi) + `ELSE ${this.ao(obj['else'])}` + Formatter.NL
          }
          this.noi -= 2

          str += this.gs(this.noi) + `END`

          return str
        }
        case 'row_value_constructor': {
          return `(${this.aa(obj['terms'])})`
        }
        case 'subquery': {
          let str = ''

          str += `{{` + Formatter.NL
          this.noi += 2
          str += `${this.getFormattedFsql(obj['query'])}`
          this.noi -= 2
          str += Formatter.NL + this.gs(this.noi) + `}}`

          return str
        }

        case 'quoted_identifier':
          return obj['value']
        case 'string_literal':
        case 'identifier':
          return obj['value']

        case 'plus':
        case 'minus':
        case 'times':
        case 'obelus':
          return `${obj['value']}`

        default:
          console.log(`This type is not supported.`)
          console.log(obj)
          console.log(JSON.stringify(obj))
          console.log()
      }
    } else if (typeof obj === 'number') {
      return `${obj}`
    } else if (typeof obj === 'boolean') {
      return `${obj}`
    } else if (typeof obj === 'string') {
      return obj
    } else {
      console.log(`The type does not exist.`)
      console.log(obj)
      console.log(JSON.stringify(obj))
      console.log()
    }

    return 'undefined'
  }
}
