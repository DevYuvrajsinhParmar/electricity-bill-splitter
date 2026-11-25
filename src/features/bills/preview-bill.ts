import {
  BillingCalculationError,
  calculateBillSplit,
  parseRupeesToPaise,
  type MeterReading,
} from "@/lib/billing";

export function previewBill(amountInRupees: string, readings: MeterReading[]) {
  const totalAmountPaise = parseRupeesToPaise(amountInRupees);

  if (totalAmountPaise === null) {
    throw new BillingCalculationError(
      "INVALID_AMOUNT",
      "Enter the bill amount in rupees with up to two decimal places.",
    );
  }

  return calculateBillSplit({ totalAmountPaise, readings });
}
