import React, { useState } from "react";
import {
  MapPin,
  Users,
  UserCheck,
  Building2,
  Stethoscope,
  ChevronRight,
  Info,
  Download,
  Sparkles,
  CheckCircle2
} from "../../lib/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../ui/utils";
import { US_50_STATE_PATHS, US_MAP_BORDERS, US_MAP_SEPARATOR } from "./USMapVectorData";

// ----------------------------------------------------------------------
// STATE ENROLLMENT & DENSITY DATA FOR ALL 50 STATES + REGIONAL HUBS
// ----------------------------------------------------------------------
export type USStateData = {
  id: string; // 2-letter postal code
  name: string;
  members: number;
  pct: string;
  subscribers: number;
  dependents: number;
  hub: string;
  provider: string;
  offices: { city: string; members: number; type: string }[];
  color: string;
};

export const US_STATE_DATA: Record<string, USStateData> = {
  TX: {
    id: "TX",
    name: "Texas",
    members: 145,
    pct: "29.6%",
    subscribers: 74,
    dependents: 71,
    hub: "Austin Regional Hub",
    provider: "Dr. Marcus Vance",
    offices: [
      { city: "Austin (HQ Campus)", members: 92, type: "On-Site Clinic" },
      { city: "Dallas Regional Office", members: 35, type: "Near-Site DPC" },
      { city: "Houston Remote Workgroup", members: 18, type: "Virtual DPC" },
    ],
    color: "#e32168", // Deep Primary Pink
  },
  IL: {
    id: "IL",
    name: "Illinois",
    members: 110,
    pct: "22.5%",
    subscribers: 56,
    dependents: 54,
    hub: "Chicago Metro Care Center",
    provider: "Dr. Elena Rostova",
    offices: [
      { city: "Chicago (West Loop Tower)", members: 78, type: "On-Site Clinic" },
      { city: "Naperville Operations", members: 22, type: "Near-Site DPC" },
      { city: "Evanston Tech Hub", members: 10, type: "Virtual DPC" },
    ],
    color: "#be185d", // Deep Magenta Pink
  },
  FL: {
    id: "FL",
    name: "Florida",
    members: 88,
    pct: "18.0%",
    subscribers: 45,
    dependents: 43,
    hub: "Miami-Dade DPC Center",
    provider: "Dr. Sarah Jenkins",
    offices: [
      { city: "Miami Brickell Office", members: 52, type: "Near-Site DPC" },
      { city: "Tampa Logistics Center", members: 26, type: "Near-Site DPC" },
      { city: "Orlando Remote Cohort", members: 10, type: "Virtual DPC" },
    ],
    color: "#f43f5e", // Rose
  },
  CA: {
    id: "CA",
    name: "California",
    members: 56,
    pct: "11.5%",
    subscribers: 29,
    dependents: 27,
    hub: "Bay Area Innovation Hub",
    provider: "Dr. Amanda Ross",
    offices: [
      { city: "San Francisco SOMA Office", members: 34, type: "Near-Site DPC" },
      { city: "San Jose Tech Center", members: 16, type: "Near-Site DPC" },
      { city: "Los Angeles Remote Team", members: 6, type: "Virtual DPC" },
    ],
    color: "#fb7185", // Medium Light Rose
  },
  NY: {
    id: "NY",
    name: "New York",
    members: 42,
    pct: "8.6%",
    subscribers: 22,
    dependents: 20,
    hub: "Manhattan DPC Suite",
    provider: "Dr. David Sterling",
    offices: [
      { city: "New York Midtown Tower", members: 32, type: "On-Site Clinic" },
      { city: "Brooklyn Creative Studio", members: 10, type: "Near-Site DPC" },
    ],
    color: "#fda4af", // Soft Pink
  },
  NC: {
    id: "NC",
    name: "North Carolina",
    members: 28,
    pct: "5.7%",
    subscribers: 14,
    dependents: 14,
    hub: "Raleigh-Durham Health Hub",
    provider: "Dr. Robert Thorne",
    offices: [
      { city: "Raleigh Research Triangle", members: 22, type: "Near-Site DPC" },
      { city: "Charlotte Remote Hub", members: 6, type: "Virtual DPC" },
    ],
    color: "#fecdd3", // Blush Pink
  },
  GA: {
    id: "GA",
    name: "Georgia",
    members: 20,
    pct: "4.1%",
    subscribers: 10,
    dependents: 10,
    hub: "Atlanta Southeast Center",
    provider: "Dr. Michael Chang",
    offices: [
      { city: "Atlanta Buckhead Office", members: 16, type: "Near-Site DPC" },
      { city: "Savannah Remote Cohort", members: 4, type: "Virtual DPC" },
    ],
    color: "#ffe4e6", // Pale Pink
  },
};

