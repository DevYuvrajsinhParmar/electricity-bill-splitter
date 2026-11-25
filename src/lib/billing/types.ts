export const FLOOR_NUMBERS = [1, 2, 3] as const;

export type FloorNumber = (typeof FLOOR_NUMBERS)[number];

export type MeterReading = {
  floorNumber: FloorNumber;
  previousReading: number;
  currentReading: number;
};

export type BillCalculationInput = {
  totalAmountPaise: number;
  readings: readonly MeterReading[];
};

export type FloorAllocation = MeterReading & {
  unitsConsumed: number;
  allocatedAmountPaise: number;
};

export type BillCalculation = {
  totalAmountPaise: number;
  totalUnits: number;
  allocations: FloorAllocation[];
};

export type BillingCalculationErrorCode =
  | "INVALID_AMOUNT"
  | "INVALID_READING"
  | "INVALID_FLOORS"
  | "READING_DECREASED"
  | "ZERO_CONSUMPTION";

export class BillingCalculationError extends Error {
  constructor(
    public readonly code: BillingCalculationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BillingCalculationError";
  }
}
