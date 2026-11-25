import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function BillAmountField() {
  return (
    <Field>
      <FieldLabel htmlFor="bill-amount">Total bill amount (₹)</FieldLabel>
      <Input
        id="bill-amount"
        name="amountInRupees"
        type="text"
        inputMode="decimal"
        placeholder="4342.25"
        required
      />
    </Field>
  );
}
