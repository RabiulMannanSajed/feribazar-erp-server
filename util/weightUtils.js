export const convertToKg = (value, unit) => {
  console.log("   value, unit", value, unit);
  unit = unit?.toLowerCase();
  switch (unit) {
    case "kg":
      return value;
    case "gm":
      return value / 1000; // ✅ 1000 grams = 1 kg
    case "mon": // 1 mon = 40 kg (BD standard)
      return value * 40;
    case "ton": // 1 ton = 1000 kg
      return value * 1000;
    case "piece":
      // ⚠️ depends on your domain, but normally piece ≠ kg.
      // For now keep as 1 piece = 1 kg (adjust if needed)
      return value * 1;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
};

export const updateRawProductWeight = async (
  rawProduct,
  processing,
  session
) => {
  console.log("this is the raw Product values ", rawProduct);
  console.log("Raw product:", rawProduct.itemWeight, rawProduct.weightUnit);
  console.log("Processing:", processing.itemWeight, processing.weightUnit);

  const processedKg = convertToKg(processing.itemWeight, processing.weightUnit);
  const baseRawKg =
    rawProduct.afterUseRawItemWeight === null
      ? convertToKg(rawProduct.itemWeight, rawProduct.weightUnit) // first use
      : rawProduct.afterUseRawItemWeight; // subsequent uses (already KG)

  // ✅ Calculate remaining
  const remaining = baseRawKg - processedKg;

  if (remaining < 0) {
    throw new Error("❌ Not enough raw product weight available");
  }

  rawProduct.afterUseRawItemWeight = remaining;

  await rawProduct.save({ session });
};
