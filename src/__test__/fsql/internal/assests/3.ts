export const kase = `
SELECT {p:PK}, {c:code} FROM
{
   Product as p JOIN CategoryProductRelation as rel
   ON {p:PK} = {rel:target}
   JOIN Category AS c
   ON {rel:source} = {c:PK}
}
**
SELECT
  {p.PK},
  {c.code}
FROM
  {
    Product AS p
    JOIN CategoryProductRelation AS rel ON {p.PK} = {rel.target}
    JOIN Category AS c ON {rel.source} = {c.PK}
  }
`
