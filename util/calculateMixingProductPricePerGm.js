export function calculateMixingProductPricePerGm(raw) {
  // Calculate total costs
  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);

  // here one thing that is find the
  const productAdded = raw.productAdded.map((item) => {
    let weightInKg = item.AddedProductWeight || 0;
    if (item.weightUnit === "mon") weightInKg *= 40;
    if (item.weightUnit === "ton") weightInKg *= 1000;
    return {
      ...item,
      weightInKg,
      totalPrice: weightInKg * (item.AddedProductPricePerKg || 0),
    };
  });
}
