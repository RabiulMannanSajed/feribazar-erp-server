export function calculateProcessProductPricePerKg(raw) {
  //* here find the cost in per unit
  const totalTransportation = raw.transportationCost.reduce((a, b) => a + b, 0);
  const totalWorker = raw.workerCost.reduce((a, b) => a + b, 0);
  const totalOther = raw.otherCost.reduce((a, b) => a + b, 0);
  const totalCookingIngredients = raw.cookingIngredientsCost.reduce(
    (a, b) => a + b,
    0
  );
  const totalFuel = raw.fuelCost.reduce((a, b) => a + b, 0);
  const totalCost =
    totalTransportation +
    totalWorker +
    totalOther +
    totalCookingIngredients +
    totalFuel;

  //* here find the wight in kg and then find the price per kg
  if (raw.itemType === "goods") {
    let weightInKg = raw.itemWeight || 0;

    if (raw.weightUnit === "mon") weightInKg *= 40;
    if (raw.weightUnit === "ton") weightInKg *= 1000;

    const totalProductCost = weightInKg * (raw.itemCost || 0);
    const finalCost = totalCost + totalProductCost;

    return weightInKg > 0 ? finalCost / weightInKg : 0;
  }
}
