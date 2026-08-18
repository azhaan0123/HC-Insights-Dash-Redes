import React, { useState } from "react";
import { Search, RefreshCw, Layers, CheckCircle2, AlertCircle } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface BatchRecord {
  id: string;
  dpcName: string;
  type: string;
  step: string;
  integrationType: string;
  vendor: string;
  status: "Completed" | "Processing" | "Failed";
  createdAt: string;
  details: string;
}

const DEMO_BATCHES: BatchRecord[] = [
  { id: "BAT-9921", dpcName: "ACME Health DPC", type: "Full Sync", step: "Transform Claims", integrationType: "Claims EHR", vendor: "Elation", status: "Completed", createdAt: "2026-06-25 10:42 AM", details: "Processed 4,210 records" },
  { id: "BAT-9922", dpcName: "Heritage Health Center", type: "Delta Sync", step: "Ingest Encounters", integrationType: "EHR API", vendor: "Athena", status: "Processing", createdAt: "2026-06-25 11:15 AM", details: "Step 3 of 5 active" },
  { id: "BAT-9923", dpcName: "Blue Ridge Health Clinic", type: "Daily Export", step: "Validate Eligibility", integrationType: "X12 EDI", vendor: "Change Health", status: "Failed", createdAt: "2026-06-25 09:10 AM", details: "Connection timeout on gateway" },
];

export default function InboundIntegrationBatches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowDemo(true);
    }, 600);
  };

  const batches = showDemo
    ? DEMO_BATCHES.filter(
        (b) =>
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.dpcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const columns: Column<BatchRecord>[] = [
    { key: "id", header: "ID", className: "font-mono font-medium text-primary" },
    { key: "dpcName", header: "DPC Name", className: "font-medium text-foreground" },
    { key: "type", header: "Type", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "step", header: "Processing Step", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "integrationType", header: "Integration Type", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "vendor", header: "Vendor", className: "text-muted-foreground dark:text-muted-foreground/70 font-medium" },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            b.status === "Completed"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : b.status === "Processing"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
              : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {b.status === "Completed" && <CheckCircle2 className="size-3 text-emerald-600" />}
          {b.status === "Processing" && <RefreshCw className="size-3 text-blue-600 animate-spin" />}
          {b.status === "Failed" && <AlertCircle className="size-3 text-red-600" />}
          <span>{b.status}</span>
        </span>
      ),
    },
    { key: "createdAt", header: "Created At", className: "text-muted-foreground text-xs" },
    {
      key: "details",
      header: "Details",
      cell: (b) => <span className="text-muted-foreground dark:text-muted-foreground/70 truncate max-w-[180px] block" title={b.details}>{b.details}</span>,
    },
  ];

  return (
    <Page
      title="Inbound Integration Batches"
      crumbs={[{ label: "Admin & Settings" }]}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Top Search Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-[240px] md:w-[320px]">
            <Input
              placeholder="Search by ID, type or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pr-8 bg-background border-border dark:border-border text-sm shadow-2xs"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
          </div>

          <Button
            className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-2xs transition-colors gap-1.5 inline-flex items-center"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Batches Table Primitive */}
        <DataTable
          columns={columns}
          rows={batches}
          rowKey={(row) => row.id}
          pageSize={10}
        />

        {/* Demo simulation hint banner */}
        {!showDemo && (
          <div className="rounded-lg bg-muted dark:bg-muted/30 border p-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Layers className="size-4 text-muted-foreground/70" />
              <span>Monitoring inbound pipeline queues for integration partners. Click simulate to view active batches.</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDemo(true)}
              className="text-primary hover:bg-transparent hover:underline font-semibold h-7 px-2 text-xs"
            >
              Simulate Active Batches
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}
