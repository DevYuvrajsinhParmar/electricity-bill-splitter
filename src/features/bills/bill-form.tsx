"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import {
  BillingCalculationError,
  FLOOR_NUMBERS,
  formatPaiseAsRupees,
  type BillCalculation,
} from "@/lib/billing";
import { BillAmountField } from "./bill-amount-field";
import { FloorReadingFields } from "./floor-reading-fields";
import { previewBillFromForm } from "./preview-bill-from-form";

export function BillForm() {
  const [preview, setPreview] = useState<BillCalculation | null>(null);
  const [error, setError] = useState("");

  return (
    <form
      onChange={() => {
        setPreview(null);
        setError("");
      }}
      onSubmit={(event) => {
        event.preventDefault();
        try {
          setPreview(previewBillFromForm(new FormData(event.currentTarget)));
          setError("");
        } catch (cause) {
          if (!(cause instanceof BillingCalculationError)) throw cause;
          setPreview(null);
          setError(cause.message);
        }
      }}
    >
      <FieldGroup>
        <BillAmountField />
        {FLOOR_NUMBERS.map((floorNumber) => (
          <FloorReadingFields key={floorNumber} floorNumber={floorNumber} />
        ))}
        <Button type="submit">Preview split</Button>
        {error && <FieldError>{error}</FieldError>}
        <div aria-live="polite">
          {preview && (
            <section>
              <h2 className="font-semibold">Bill split</h2>
              <p>
                Total: {formatPaiseAsRupees(preview.totalAmountPaise)} across{" "}
                {preview.totalUnits} units
              </p>
              <ul>
                {preview.allocations.map((floor) => (
                  <li key={floor.floorNumber}>
                    Floor {floor.floorNumber}: {floor.unitsConsumed} units ·{" "}
                    {formatPaiseAsRupees(floor.allocatedAmountPaise)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
