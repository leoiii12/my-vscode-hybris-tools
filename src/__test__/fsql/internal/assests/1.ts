export const kase = `
SELECT DISTINCT {p:PK}, {p:name}, {p:code}
   FROM {Product AS p}
   WHERE {p:PK} IN
   (
      {{
         -- subselect 1
         SELECT {dr:product}
            FROM {DiscountRow AS dr}
      }}
   )
   OR {p:PK} IN
   (
      {{
         -- subselect 2
         SELECT {prod:PK} 
            FROM
               {
                  Product AS prod
                     LEFT JOIN DiscountRow AS dr
                     ON {prod:Europe1PriceFactory_PDG} = {dr:pg}
               }
            WHERE {prod:Europe1PriceFactory_PDG} IS NOT NULL }}
   )
   ORDER BY {p:name} ASC, {p:code} ASC
**
SELECT
  DISTINCT { p:PK },
  { p:name },
  { p:code }
FROM
  { Product AS p }
WHERE
  (
    { p:PK } IN ({{
      SELECT
        { dr:product }
      FROM
        { DiscountRow AS dr }
    }})
    OR { p:PK } IN ({{
      SELECT
        { prod:PK }
      FROM
        {
          Product AS prod
          LEFT JOIN DiscountRow AS dr ON { prod:Europe1PriceFactory_PDG } = { dr:pg }
        }
      WHERE
        { prod:Europe1PriceFactory_PDG } IS NOT NULL
    }})
  )
ORDER BY
  { p:name } ASC,
  { p:code } ASC
`
