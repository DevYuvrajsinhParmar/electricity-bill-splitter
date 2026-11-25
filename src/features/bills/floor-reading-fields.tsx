import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FloorNumber } from "@/lib/billing";

export function FloorReadingFields({
  floorNumber,
}: {
  floorNumber: FloorNumber;
}) {
  const previousId = `floor-${floorNumber}-previous`;
  const currentId = `floor-${floorNumber}-current`;

  return (
    <FieldSet>
      <FieldLegend>Floor {floorNumber}</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={previousId}>Previous meter reading</FieldLabel>
          <Input
            id={previousId}
            name={previousId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={currentId}>Current meter reading</FieldLabel>
          <Input
            id={currentId}
            name={currentId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
