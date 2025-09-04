export function calculateRawProductPricePerKg(raw) {
  // Calculate total costs
  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);

  const totalCost = totalTransportation + totalWorker + totalOther;

  // If goods → per kg calculation
  if (raw.itemType === "goods") {
    let weightInKg = raw.itemWeight || 0;

    if (raw.weightUnit === "mon") weightInKg *= 40;
    if (raw.weightUnit === "ton") weightInKg *= 1000;

    return weightInKg > 0 ? totalCost / weightInKg : 0;
  }

  // If packing → per piece calculation
  if (raw.itemType === "packing") {
    const pieces = raw.itemAmount || 0;
    return pieces > 0 ? totalCost / pieces : 0;
  }

  return 0; // fallback
}
