export function calculatePackingCost(raw) {
  // 1️⃣ Extra costs
  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);

  const extraCost = totalTransportation + totalWorker + totalOther;

  // 2️⃣ Per bottle packing cost
  const perBottlePackingCost =
    raw.packingMaterial.usedQuantity > 0
      ? extraCost / raw.packingMaterial.usedQuantity
      : 0;
  // 3️⃣ Cost of product inside bottle
  const productCostPerBottle =
    raw.packedProduct.weightPerBottle *
      raw.packedProduct.mixingProductPricePerGm || 0;

  // 4️⃣ Final per bottle cost
  const perBottleFinalCost = productCostPerBottle + perBottlePackingCost;

  return {
    perBottlePackingCost,
    perBottleFinalCost,
  };
}