// Helper for states with minor enrollment or defaults
function getStateData(id: string, name: string): USStateData {
  if (US_STATE_DATA[id]) return US_STATE_DATA[id];
  return {
    id,
    name,
    members: 0,
    pct: "0%",
    subscribers: 0,
    dependents: 0,
    hub: "National Tele-DPC Network",
    provider: "On-Call Virtual Team",
    offices: [{ city: "Remote / Distributed Workforce", members: 0, type: "Virtual DPC Coverage" }],
    color: "var(--color-muted)", // Slate neutral
  };
}

export function InteractiveUSMap() {
  const [hoveredState, setHoveredState] = useState<USStateData | null>(null);
  const [selectedState, setSelectedState] = useState<USStateData | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* SVG VECTOR MAP CONTAINER */}
      <div 
        className="relative w-full h-[250px] sm:h-[280px] bg-card rounded-2xl border p-2 flex items-center justify-center overflow-hidden shadow-2xs group"
        onMouseLeave={() => setHoveredState(null)}
      >
        {hoveredState && hoveredState.members > 0 && (
          <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-md border rounded-lg px-3 py-1.5 shadow-2xs pointer-events-none transition-all flex items-center gap-2 text-xs z-10 animate-in fade-in duration-200">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: hoveredState.color }} />
            <span className="font-bold text-foreground">{hoveredState.name}</span>
            <span className="font-mono font-bold text-primary">{hoveredState.members} Members</span>
            <span className="text-[10px] text-muted-foreground">({hoveredState.pct} of Cohort)</span>
          </div>
        )}

        <svg
          viewBox="0 0 959 593"
          className="w-full h-full max-w-[780px] transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Internal State Borders */}
          <g className="borders pointer-events-none" stroke="var(--border)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" opacity={0.65}>
            {US_MAP_BORDERS.map((b) => (
              <path key={b.id} d={b.d} />
            ))}
            {US_MAP_SEPARATOR && <path d={US_MAP_SEPARATOR} strokeDasharray="3 3" />}
          </g>

          {/* 50 States + DC Paths & Circles */}
          {US_50_STATE_PATHS.map((st) => {
            const data = getStateData(st.id, st.name);
            const isHovered = hoveredState?.id === st.id;
            const hasMembers = data.members > 0;

            return (
              <g key={st.id} className="transition-all duration-200">
                {st.type === 'circle' ? (
                  <circle
                    cx={st.cx}
                    cy={st.cy}
                    r={isHovered ? (st.r || 5) * 1.5 : (st.r || 5)}
                    fill={hasMembers ? data.color : "var(--color-muted)"}
                    fillOpacity={hasMembers ? (isHovered ? 1.0 : 0.9) : 0.5}
                    stroke={isHovered ? "#ffffff" : "var(--border)"}
                    strokeWidth={isHovered ? 2 : 1}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      hasMembers && "hover:drop-shadow-md"
                    )}
                    onMouseEnter={() => setHoveredState(data)}
                    onClick={() => setSelectedState(data)}
                  >
                    <title>{`${data.name} (${st.id}) — ${data.members} Members (${data.pct})\nClick to open ${data.hub} details`}</title>
                  </circle>
                ) : (
                  <path
                    d={st.d}
                    fill={hasMembers ? data.color : "var(--color-muted)"}
                    fillOpacity={hasMembers ? (isHovered ? 1.0 : 0.88) : 0.35}
                    stroke={isHovered ? "#ffffff" : "var(--border)"}
                    strokeWidth={isHovered ? 2.5 : 1}
                    strokeLinejoin="round"
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      hasMembers && "hover:drop-shadow-md",
                      !hasMembers && "hover:fill-muted-foreground/30"
                    )}
                    onMouseEnter={() => setHoveredState(data)}
                    onClick={() => setSelectedState(data)}
                  >
                    <title>{`${data.name} (${st.id}) — ${data.members} Members (${data.pct})\nClick to open ${data.hub} details`}</title>
                  </path>
                )}
                {/* State Postal Label on large/active states */}
                {hasMembers && (
                  <text
                    x={getLabelCoordinates(st.id).x}
                    y={getLabelCoordinates(st.id).y}
                    fill="#ffffff"
                    fontSize={isHovered ? "13" : "11.5"}
                    fontWeight="800"
                    textAnchor="middle"
                    className="pointer-events-none select-none drop-shadow-xs transition-all duration-200"
                  >
                    {st.id}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md border rounded-lg px-2.5 py-1.5 shadow-2xs flex items-center gap-3 text-[10px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#e32168]" />
            <span>High Density (TX, IL, FL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#fb7185]" />
            <span>Regional Hubs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-muted border" />
            <span>0 Members</span>
          </div>
        </div>
      </div>

      {/* 3. DETAILED STATE VIEW MODAL DIALOG */}
      <Dialog open={!!selectedState} onOpenChange={(open) => !open && setSelectedState(null)}>
        {selectedState && (
          <DialogContent className="max-w-2xl p-6 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden">
            <DialogHeader className="mb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className="size-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white/20 shrink-0"
                    style={{ backgroundColor: selectedState.color }}
                  >
                    {selectedState.id}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                      <span>{selectedState.name} Regional Care Hub</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>Direct Primary Care active enrollment & office distribution manifest</span>
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className="bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 text-xs font-bold px-3 py-1 shadow-2xs">
                    {selectedState.pct} of Acme Cohort
                  </Badge>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Cohort Share</span>
                </div>
              </div>
            </DialogHeader>

            {/* 3 Mini KPI Summary Cards inside Modal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between group hover:border-border transition-all">
                <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase">Total Members</span>
                  <Users className="size-4 text-rose-500 shrink-0" />
                </div>
                <div className="text-2xl font-mono font-black tracking-tight text-foreground">{selectedState.members.toLocaleString()}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>Active & Reconciled</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between group hover:border-border transition-all">
                <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase">Subscriber Split</span>
                  <UserCheck className="size-4 text-primary shrink-0" />
                </div>
                <div className="text-xl font-mono font-black tracking-tight text-foreground">
                  {selectedState.subscribers.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">/ {selectedState.dependents.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold mt-1">
                  <span>Subscribers vs Dependents</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-2xs flex flex-col justify-between group hover:border-border transition-all">
                <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase">Lead Provider</span>
                  <Stethoscope className="size-4 text-purple-500 shrink-0" />
                </div>
                <div className="text-sm font-bold text-foreground truncate mt-1" title={selectedState.provider}>{selectedState.provider}</div>
                <div className="flex items-center gap-1 text-[11px] text-primary font-semibold mt-1 truncate" title={selectedState.hub}>
                  <Sparkles className="size-3 shrink-0" />
                  <span className="truncate">{selectedState.hub}</span>
                </div>
              </div>
            </div>

            {/* Regional Corporate Offices & City Density Table */}
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-muted-foreground/90 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="size-3.5 text-primary" />
                  <span>Office Location & Clinical Access Density</span>
                </h4>
                <span className="text-[11px] font-semibold text-muted-foreground">{selectedState.offices.length} Active {selectedState.offices.length === 1 ? 'Location' : 'Locations'}</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f8f9fa] dark:bg-card/40 border-b border-border/60 text-[11px] font-bold tracking-wider text-muted-foreground/90 uppercase">
                      <th className="py-3 px-4">City / Campus Location</th>
                      <th className="py-3 px-4 text-right">Enrolled Members</th>
                      <th className="py-3 px-4">Primary DPC Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {selectedState.offices.map((off, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary/80 shrink-0" />
                          <span>{off.city}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-right">
                          {off.members > 0 ? `${off.members.toLocaleString()} Members` : 'Virtual / On-Call'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-background/80 font-semibold text-[11px] border-border/60 px-2.5 py-0.5 shadow-2xs">
                            {off.type}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Info className="size-3.5 text-primary shrink-0" />
                <span>Hover or click another state on the map to switch regional inspection.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="rounded-lg text-xs font-semibold gap-1.5 shadow-2xs border-border/60">
                  <Download className="size-3.5" />
                  <span>Export Regional CSV</span>
                </Button>
                <Button variant="default" size="sm" className="rounded-lg text-xs font-bold px-4 shadow-2xs" onClick={() => setSelectedState(null)}>
                  Close Hub
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function getLabelCoordinates(id: string): { x: number; y: number } {
  const coords: Record<string, { x: number; y: number }> = {
    TX: { x: 445, y: 440 },
    IL: { x: 590, y: 245 },
    FL: { x: 760, y: 470 },
    CA: { x: 100, y: 275 },
    NY: { x: 835, y: 145 },
    NC: { x: 790, y: 320 },
    GA: { x: 730, y: 395 },
  };
  return coords[id] || { x: 480, y: 300 };
}
