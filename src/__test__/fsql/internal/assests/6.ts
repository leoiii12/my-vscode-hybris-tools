export const kase = `
SELECT
  a.*,
  { a.* },
  a.asfasfsa,
  { aasf.bac },
  DISTINCT { hvp.pk },
  ifnull({ hvp.b }, '') AS variantNameEn,
  {{
    SELECT
      { a }
    FROM
      { a }
  }} AS b,
  ifnull(
    DATE_FORMAT({ hvp.creationTime }, '%Y-%m-%d %H:%i:%S'),
    ''
  ) AS creationTime,
  ifnull({ hvp.name [en].c }, '') as variantNameEn,
  (
    round(ifnull({ originalOrderEntry.basePrice }, 120), 123.2) * -1123
  ),
  CASE
    WHEN { CNT.a } = 10 THEN 'Low'
    WHEN { CNT.a } = 12 THEN 'High'
    ELSE 'High'
  END,
  {{
    select
      group_concat(distinct { cat :code } SEPARATOR ' ')
    from
      { HktvProduct as p
      join CategoryProductRelation as cpr on { cpr :target } = { p :pk }
      join Category as cat on { cat :pk } = { cpr :source }
      left join CategoryCategoryRelation as ccr on { ccr :target } = { cat :pk }
      left join Category as superCat on { superCat :pk } = { ccr :source } }
    where
      { p :pk } = { product :baseproduct }
      and (
        { cat :isBrand } is null
        or { cat :isBrand } = false
      )
      and upper({ superCat :code }) not like upper('%promo%')
      and substring({ cat :code }, 1124, 112312) <> '_'
      and substring({ cat :code }, 1124, 112312) LIKE 'abc%'
  }},
  COUNT(DISTINCT *)
FROM
  { HktvVariantProduct AS a }
WHERE
  { Store } IS NOT NULL
GROUP BY
  { Store }
HAVING
  { a } = ''
  AND (
    { b } = 1
    OR { c } = 2
  )
  AND { b } = ?13
  AND { b } = ?abs
ORDER BY
  { a.Store } DESC NULLS FIRST,
  { b.Store } DESC
UNION ALL
SELECT
  { p }
FROM
  { HktvProduct }
**
SELECT
  a.*,
  {a.*},
  a.asfasfsa,
  {aasf.bac},
  DISTINCT {hvp.pk},
  ifnull({hvp.b}, '') AS variantNameEn,
  ({{
    SELECT
      {a}
    FROM
      { a }
  }}) AS b,
  ifnull(DATE_FORMAT({hvp.creationTime}, '%Y-%m-%d %H:%i:%S'), '') AS creationTime,
  ifnull({hvp.name[en]:c}, '') AS variantNameEn,
  (
    round(ifnull({originalOrderEntry.basePrice}, 120), 123.2)
    * -1123
  ),
  CASE
    WHEN {CNT.a} = 10 THEN 'Low'
    WHEN {CNT.a} = 12 THEN 'High'
    ELSE 'High'
  END,
  ({{
    SELECT
      GROUP_CONCAT(DISTINCT {cat.code} SEPARATOR ' ')
    FROM
      {
        HktvProduct AS p
        JOIN CategoryProductRelation AS cpr ON {cpr.target} = {p.pk}
        JOIN Category AS cat ON {cat.pk} = {cpr.source}
        LEFT JOIN CategoryCategoryRelation AS ccr ON {ccr.target} = {cat.pk}
        LEFT JOIN Category AS superCat ON {superCat.pk} = {ccr.source}
      }
    WHERE
      (
        {p.pk} = {product.baseproduct}
        AND (
          {cat.isBrand} IS NULL
          OR {cat.isBrand} = FALSE
        )
        AND upper({superCat.code}) NOT LIKE upper('%promo%')
        AND substring({cat.code}, 1124, 112312) <> '_'
        AND substring({cat.code}, 1124, 112312) LIKE 'abc%'
      )
  }}),
  COUNT(DISTINCT *)
FROM
  { HktvVariantProduct AS a }
WHERE
  {Store} IS NOT NULL
GROUP BY
  {Store} HAVING (
    {a} = ''
    AND (
      {b} = 1
      OR {c} = 2
    )
    AND {b} = ?13
    AND {b} = ?abs
  )
ORDER BY
  {a.Store} DESC NULLS FIRST,
  {b.Store} DESC
UNION ALL
  SELECT
    {p}
  FROM
    { HktvProduct }
`
