export const kase = `
select
  { so.user },
  { so.code },
  { product.merchantProductID },
  (
    {{
      select
        group_concat(distinct { cat :code })
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
        and substring({ cat :code }, 1, 1) <> '_'
    }}
  ),
  substring({ product.code }, 12),
  replace({ product.name [en] :o }, '"', ''),
  replace({ product.name [zh] :o }, '"', ''),
  hktvReturnRequestTable.requestCode,
  hktvReturnRequestTable.rWaybill,
  hktvReturnRequestTable.pickupDateTime,
  hktvReturnRequestTable.returnStatus entryStatusCode,
  hktvReturnRequestTable.returnReason entryReturnReason,
  hktvReturnRequestTable.expectedQuantity entryExpectedQuantity,
  round(
    ifnull({ originalConsignmentEntry.shippedQuantity }, 0),
    2
  ),
  (
    round(ifnull({ originalOrderEntry.basePrice }, 0), 2) * -1
  ),
  (
    round(
      (
        (
          ifnull({ originalOrderEntry.totalPrice }, 0) / ifnull({ originalOrderEntry.quantity }, 0)
        ) * ifnull({ originalConsignmentEntry.shippedQuantity }, 0)
      ),
      2
    ) * -1
  ),
  { originalConsignmentStatus.code },
  DATE_FORMAT(
    { originalConsignment.modifiedtime },
    '%Y-%m-%d %H:%i:%s'
  ),
  { originalConsignmentEntry.pk },
  { originalConsignment.code },
  { originalConsignment.trackingID },
  CASE
    WHEN { po.posOrderNumber } IS NOT NULL THEN CONCAT('#', { po.posOrderNumber })
    ELSE ''
  END AS posOrderNumber,
  DATE_FORMAT(
    hktvReturnRequestTable.modifiedtime,
    '%Y-%m-%d %H:%i:%s'
  ) AS modified_date,
  CASE
    WHEN hktvReturnRequestTable.returnStatus = 'ACCEPTED_BY_MERCHANT' THEN 'MERCHANT'
    WHEN hktvReturnRequestTable.returnStatus = 'ACCEPTED_BY_HKTV' THEN 'HKTV'
    ELSE 'null'
  END AS accepted_by,
  hktvReturnRequestTable.refundAmtByCC,
  hktvReturnRequestTable.refundAmtByMallDollar,
  IFNULL({ bpvp.code }, '') as "bundle_set",
  hktvReturnRequestTable.refundAmtByCoupon,
  DATE_FORMAT(
    hktvReturnRequestTable.acceptedTime,
    '%Y-%m-%d %H:%i:%s'
  ) AS accepted_time,
  hktvReturnRequestTable.refundValue
from
  (
    {{
      select
        *
      from
        (
          {{
            select
              { pk },
              { code } requestCode,
              { parentRequest } parentRequest,
              { ct1.code } typeCode,
              { refundMethod.code } refundMethodCode,
              { ore.code } requestStatus,
              { hktvReturnRequest.returnWaybillNumber } rWaybill,
              { hktvReturnRequest.pickupDateTime } pickupDateTime,
              { r.modifiedtime } modifiedtime,
              { HktvRefundEntry.originalConsignmentEntry } originalConsignmentEntryPk,
              { HktvRefundEntry.reportReason } reportReasonPk,
              { HKTVReturnEntryReturnStatus.code } returnStatus,
              { HktvRefundEntry.expectedQuantity } expectedQuantity,
              { HktvRefundEntry.returnReason } returnReason,
              { HktvRefundEntry.refundAmtByCC } as refundAmtByCC,
              (
                { HktvRefundEntry.refundAmtByCredit } + { HktvRefundEntry.refundAmtByPaidVoucher } + { HktvRefundEntry.refundCCAmtByCredit }
              ) as refundAmtByMallDollar,
              { HktvRefundEntry.refundAmtByCoupon } as refundAmtByCoupon,
              { HktvRefundEntry.acceptedTime } as acceptedTime,
              { HktvRefundEntry.refundValue } as refundValue
            from
              { hktvRefundRequest ! as r
              left join ComposedType AS ct1 ON { r.itemType } = { ct1.pk }
              left join RefundMethod as refundMethod on { r.refundMethod } = { refundMethod.pk }
              left join OrderReturnEntryStatus as ore on { r.returnStatus } = { ore.pk }
              left join hktvReturnRequest as hktvReturnRequest on { r.siblingReturnRequest } = { hktvReturnRequest.pk }
              left join HktvRefundEntry as HktvRefundEntry on { HktvRefundEntry.returnRequest } = { r.pk }
              left join returnStatus as HKTVReturnEntryReturnStatus on { HktvRefundEntry.status } = { HKTVReturnEntryReturnStatus.pk } }
          }}
        ) y
      union all
      select
        *
      from
        (
          {{
            select
              { pk },
              { code } requestCode,
              { parentRequest } parentRequest,
              { ct1.code } typeCode,
              { refundMethod.code } refundMethodCode,
              { ore.code } requestStatus,
              { hktvReturnRequest.returnWaybillNumber } rWaybill,
              { hktvReturnRequest.pickupDateTime } pickupDateTime,
              { r.modifiedtime } modifiedtime,
              { HktvReplacementEntry.originalConsignmentEntry } originalConsignmentEntryPk,
              { HktvReplacementEntry.reportReason } reportReasonPk,
              { HKTVReturnEntryReturnStatus.code } returnStatus,
              { HktvReplacementEntry.expectedQuantity } expectedQuantity,
              { HktvReplacementEntry.returnReason } returnReason,
              0 as refundAmtByCC,
              0 as refundAmtByMallDollar,
              0 as refundAmtByCoupon,
              { HktvReplacementEntry.acceptedTime } acceptedTime,
              { HktvReplacementEntry.refundValue } as refundValue
            from
              { hktvReplacementRequest ! as r
              left join ComposedType AS ct1 ON { r.itemType } = { ct1.pk }
              left join RefundMethod as refundMethod on { r.refundMethod } = { refundMethod.pk }
              left join OrderReturnEntryStatus as ore on { r.returnStatus } = { ore.pk }
              left join hktvReturnRequest as hktvReturnRequest on { r.siblingReturnRequest } = { hktvReturnRequest.pk }
              left join HktvReplacementEntry as HktvReplacementEntry on { HktvReplacementEntry.returnRequest } = { r.pk }
              left join returnStatus as HKTVReturnEntryReturnStatus on { HktvReplacementEntry.status } = { HKTVReturnEntryReturnStatus.pk } }
          }}
        ) z
    }}
  ) AS hktvReturnRequestTable,
  { consignmentEntry as originalConsignmentEntry
  left join Consignment as originalConsignment on { originalConsignmentEntry.consignment } = { originalConsignment.pk }
  left join orderEntry as originalOrderEntry on { originalConsignmentEntry.orderEntry } = { originalOrderEntry.pk }
  left join hktvVariantProduct as product on { originalOrderEntry.product } = { product.pk }
  left join ConsignmentStatus as originalConsignmentStatus on { originalConsignmentStatus :pk } = { originalConsignment.status }
  join SubOrder ! as so on { so.pk } = { originalOrderEntry.order }
  left join Order ! as po on { po.pk } = { so.parentOrder }
  LEFT JOIN OrderEntry AS poe ON { poe.order } = { po.pk }
  AND { poe.entryNumber } = { originalOrderEntry.entryNumber }
  LEFT JOIN OrderEntry AS bpoe ON { bpoe.pk } = { poe.bundleParentEntry }
  LEFT JOIN HktvVariantProduct AS bpvp ON { bpvp.pk } = { bpoe.product } }
WHERE
  1 = 1
  and hktvReturnRequestTable.originalConsignmentEntryPk = { originalConsignmentEntry.pk }
  and { po.replenishmentOrderStore } is null
  and hktvReturnRequestTable.returnStatus NOT IN ('NEW')
  and hktvReturnRequestTable.acceptedTime >= ?startDate
  and 1 = 1
**
SELECT
  { so:user },
  { so:code },
  { product:merchantProductID },
  ({{
    SELECT
      GROUP_CONCAT(DISTINCT { cat:code })
    FROM
      {
        HktvProduct AS p
        JOIN CategoryProductRelation AS cpr ON { cpr:target } = { p:pk }
        JOIN Category AS cat ON { cat:pk } = { cpr:source }
        LEFT JOIN CategoryCategoryRelation AS ccr ON { ccr:target } = { cat:pk }
        LEFT JOIN Category AS superCat ON { superCat:pk } = { ccr:source }
      }
    WHERE
      (
        { p:pk } = { product:baseproduct }
        AND (
          { cat:isBrand } IS NULL
          OR { cat:isBrand } = FALSE
        )
        AND upper({ superCat:code }) NOT LIKE upper('%promo%')
        AND substring({ cat:code }, 1, 1) <> '_'
      )
  }}),
  substring({ product:code }, 12),
  replace({ product:name[en]:o }, '"', ''),
  replace({ product:name[zh]:o }, '"', ''),
  hktvReturnRequestTable.requestCode,
  hktvReturnRequestTable.rWaybill,
  hktvReturnRequestTable.pickupDateTime,
  hktvReturnRequestTable.returnStatus AS entryStatusCode,
  hktvReturnRequestTable.returnReason AS entryReturnReason,
  hktvReturnRequestTable.expectedQuantity AS entryExpectedQuantity,
  round(ifnull({ originalConsignmentEntry:shippedQuantity }, 0), 2),
  (
    round(ifnull({ originalOrderEntry:basePrice }, 0), 2)
    * -1
  ),
  (
    round((
      (
        ifnull({ originalOrderEntry:totalPrice }, 0)
        / ifnull({ originalOrderEntry:quantity }, 0)
      )
      * ifnull({ originalConsignmentEntry:shippedQuantity }, 0)
    ), 2)
    * -1
  ),
  { originalConsignmentStatus:code },
  DATE_FORMAT({ originalConsignment:modifiedtime }, '%Y-%m-%d %H:%i:%s'),
  { originalConsignmentEntry:pk },
  { originalConsignment:code },
  { originalConsignment:trackingID },
  CASE
    WHEN { po:posOrderNumber } IS NOT NULL THEN CONCAT('#', { po:posOrderNumber })
    ELSE ''
  END AS posOrderNumber,
  DATE_FORMAT(hktvReturnRequestTable.modifiedtime, '%Y-%m-%d %H:%i:%s') AS modified_date,
  CASE
    WHEN hktvReturnRequestTable.returnStatus = 'ACCEPTED_BY_MERCHANT' THEN 'MERCHANT'
    WHEN hktvReturnRequestTable.returnStatus = 'ACCEPTED_BY_HKTV' THEN 'HKTV'
    ELSE 'null'
  END AS accepted_by,
  hktvReturnRequestTable.refundAmtByCC,
  hktvReturnRequestTable.refundAmtByMallDollar,
  IFNULL({ bpvp:code }, '') AS "bundle_set",
  hktvReturnRequestTable.refundAmtByCoupon,
  DATE_FORMAT(hktvReturnRequestTable.acceptedTime, '%Y-%m-%d %H:%i:%s') AS accepted_time,
  hktvReturnRequestTable.refundValue
FROM
  ({{
    SELECT
      *
    FROM
      ({{
        SELECT
          { pk },
          { code } AS requestCode,
          { parentRequest } AS parentRequest,
          { ct1:code } AS typeCode,
          { refundMethod:code } AS refundMethodCode,
          { ore:code } AS requestStatus,
          { hktvReturnRequest:returnWaybillNumber } AS rWaybill,
          { hktvReturnRequest:pickupDateTime } AS pickupDateTime,
          { r:modifiedtime } AS modifiedtime,
          { HktvRefundEntry:originalConsignmentEntry } AS originalConsignmentEntryPk,
          { HktvRefundEntry:reportReason } AS reportReasonPk,
          { HKTVReturnEntryReturnStatus:code } AS returnStatus,
          { HktvRefundEntry:expectedQuantity } AS expectedQuantity,
          { HktvRefundEntry:returnReason } AS returnReason,
          { HktvRefundEntry:refundAmtByCC } AS refundAmtByCC,
          (
            { HktvRefundEntry:refundAmtByCredit }
            + { HktvRefundEntry:refundAmtByPaidVoucher }
            + { HktvRefundEntry:refundCCAmtByCredit }
          ) AS refundAmtByMallDollar,
          { HktvRefundEntry:refundAmtByCoupon } AS refundAmtByCoupon,
          { HktvRefundEntry:acceptedTime } AS acceptedTime,
          { HktvRefundEntry:refundValue } AS refundValue
        FROM
          {
            hktvRefundRequest! AS r
            LEFT JOIN ComposedType AS ct1 ON { r:itemType } = { ct1:pk }
            LEFT JOIN RefundMethod AS refundMethod ON { r:refundMethod } = { refundMethod:pk }
            LEFT JOIN OrderReturnEntryStatus AS ore ON { r:returnStatus } = { ore:pk }
            LEFT JOIN hktvReturnRequest AS hktvReturnRequest ON { r:siblingReturnRequest } = { hktvReturnRequest:pk }
            LEFT JOIN HktvRefundEntry AS HktvRefundEntry ON { HktvRefundEntry:returnRequest } = { r:pk }
            LEFT JOIN returnStatus AS HKTVReturnEntryReturnStatus ON { HktvRefundEntry:status } = { HKTVReturnEntryReturnStatus:pk }
          }
      }}) AS y
    UNION ALL
      SELECT
        *
      FROM
        ({{
          SELECT
            { pk },
            { code } AS requestCode,
            { parentRequest } AS parentRequest,
            { ct1:code } AS typeCode,
            { refundMethod:code } AS refundMethodCode,
            { ore:code } AS requestStatus,
            { hktvReturnRequest:returnWaybillNumber } AS rWaybill,
            { hktvReturnRequest:pickupDateTime } AS pickupDateTime,
            { r:modifiedtime } AS modifiedtime,
            { HktvReplacementEntry:originalConsignmentEntry } AS originalConsignmentEntryPk,
            { HktvReplacementEntry:reportReason } AS reportReasonPk,
            { HKTVReturnEntryReturnStatus:code } AS returnStatus,
            { HktvReplacementEntry:expectedQuantity } AS expectedQuantity,
            { HktvReplacementEntry:returnReason } AS returnReason,
            0 AS refundAmtByCC,
            0 AS refundAmtByMallDollar,
            0 AS refundAmtByCoupon,
            { HktvReplacementEntry:acceptedTime } AS acceptedTime,
            { HktvReplacementEntry:refundValue } AS refundValue
          FROM
            {
              hktvReplacementRequest! AS r
              LEFT JOIN ComposedType AS ct1 ON { r:itemType } = { ct1:pk }
              LEFT JOIN RefundMethod AS refundMethod ON { r:refundMethod } = { refundMethod:pk }
              LEFT JOIN OrderReturnEntryStatus AS ore ON { r:returnStatus } = { ore:pk }
              LEFT JOIN hktvReturnRequest AS hktvReturnRequest ON { r:siblingReturnRequest } = { hktvReturnRequest:pk }
              LEFT JOIN HktvReplacementEntry AS HktvReplacementEntry ON { HktvReplacementEntry:returnRequest } = { r:pk }
              LEFT JOIN returnStatus AS HKTVReturnEntryReturnStatus ON { HktvReplacementEntry:status } = { HKTVReturnEntryReturnStatus:pk }
            }
        }}) AS z
  }}) AS hktvReturnRequestTable,
  {
    consignmentEntry AS originalConsignmentEntry
    LEFT JOIN Consignment AS originalConsignment ON { originalConsignmentEntry:consignment } = { originalConsignment:pk }
    LEFT JOIN orderEntry AS originalOrderEntry ON { originalConsignmentEntry:orderEntry } = { originalOrderEntry:pk }
    LEFT JOIN hktvVariantProduct AS product ON { originalOrderEntry:product } = { product:pk }
    LEFT JOIN ConsignmentStatus AS originalConsignmentStatus ON { originalConsignmentStatus:pk } = { originalConsignment:status }
    JOIN SubOrder! AS so ON { so:pk } = { originalOrderEntry:order }
    LEFT JOIN Order! AS po ON { po:pk } = { so:parentOrder }
    LEFT JOIN OrderEntry AS poe ON (
      { poe:order } = { po:pk }
      AND { poe:entryNumber } = { originalOrderEntry:entryNumber }
    )
    LEFT JOIN OrderEntry AS bpoe ON { bpoe:pk } = { poe:bundleParentEntry }
    LEFT JOIN HktvVariantProduct AS bpvp ON { bpvp:pk } = { bpoe:product }
  }
WHERE
  (
    1 = 1
    AND hktvReturnRequestTable.originalConsignmentEntryPk = { originalConsignmentEntry:pk }
    AND { po:replenishmentOrderStore } IS NULL
    AND hktvReturnRequestTable.returnStatus NOT IN ('NEW')
    AND hktvReturnRequestTable.acceptedTime >= ?startDate
    AND 1 = 1
  )
`
