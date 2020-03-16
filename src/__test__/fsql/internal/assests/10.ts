export const kase = `
SELECT
{p.profileCode},
CAST({p.excludeProductPrefix} AS CHAR(100000) CHARACTER SET UTF8)
FROM
{
HktvProductDataFeedProfile AS p
}
**
SELECT
  {p.profileCode},
  CAST({p.excludeProductPrefix} AS CHAR(100000) CHARACTER SET UTF8)
FROM
  { HktvProductDataFeedProfile AS p }
`
