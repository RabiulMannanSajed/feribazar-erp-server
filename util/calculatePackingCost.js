export function calculatePackingCost(raw) {
  console.log("cost of raw product ", raw);

  // TODO check the retun value
  // 1️⃣ Extra costs
  const sumNumbers = (arr) => arr.reduce((a, b) => Number(a) + Number(b), 0);

  const totalTransportation = sumNumbers(raw.transportationCost);
  const totalWorker = sumNumbers(raw.workerCost);
  const totalOther = sumNumbers(raw.otherCost);

  const extraCost = totalTransportation + totalWorker + totalOther;
  console.log("extraCost", extraCost);
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
