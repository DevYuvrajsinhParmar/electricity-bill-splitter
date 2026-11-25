import { BillingCalculationError, FLOOR_NUMBERS } from "@/lib/billing";
import { previewBill } from "./preview-bill";

export function previewBillFromForm(formData: FormData) {
  const amount = formData.get("amountInRupees");
  if (typeof amount !== "string" || amount.trim() === "") {
    throw new BillingCalculationError("INVALID_AMOUNT", "Enter the bill amount.");
  }

  const readings = FLOOR_NUMBERS.map((floorNumber) => {
    const previous = formData.get(`floor-${floorNumber}-previous`);
    const current = formData.get(`floor-${floorNumber}-current`);

    if (
      typeof previous !== "string" ||
      typeof current !== "string" ||
      !/^\d+$/.test(previous.trim()) ||
      !/^\d+$/.test(current.trim())
    ) {
      throw new BillingCalculationError(
        "INVALID_READING",
        `Enter both readings for floor ${floorNumber} as non-negative whole numbers.`,
      );
    }

    return {
      floorNumber,
      previousReading: Number(previous),
      currentReading: Number(current),
    };
  });

  return previewBill(amount, readings);
}
