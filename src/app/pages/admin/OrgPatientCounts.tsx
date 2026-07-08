import React, { useState } from "react";
import { Calendar, Download, Info, ChevronDown } from "lucide-react";
import { Page } from "../../components/layout/Page";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface PatientCountRecord {
  id: string;
  name: string;
  hasDropdown?: boolean;
  clientId: string;
  patientCount: number;
}

const INITIAL_RECORDS: PatientCountRecord[] = [
  { id: "1", name: "ACME Health", clientId: "NET8443220", patientCount: 2832 },
  { id: "2", name: "Primary Health Partners", hasDropdown: true, clientId: "NET2408986", patientCount: 300 },
];

export default function OrgPatientCounts() {
  const [records] = useState<PatientCountRecord[]>(INITIAL_RECORDS);
  const [endDate, setEndDate] = useState("06-25-2026");
  const [selectedOrg, setSelectedOrg] = useState("Select Primary Org");

  const handleReset = () => {
    setEndDate("06-25-2026");
    setSelectedOrg("Select Primary Org");
  };

  const handleApply = () => {
    // Demo apply filter simulation
  };

  const handleDownloadCsv = () => {
    const headers = ["Organization Name", "Client ID", "Patient Counts"];
    const csvRows = records.map((r) => `"${r.name}","${r.clientId}",${r.patientCount}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `org_patient_counts_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<PatientCountRecord>[] = [
    {
      key: "name",
      header: (
        <div className="flex items-center gap-1.5">
          <span>Organization Name</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-muted-foreground/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Primary healthcare network entity</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: (r) => (
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <span>{r.name}</span>
          {r.hasDropdown && <ChevronDown className="size-3.5 text-muted-foreground/70 shrink-0" />}
        </div>
      ),
    },
    { key: "clientId", header: "Client ID", className: "text-muted-foreground dark:text-muted-foreground/70 font-mono text-xs" },
    {
      key: "patientCount",
      header: "Patient Counts",
      cell: (r) => <span className="font-bold text-foreground">{r.patientCount.toLocaleString()}</span>,
    },
  ];

  return (
    <Page
      title="Organization Patient Counts"
      subtitle="Note: After changing any filters, click Apply to update the results."
      crumbs={[{ label: "Admin & Settings" }]}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Filters & Actions Bar */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/70">
                Select End Date
              </label>
              <div className="relative w-[170px]">
                <Input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 pr-9 bg-background border-border dark:border-border text-sm shadow-2xs"
                />
                <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/70">
                Select Primary Org
              </label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="h-9 w-[220px] bg-background border-border dark:border-border text-sm shadow-2xs">
                  <SelectValue placeholder="Select Primary Org" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Primary Org">Select Primary Org</SelectItem>
                  <SelectItem value="ACME Health">ACME Health</SelectItem>
                  <SelectItem value="Primary Health Partners">Primary Health Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-semibold hover:bg-secondary dark:hover:bg-card"
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button
              className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-2xs transition-colors"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>

          <Button
            className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-2xs gap-2 transition-colors inline-flex items-center"
            onClick={handleDownloadCsv}
          >
            <Download className="size-4" />
            <span>Download CSV</span>
          </Button>
        </div>

        {/* Patient Counts Table Primitive */}
        <DataTable
          columns={columns}
          rows={records}
          rowKey={(row) => row.id}
          pageSize={10}
        />
      </div>
    </Page>
  );
}
