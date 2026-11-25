const RUPEE_AMOUNT_PATTERN = /^(?:0|[1-9]\d*)(?:\.(\d{1,2}))?$/;

export function parseRupeesToPaise(value: string): number | null {
  const normalizedValue = value.trim().replaceAll(",", "");
  const match = RUPEE_AMOUNT_PATTERN.exec(normalizedValue);

  if (!match) {
    return null;
  }

  const [rupees, paise = ""] = normalizedValue.split(".");
  const amountInPaise = Number(rupees) * 100 + Number(paise.padEnd(2, "0"));

  return Number.isSafeInteger(amountInPaise) ? amountInPaise : null;
}

export function formatPaiseAsRupees(amountInPaise: number): string {
  if (!Number.isSafeInteger(amountInPaise)) {
    throw new TypeError("The amount must be a safe integer number of paise.");
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountInPaise / 100);
}
