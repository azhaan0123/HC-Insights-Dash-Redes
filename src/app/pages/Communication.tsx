import { Page } from "../components/layout/Page";
import { Panel } from "../components/dashboard/EmptyState";
import { GroupedBar } from "../components/dashboard/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronDown } from "../lib/icons";
import { usePageLoading } from "../hooks/usePageLoading";
import { PanelSkeleton } from "../components/dashboard/SkeletonPrimitives";

const inboundRate = [
  { name: "Jan", Answered: 42, Unanswered: 8 },
  { name: "Apr", Answered: 55, Unanswered: 12 },
  { name: "Jul", Answered: 38, Unanswered: 6 },
  { name: "Oct", Answered: 61, Unanswered: 14 },
];

const outboundRate = [
  { name: "Sep", Answered: 18, Unanswered: 4 },
  { name: "Oct", Answered: 34, Unanswered: 7 },
  { name: "Nov", Answered: 52, Unanswered: 9 },
  { name: "Dec", Answered: 41, Unanswered: 6 },
];

const HOURS = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
const TEAM = [
  "Amber Wenner, Medical Administrative Assistant",
  "Amanda Barrera, MA/CNA",
  "Angela Gonzalez, Care Coordinator II",
  "Danielle Joy, LPN",
  "Caleb White, MA",
];

function heatCell(value: number) {
  if (value === 0) return "";
  const intensity = Math.min(value / 30, 1);
  return `rgba(22, 163, 74, ${0.12 + intensity * 0.55})`;
}

function HeatTable() {
  // deterministic values per cell
  const grid = TEAM.map((_, r) =>
    HOURS.map((_, c) => ((r * 7 + c * 3) % 11) * 3),
  );
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="text-xs text-muted-foreground">Team Member</TableHead>
            {HOURS.map((h) => (
              <TableHead key={h} className="text-center text-xs text-muted-foreground">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {TEAM.map((member, r) => (
            <TableRow key={member}>
              <TableCell className="max-w-[220px] truncate text-sm">{member}</TableCell>
              {HOURS.map((h, c) => (
                <TableCell
                  key={h}
                  className="text-center text-xs tabular-nums transition-[background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/10"
                  style={{ backgroundColor: heatCell(grid[r][c]) }}
                >
                  {grid[r][c] || ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs outline-none">
        {label} <ChevronDown className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuItem key={o}>{o}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Communication() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Communication">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
          <PanelSkeleton height={220} />
          <PanelSkeleton height={220} />
        </div>
        <PanelSkeleton height={180} className="mb-6" />
        <PanelSkeleton height={180} className="mb-6" />
        <PanelSkeleton height={180} className="mb-6" />
      </Page>
    );
  }

  return (
    <Page title="Communication" chips={[]} showGenerateReport showIconActions={false}>
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="Date Range" options={["Last 30 days", "Last 90 days", "This year"]} />
        <FilterDropdown label="Event Type" options={["All", "Inbound", "Outbound"]} />
        <FilterDropdown label="Communication Type" options={["All", "Voice", "Message"]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 stagger-section mb-6">
        <Panel title="Inbound Voice Call Response Rate Per Day">
          <GroupedBar
            data={inboundRate}
            series={[
              { key: "Answered", name: "Answered", color: "#16a34a" },
              { key: "Unanswered", name: "Unanswered", color: "var(--destructive)" },
            ]}
            height={240}
          />
        </Panel>
        <Panel title="Outbound Voice Call Response Rate Per Day">
          <GroupedBar
            data={outboundRate}
            series={[
              { key: "Answered", name: "Answered", color: "#16a34a" },
              { key: "Unanswered", name: "Unanswered", color: "var(--destructive)" },
            ]}
            height={240}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 stagger-section mb-6">
        <Panel title="Calls Made by Hour of Day Per Team Member Each Month">
          <HeatTable />
        </Panel>
        <Panel title="Messages Sent by Hour of Day Per Team Member Each Month">
          <HeatTable />
        </Panel>
      </div>

      <div className="stagger-section">
        <Panel title="Voice Calls Answered by Hour of Day Per Team Member Per Month">
          <HeatTable />
        </Panel>
      </div>
    </Page>
  );
}
