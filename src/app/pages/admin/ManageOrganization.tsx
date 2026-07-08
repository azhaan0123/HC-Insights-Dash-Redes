import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Info, ChevronDown } from "lucide-react";
import { Page } from "../../components/layout/Page";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface OrgRecord {
  id: string;
  name: string;
  hasDropdown?: boolean;
  clientId: string;
  website: string;
  address: string;
  type: string;
}

const INITIAL_ORGS: OrgRecord[] = [
  { id: "1", name: "ACME Health", hasDropdown: true, clientId: "NET8443220", website: "www.genovo.com", address: "Albertoberg, 92511", type: "Network" },
  { id: "2", name: "Click Here", clientId: "NET6394768", website: "---", address: "Pune, 4", type: "Network" },
  { id: "3", name: "Blue Ridge Health Clinic", clientId: "DPC7807877", website: "https://www.blueridgehealthclinic.com", address: "Asheville, 28801", type: "DPC Independent" },
  { id: "4", name: "HC Test DPC", clientId: "DPC1344903", website: "---", address: "Schenectady, 12345", type: "DPC Independent" },
  { id: "5", name: "Heritage Health Center", clientId: "DPC1666540", website: "https://www.heritagehealthcanter.com", address: "Nashville, 37203", type: "DPC Independent" },
  { id: "6", name: "Horizon Health Partners - Test", clientId: "NET3704979", website: "https://www.horizonhealthpartners.com", address: "Phoenix, 85004", type: "Network" },
  { id: "7", name: "Lakeside Medical Clinic", clientId: "NET8943957", website: "https://www.lakesidemedicalclinic.com", address: "Chicago, 60601", type: "Network" },
  { id: "8", name: "Maple Grove Medical Center", clientId: "NET0466661", website: "https://example.com", address: "Minneapolis, 55401", type: "Network" },
  { id: "9", name: "My Org Auto demo", clientId: "NET2460785", website: "---", address: "pune, 401109", type: "Network" },
  { id: "10", name: "Primary Health Partners", hasDropdown: true, clientId: "NET2408986", website: "https://primary-healthpartners.com/", address: "Ardmore, 73401", type: "Network" },
  { id: "11", name: "Testing Multi Loc HQ", clientId: "DPC9918231", website: "https://multiloc.com", address: "Dallas, 75201", type: "DPC Multi Location HQ" },
  { id: "12", name: "Testing Ind DPC", clientId: "DPC1102934", website: "---", address: "Austin, 78701", type: "DPC Independent" },
  { id: "13", name: "Elation Partners Group", clientId: "NET8812341", website: "https://elationhealth.com", address: "San Francisco, 94105", type: "Network" },
  { id: "14", name: "Midwest Direct Care", clientId: "DPC4455123", website: "https://midwestdirect.org", address: "Omaha, 68102", type: "DPC Independent" },
  { id: "15", name: "Sunstate Healthcare Network", clientId: "NET3321987", website: "https://sunstatehealth.com", address: "Miami, 33101", type: "Network" },
  { id: "16", name: "Pacific Northwest DPC Coalition", clientId: "NET7712345", website: "https://pnwdpc.org", address: "Seattle, 98101", type: "Network" },
];

export default function ManageOrganization() {
  const [orgs, setOrgs] = useState<OrgRecord[]>(INITIAL_ORGS);
  const [typeFilter, setTypeFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrgRecord | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    clientId: "NET9921834",
    website: "https://www.",
    address: "",
    type: "Network",
  });

  const filteredOrgs = useMemo(() => {
    return orgs.filter((o) => {
      if (typeFilter && typeFilter !== "All" && o.type !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [orgs, typeFilter]);

  const handleReset = () => {
    setTypeFilter("All");
  };

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setFormData({
      name: "",
      clientId: `NET${Math.floor(1000000 + Math.random() * 9000000)}`,
      website: "https://www.",
      address: "",
      type: "Network",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (org: OrgRecord) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      clientId: org.clientId,
      website: org.website,
      address: org.address,
      type: org.type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSave = () => {
    if (!formData.name) return;
    if (editingOrg) {
      setOrgs((prev) =>
        prev.map((o) => (o.id === editingOrg.id ? { ...o, ...formData } : o))
      );
    } else {
      const newOrg: OrgRecord = {
        id: Date.now().toString(),
        ...formData,
      };
      setOrgs((prev) => [newOrg, ...prev]);
    }
    setIsModalOpen(false);
  };

  const columns: Column<OrgRecord>[] = [
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
              <TooltipContent>Registered Primary Organization</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: (r) => (
        <div className="flex items-center gap-1.5 max-w-[260px] truncate font-medium text-foreground">
          <span className="truncate">{r.name}</span>
          {r.hasDropdown && <ChevronDown className="size-3.5 text-muted-foreground/70 shrink-0" />}
        </div>
      ),
    },
    { key: "clientId", header: "Client ID", className: "text-muted-foreground dark:text-muted-foreground/70 font-mono text-xs" },
    {
      key: "website",
      header: "Website",
      cell: (r) =>
        r.website !== "---" ? (
          <a
            href={r.website.startsWith("http") ? r.website : `https://${r.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline truncate max-w-[220px] block"
          >
            {r.website}
          </a>
        ) : (
          <span className="text-muted-foreground/70">---</span>
        ),
    },
    { key: "address", header: "Address", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "type", header: "Type", className: "text-muted-foreground dark:text-muted-foreground/70" },
    {
      key: "action",
      header: "Action",
      align: "center",
      cell: (r) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEdit(r)}
            className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-secondary dark:hover:bg-card transition-colors"
            title="Edit organization"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(r.id)}
            className="p-1 rounded text-muted-foreground hover:text-red-600 hover:bg-secondary dark:hover:bg-card transition-colors"
            title="Delete organization"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Page
      title="Manage Organization"
      crumbs={[{ label: "Admin & Settings" }]}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Filters & Actions Bar */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/70">
                Select Primary Organization Type
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[220px] bg-background border-border dark:border-border text-sm shadow-2xs">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="DPC Independent">DPC Independent</SelectItem>
                  <SelectItem value="DPC Multi Location HQ">DPC Multi Location HQ</SelectItem>
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
          </div>

          <Button
            className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-2xs gap-1.5 transition-colors inline-flex items-center"
            onClick={handleOpenAdd}
          >
            <Plus className="size-4" />
            <span>Primary Organization</span>
          </Button>
        </div>

        {/* Directory Table Primitive */}
        <DataTable
          columns={columns}
          rows={filteredOrgs}
          rowKey={(row) => row.id}
          pageSize={10}
        />

        {/* Add / Edit Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-primary font-bold">
                {editingOrg ? "Edit Primary Organization" : "Add Primary Organization"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="orgname" className="text-right">
                  Org Name
                </Label>
                <Input
                  id="orgname"
                  placeholder="ACME Healthcare"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientid" className="text-right">
                  Client ID
                </Label>
                <Input
                  id="clientid"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="web" className="text-right">
                  Website
                </Label>
                <Input
                  id="web"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="addr" className="text-right">
                  Address
                </Label>
                <Input
                  id="addr"
                  placeholder="City, Zip"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="DPC Independent">DPC Independent</SelectItem>
                      <SelectItem value="DPC Multi Location HQ">DPC Multi Location HQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
                Save Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Page>
  );
}
