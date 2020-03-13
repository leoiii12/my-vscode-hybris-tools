export const kase = `
SELECT {p:PK}
   FROM {Product AS p}
   WHERE {p:description[de]} 
      LIKE 
         CONCAT(
            '%', 
            CONCAT(
               'myProduct',
               '%'
            )
         ) 
   OR {p:description[en]} 
      LIKE
         CONCAT(
            '%',
            CONCAT(
               'myProduct',
               '%'
            )
         )
   ORDER BY {p:code} ASC
**
SELECT
  {p.PK}
FROM
  { Product AS p }
WHERE
  (
    {p.description[de]} LIKE CONCAT('%', CONCAT('myProduct', '%'))
    OR {p.description[en]} LIKE CONCAT('%', CONCAT('myProduct', '%'))
  )
ORDER BY
  {p.code} ASC
`
