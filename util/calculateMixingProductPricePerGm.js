export function calculateMixingProductPricePerGm(raw) {
  // 1️⃣ Calculate total extra costs
  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);

  // 2️⃣ Convert product weights & calculate cost
  const productAdded = raw.productAdded.map((item) => {
    let weightInKg = item.AddedProductWeight || 0;

    if (item.weightUnit === "mon") weightInKg *= 40;
    if (item.weightUnit === "ton") weightInKg *= 1000;
    if (item.weightUnit === "gm") weightInKg /= 1000;

    return {
      ...item,
      weightInKg,
      totalPrice: weightInKg * (item.AddedProductPricePerKg || 0),
    };
  });

  // 3️⃣ Total weight (in grams)
  const totalWeightInKg = productAdded.reduce(
    (acc, item) => acc + item.weightInKg,
    0
  );
  const totalWeightInGm = totalWeightInKg * 1000;

  // 4️⃣ Total product price
  const totalProductPrice = productAdded.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  // 5️⃣ Final total cost
  const grandTotal =
    totalProductPrice + totalTransportation + totalWorker + totalOther;

  // 6️⃣ Price per gram
  return totalWeightInGm > 0 ? grandTotal / totalWeightInGm : 0;
}
