import { useState, useMemo } from "react";
import { Page } from "../components/layout/Page";
import { DataTable, type Column } from "../components/dashboard/DataTable";
import { IdCell } from "../components/dashboard/cells";
import { claimsChips } from "../data/filters";
import { claimsBilling, type BillingRow } from "../data/datasets";
import { usePageLoading } from "../hooks/usePageLoading";
import { TableSkeleton } from "../components/dashboard/SkeletonPrimitives";
import { PatientBillingSidebar } from "../components/dashboard/PatientBillingSidebar";

export default function ClaimsBillingReport() {
  const isLoading = usePageLoading();
  const [selectedBillingRow, setSelectedBillingRow] = useState<BillingRow | null>(null);

  const columns: Column<BillingRow>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Patient ID",
        cell: (r) => (
          <IdCell
            id={r.id}
            onClick={() => setSelectedBillingRow(r)}
          />
        ),
      },
      { key: "name", header: "Patient Name" },
      { key: "cpt", header: "CPT Code", cell: (r) => <span className="font-mono text-xs tabular-nums">{r.cpt}</span> },
      { key: "description", header: "CPT Code Description" },
      { key: "dateOfService", header: "Date of Service" },
      { key: "rate", header: "Rate Charged", align: "right", cell: (r) => <span className="tabular-nums">{r.rate}</span> },
    ],
    []
  );

  if (isLoading) {
    return (
      <Page title="Claims Billing Report">
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  const chips = claimsChips.filter((c) => c.label !== "Division");
  return (
    <Page title="Claims Billing Report" chips={chips}>
      <div className="stagger-section">
        <DataTable columns={columns} rows={claimsBilling} rowKey={(r, i) => r.id + i} />
      </div>

      <PatientBillingSidebar
        open={selectedBillingRow !== null}
        onOpenChange={(open) => !open && setSelectedBillingRow(null)}
        billingData={selectedBillingRow}
      />
    </Page>
  );
}
