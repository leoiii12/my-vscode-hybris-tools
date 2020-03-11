export const kase = `
SELECT AVG(torderentries.totprice), AVG(torderentries.totquantity)
	FROM (
	{{ 
		SELECT SUM({totalPrice}) AS totprice, SUM({quantity}) AS totquantity FROM {OrderEntry} 
			WHERE {creationtime} >= ?startDate AND {creationtime} < ?endDate GROUP BY {order}
	}} 
  ) AS torderentries
**
SELECT
  AVG(torderentries.totprice),
  AVG(torderentries.totquantity)
FROM
  ({{
    SELECT
      SUM({ totalPrice }) AS totprice,
      SUM({ quantity }) AS totquantity
    FROM
      { OrderEntry }
    WHERE
      (
        { creationtime } >= ?startDate
        AND { creationtime } < ?endDate
      )
    GROUP BY
      { order }
  }}) AS torderentries
`
