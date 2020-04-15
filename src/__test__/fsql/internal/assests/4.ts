export const kase = `
SELECT INNERTABLE.PK, INNERTABLE.CatCode FROM
(
   {{
      SELECT {p:PK} AS PK, {c:code} AS CatCode FROM
      {
         Product as p JOIN CategoryProductRelation as rel
         ON {p:PK} = {rel:target}
         JOIN Category AS c
         ON {rel:source} = {c:PK}
      }
   }}
) INNERTABLE
**
SELECT
  INNERTABLE.PK,
  INNERTABLE.CatCode
FROM
  ({{
    SELECT
      {p.PK} AS PK,
      {c.code} AS CatCode
    FROM
      {
        Product AS p
        JOIN CategoryProductRelation AS rel ON {p.PK} = {rel.target}
        JOIN Category AS c ON {rel.source} = {c.PK}
      }
  }}) AS INNERTABLE
`
