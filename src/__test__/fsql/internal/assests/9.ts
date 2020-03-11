export const kase = `
SELECT
{ o :pk } as orderPk
FROM
{ ConsignmentRefundRecord AS crr
JOIN Consignment AS c on { c.pk } = { crr.consignment }
JOIN SubOrder AS so on { so.pk } = { c.order }
JOIN Order AS o on { o.pk } = { so.parentOrder }
JOIN PaymentTransaction AS pt on { o.pk } = { pt.order } }
WHERE
{ pt.paymentGateway } = 'payme'
AND (
  { crr :refundAmtByCC } > 0
  OR { crr :refundDeliveryAmt } > 0
)
AND DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) <= DATE({ crr :creationtime })
AND DATE(NOW()) <> DATE({ crr :creationtime })
AND { crr.refundFailedPromotion } IS NOT TRUE
GROUP BY
orderPk
**
SELECT
  { o:pk } AS orderPk
FROM
  {
    ConsignmentRefundRecord AS crr
    JOIN Consignment AS c ON { c:pk } = { crr:consignment }
    JOIN SubOrder AS so ON { so:pk } = { c:order }
    JOIN Order AS o ON { o:pk } = { so:parentOrder }
    JOIN PaymentTransaction AS pt ON { o:pk } = { pt:order }
  }
WHERE
  (
    { pt:paymentGateway } = 'payme'
    AND (
      { crr:refundAmtByCC } > 0
      OR { crr:refundDeliveryAmt } > 0
    )
    AND DATE(DATE_SUB(NOW(), INTERVAL 1 DAY)) <= DATE({ crr:creationtime })
    AND DATE(NOW()) <> DATE({ crr:creationtime })
    AND { crr:refundFailedPromotion } IS NOT TRUE
  )
GROUP BY
  orderPk
`
