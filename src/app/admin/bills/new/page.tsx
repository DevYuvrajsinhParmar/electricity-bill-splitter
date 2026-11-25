import { BillForm } from "@/features/bills/bill-form";

export default function NewBillPage() {
  return (
    <main className="mx-auto w-full max-w-xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Add bill</h1>
      <BillForm />
    </main>
  );
}
