// 🔹 Helper function to calculate cost per Kg
//  this function for those product which is in mon and to
export function calculateRawProductPricePerKg(raw) {
  let weightInKg = raw.itemWeight;

  if (raw.weightUnit === "mon") weightInKg *= 40; // 1 mon = 40 kg
  if (raw.weightUnit === "ton") weightInKg *= 1000; // 1 ton = 1000 kg

  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);

  const totalCost = totalTransportation + totalWorker + totalOther;

  return totalCost / weightInKg;
}

// TODO
//  need another function for the packing product
//  here we find the cost per product (bottle/ level/ ) piece
