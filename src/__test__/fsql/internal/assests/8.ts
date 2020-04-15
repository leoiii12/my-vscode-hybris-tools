export const kase = `
SELECT * FROM {Order! AS o} 
WHERE {o.creationTime} BETWEEN (CURRENT_DATE() - INTERVAL 1 YEAR) AND (CURRENT_DATE() - INTERVAL 90 DAY) 
**
SELECT
  *
FROM
  { Order! AS o }
WHERE
  {o.creationTime} BETWEEN (
    CURRENT_DATE()
    - INTERVAL 1 YEAR
  ) AND (
    CURRENT_DATE()
    - INTERVAL 90 DAY
  ) 
`
