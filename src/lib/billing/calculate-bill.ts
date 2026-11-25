import {
  BillingCalculationError,
  FLOOR_NUMBERS,
  type BillCalculation,
  type BillCalculationInput,
  type FloorAllocation,
  type MeterReading,
} from "./types";

function assertSafeNonNegativeInteger(value: number, fieldName: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new BillingCalculationError(
      "INVALID_READING",
      `${fieldName} must be a non-negative whole number.`,
    );
  }
}

function validateReadings(readings: readonly MeterReading[]) {
  const receivedFloors = readings
    .map(({ floorNumber }) => floorNumber)
    .toSorted((first, second) => first - second);

  const hasEveryFloorExactlyOnce =
    receivedFloors.length === FLOOR_NUMBERS.length &&
    FLOOR_NUMBERS.every(
      (floorNumber, index) => receivedFloors[index] === floorNumber,
    );

  if (!hasEveryFloorExactlyOnce) {
    throw new BillingCalculationError(
      "INVALID_FLOORS",
      "A bill must contain exactly one reading for each of the three floors.",
    );
  }

  for (const reading of readings) {
    assertSafeNonNegativeInteger(
      reading.previousReading,
      `Floor ${reading.floorNumber} previous reading`,
    );
    assertSafeNonNegativeInteger(
      reading.currentReading,
      `Floor ${reading.floorNumber} current reading`,
    );

    if (reading.currentReading < reading.previousReading) {
      throw new BillingCalculationError(
        "READING_DECREASED",
        `Floor ${reading.floorNumber} current reading cannot be lower than its previous reading.`,
      );
    }
  }
}

export function calculateBillSplit({
  totalAmountPaise,
  readings,
}: BillCalculationInput): BillCalculation {
  if (!Number.isSafeInteger(totalAmountPaise) || totalAmountPaise <= 0) {
    throw new BillingCalculationError(
      "INVALID_AMOUNT",
      "The total bill must be a positive whole number of paise.",
    );
  }

  validateReadings(readings);

  const readingsWithConsumption = readings.map((reading) => ({
    ...reading,
    unitsConsumed: reading.currentReading - reading.previousReading,
  }));
  const totalUnits = readingsWithConsumption.reduce(
    (sum, reading) => sum + reading.unitsConsumed,
    0,
  );

  if (!Number.isSafeInteger(totalUnits) || totalUnits === 0) {
    throw new BillingCalculationError(
      "ZERO_CONSUMPTION",
      "At least one floor must have consumed electricity.",
    );
  }

  const totalAmount = BigInt(totalAmountPaise);
  const totalConsumption = BigInt(totalUnits);
  const shares = readingsWithConsumption.map((reading, index) => {
    const numerator = totalAmount * BigInt(reading.unitsConsumed);

    return {
      index,
      amountPaise: numerator / totalConsumption,
      remainder: numerator % totalConsumption,
    };
  });

  const allocatedPaise = shares.reduce(
    (sum, share) => sum + share.amountPaise,
    BigInt(0),
  );
  const leftoverPaise = Number(totalAmount - allocatedPaise);
  const sharesByRemainder = shares.toSorted((first, second) => {
    if (first.remainder === second.remainder) {
      return first.index - second.index;
    }

    return first.remainder > second.remainder ? -1 : 1;
  });

  for (let index = 0; index < leftoverPaise; index += 1) {
    sharesByRemainder[index].amountPaise += BigInt(1);
  }

  const allocations: FloorAllocation[] = readingsWithConsumption.map(
    (reading, index) => ({
      ...reading,
      allocatedAmountPaise: Number(shares[index].amountPaise),
    }),
  );

  return {
    totalAmountPaise,
    totalUnits,
    allocations,
  };
}
