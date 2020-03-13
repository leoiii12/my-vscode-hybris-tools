export const kase = `
SELECT {c:name[en]} AS Name, {c:code} AS Code,
(
   CASE
      WHEN COUNT(DISTINCT{superCategory:PK}) <= 0
      THEN 'root category'
      ELSE 'normal category'
   END
) as TYPE,
COUNT(DISTINCT{superCategory:PK}) AS SuperCategories
FROM
{
   Category as c LEFT JOIN CategoryCategoryRelation as rel
   ON {c:PK} = {rel:target}
   LEFT JOIN Category AS superCategory
   ON {rel:source} = {superCategory:PK}
}
GROUP BY {c:PK}, {c:code}, {c:name[en]}
**
SELECT
  {c.name[en]} AS Name,
  {c.code} AS Code,
  CASE
    WHEN COUNT(DISTINCT {superCategory.PK}) <= 0 THEN 'root category'
    ELSE 'normal category'
  END AS TYPE,
  COUNT(DISTINCT {superCategory.PK}) AS SuperCategories
FROM
  {
    Category AS c
    LEFT JOIN CategoryCategoryRelation AS rel ON {c.PK} = {rel.target}
    LEFT JOIN Category AS superCategory ON {rel.source} = {superCategory.PK}
  }
GROUP BY
  {c.PK}, {c.code}, {c.name[en]}
`
