export const convertToKg = (value, unit) => {
  console.log("   value, unit", value, unit);
  switch (unit) {
    case "kg":
      return value;
    case "mon": // 1 mon = 40 kg (BD standard)
      return value * 40;
    case "ton": // 1 ton = 1000 kg
      return value * 1000;
    case "piece":
      // ⚠️ adjust this rule as needed (default 1 piece = 1 kg)
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
  console.log(rawProduct.itemWeight, rawProduct.weightUnit);
  const processedKg = convertToKg(processing.itemWeight, processing.weightUnit);
  const rawKg = await convertToKg(rawProduct.itemWeight, rawProduct.weightUnit);

  const remaining = rawKg - processedKg;

  if (remaining < 0) {
    throw new Error("❌ Not enough raw product weight available");
  }

  rawProduct.afterUseRawItemWeight = remaining;

  await rawProduct.save({ session });
};
