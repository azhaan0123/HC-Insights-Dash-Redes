import React, { useState } from "react";
import { ChevronRight, ArrowRight } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";

interface NetworkRecord {
  id: string;
  name: string;
  type: string;
  status: "Awaiting Credentials" | "Maintenance" | "Contracting" | "Onboarding";
  dpcCount: number;
  invitedUsers: number;
}

const INITIAL_NETWORKS: NetworkRecord[] = [
  { id: "1", name: "Maple Grove Medical Center", type: "NETWORK", status: "Awaiting Credentials", dpcCount: 0, invitedUsers: 0 },
  { id: "2", name: "Heritage Health Center", type: "DPC INDEPENDENT", status: "Awaiting Credentials", dpcCount: 1, invitedUsers: 1 },
  { id: "3", name: "TEST", type: "DPC INDEPENDENT", status: "Awaiting Credentials", dpcCount: 1, invitedUsers: 0 },
  { id: "4", name: "Lakeside Medical Clinic", type: "NETWORK", status: "Awaiting Credentials", dpcCount: 0, invitedUsers: 0 },
  { id: "5", name: "HC Test DPC", type: "DPC INDEPENDENT", status: "Awaiting Credentials", dpcCount: 1, invitedUsers: 0 },
  { id: "6", name: "TEST", type: "NETWORK", status: "Awaiting Credentials", dpcCount: 0, invitedUsers: 0 },
  { id: "7", name: "Horizon Health Partners - Test", type: "NETWORK", status: "Awaiting Credentials", dpcCount: 0, invitedUsers: 0 },
  { id: "8", name: "Blue Ridge Health Clinic", type: "DPC INDEPENDENT", status: "Awaiting Credentials", dpcCount: 1, invitedUsers: 1 },
  { id: "9", name: "QANETWORK", type: "NETWORK", status: "Maintenance", dpcCount: 1, invitedUsers: 0 },
  { id: "10", name: "ACME Health", type: "NETWORK", status: "Maintenance", dpcCount: 1, invitedUsers: 2 },
  { id: "11", name: "Test Integrations", type: "NETWORK", status: "Maintenance", dpcCount: 1, invitedUsers: 0 },
  { id: "12", name: "My Org Auto demo", type: "NETWORK", status: "Maintenance", dpcCount: 0, invitedUsers: 0 },
  { id: "13", name: "Click Here", type: "NETWORK", status: "Maintenance", dpcCount: 0, invitedUsers: 0 },
  { id: "14", name: "Primary Health Partners", type: "NETWORK", status: "Maintenance", dpcCount: 6, invitedUsers: 0 },
  { id: "15", name: "Testing Multi Loc HQ", type: "DPC MULTI LOCATION HQ", status: "Maintenance", dpcCount: 1, invitedUsers: 0 },
  { id: "16", name: "Testing Ind DPC", type: "DPC INDEPENDENT", status: "Maintenance", dpcCount: 3, invitedUsers: 0 },
];

export default function OnboardingManagement() {
  const [networks] = useState<NetworkRecord[]>(INITIAL_NETWORKS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkRecord | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const leadingTabs = (
    <div className="border-b border-border dark:border-border -mb-px">
      <button className="border-b-2 border-primary pb-2 text-xs md:text-sm font-bold text-primary tracking-wider uppercase">
        Networks
      </button>
    </div>
  );

  return (
    <Page
      title="Onboarding Management"
      crumbs={[{ label: "Admin & Settings" }]}
      leading={leadingTabs}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Pipeline Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg border border-border dark:border-border p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Contracting
            </span>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">0</span>
              <span className="ml-1.5 text-xs text-muted-foreground">networks</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border dark:border-border p-4 shadow-2xs flex flex-col justify-between border-l-4 border-l-amber-500">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Awaiting Credentials
            </span>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">8</span>
              <span className="ml-1.5 text-xs text-muted-foreground">networks</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border dark:border-border p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Onboarding
            </span>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">0</span>
              <span className="ml-1.5 text-xs text-muted-foreground">networks</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border dark:border-border p-4 shadow-2xs flex flex-col justify-between border-l-4 border-l-emerald-500">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Maintenance
            </span>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">8</span>
              <span className="ml-1.5 text-xs text-muted-foreground">networks</span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border dark:border-border p-4 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Pipeline
            </span>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-primary">16</span>
              <span className="ml-1.5 text-xs text-muted-foreground">entities</span>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div>
          <h2 className="text-base font-bold text-foreground">Network Pipeline</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of current network onboarding statuses and affiliated practice counts.
          </p>
        </div>

        {/* Pipeline Table */}
        <div className="rounded-lg border border-border dark:border-border bg-card shadow-xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-secondary/80 dark:bg-muted/50 border-b border-border dark:border-border text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-4 pr-2 w-10"></th>
                  <th className="py-3.5 px-4">Network Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">DPC Count</th>
                  <th className="py-3.5 px-4">Invited Users</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-border text-xs md:text-sm text-foreground">
                {networks.map((item) => {
                  const isExpanded = expandedRow === item.id;
                  const isAwaiting = item.status === "Awaiting Credentials";

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleExpand(item.id)}
                        className="hover:bg-muted/70 dark:hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="py-3 pl-4 pr-2 text-muted-foreground/70">
                          <ChevronRight
                            className={`size-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-primary" : ""
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground max-w-[300px] truncate">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground dark:text-muted-foreground/70 font-medium">
                          {item.type}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              isAwaiting
                                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isAwaiting ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground dark:text-muted-foreground/70">
                          <span className="font-bold text-foreground mr-1">{item.dpcCount}</span>
                          DPCs
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">
                          {item.invitedUsers}
                        </td>
                        <td className="py-3 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedNetwork(item)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded border border-primary text-primary hover:bg-primary/10 text-xs font-semibold transition-colors"
                          >
                            <span>DPC List</span>
                            <ArrowRight className="size-3" />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-muted/80 dark:bg-muted/20 border-b">
                          <td colSpan={7} className="p-4 pl-12 text-xs text-muted-foreground dark:text-muted-foreground/70">
                            <div className="p-3 rounded bg-background border border-border dark:border-border flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-foreground">Associated DPCs:</span>{" "}
                                {item.dpcCount === 0 ? "No DPCs configured yet." : `${item.dpcCount} active practice locations linked.`}
                              </div>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => setSelectedNetwork(item)}>
                                View Full Configuration
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DPC List Dialog */}
        <Dialog open={!!selectedNetwork} onOpenChange={() => setSelectedNetwork(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-primary flex items-center gap-2">
                <span>DPC List: {selectedNetwork?.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground dark:text-muted-foreground/70 space-y-3">
              <p>
                Displaying practice locations and contracted DPC clinics affiliated with{" "}
                <strong className="text-foreground">{selectedNetwork?.name}</strong>.
              </p>
              <div className="rounded-md border p-3 bg-muted dark:bg-muted/30">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Onboarding Status:</span>
                  <span className="font-semibold text-foreground">{selectedNetwork?.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Invited Users:</span>
                  <span className="font-semibold text-foreground">{selectedNetwork?.invitedUsers} members</span>
                </div>
              </div>
              {selectedNetwork?.dpcCount === 0 ? (
                <div className="py-6 text-center text-muted-foreground/70 text-xs border border-dashed rounded">
                  No DPC clinics registered under this network entity.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Linked Practices ({selectedNetwork?.dpcCount})</div>
                  <div className="p-2.5 rounded border bg-background flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{selectedNetwork?.name} Primary Care Clinic</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setSelectedNetwork(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Page>
  );
}
