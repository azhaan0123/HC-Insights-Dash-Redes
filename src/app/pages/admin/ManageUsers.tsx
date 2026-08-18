import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Info } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { DataTable, type Column } from "../../components/dashboard/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface UserRecord {
  id: string;
  username: string;
  clientId: string;
  name: string;
  userType: string;
  orgName: string;
  role: string;
  status: boolean;
}

const INITIAL_USERS: UserRecord[] = [
  { id: "1", username: "sanket.pande@healthcompiler.com", clientId: "NET8443220", name: "Sanket Pande", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
  { id: "2", username: "burhan@healthcompiler.com", clientId: "NET8443220", name: "Burhan Mithaiwala", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "3", username: "test@test.com", clientId: "NET8443220", name: "Test User", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "4", username: "siddharth.marathe@healthcompiler.com", clientId: "NET8443220", name: "Siddharth Marathe", userType: "Network", orgName: "ACME Health", role: "Admin", status: true },
  { id: "5", username: "MichaelBrown909@gmail.com", clientId: "NET8443220", name: "Michael Brown", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "6", username: "schwan@gmail.com", clientId: "NET8443220", name: "John schwan", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "7", username: "testbroker12@gmail.com", clientId: "NET8443220", name: "Test Broker", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "8", username: "testbroker@gmail.com", clientId: "NET8443220", name: "Test Broker", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "9", username: "burhan.acme@healthcompiler.com", clientId: "NET8443220", name: "Burhan Test", userType: "Network", orgName: "ACME Health", role: "Admin", status: true },
  { id: "10", username: "HealthCompiler+partner@elationhealth.com", clientId: "NET8443220", name: "Healthcompiler Elation", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "11", username: "sarah.connor@acmehealth.com", clientId: "NET8443220", name: "Sarah Connor", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "12", username: "kyle.reese@acmehealth.com", clientId: "NET8443220", name: "Kyle Reese", userType: "Network", orgName: "ACME Health", role: "User", status: false },
  { id: "13", username: "john.doe@heritagehealth.com", clientId: "NET8443220", name: "John Doe", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
  { id: "14", username: "jane.smith@hcclinic.com", clientId: "NET8443220", name: "Jane Smith", userType: "DPC", orgName: "HC Clinic", role: "Admin", status: true },
  { id: "15", username: "robert.miller@acmeconsultant.com", clientId: "NET8443220", name: "Robert Miller", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "16", username: "emily.davis@acmehealth.com", clientId: "NET8443220", name: "Emily Davis", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "17", username: "william.wilson@acmehealth.com", clientId: "NET8443220", name: "William Wilson", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "18", username: "david.taylor@hcclinic.com", clientId: "NET8443220", name: "David Taylor", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "19", username: "richard.anderson@heritagehealth.com", clientId: "NET8443220", name: "Richard Anderson", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
  { id: "20", username: "joseph.thomas@acmeconsultant.com", clientId: "NET8443220", name: "Joseph Thomas", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "21", username: "charles.jackson@acmehealth.com", clientId: "NET8443220", name: "Charles Jackson", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "22", username: "mary.white@acmehealth.com", clientId: "NET8443220", name: "Mary White", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "23", username: "patricia.harris@hcclinic.com", clientId: "NET8443220", name: "Patricia Harris", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "24", username: "jennifer.martin@heritagehealth.com", clientId: "NET8443220", name: "Jennifer Martin", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
  { id: "25", username: "elizabeth.thompson@acmeconsultant.com", clientId: "NET8443220", name: "Elizabeth Thompson", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "26", username: "linda.garcia@acmehealth.com", clientId: "NET8443220", name: "Linda Garcia", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "27", username: "barbara.martinez@acmehealth.com", clientId: "NET8443220", name: "Barbara Martinez", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "28", username: "susan.robinson@hcclinic.com", clientId: "NET8443220", name: "Susan Robinson", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "29", username: "jessica.clark@heritagehealth.com", clientId: "NET8443220", name: "Jessica Clark", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
  { id: "30", username: "thomas.rodriguez@acmeconsultant.com", clientId: "NET8443220", name: "Thomas Rodriguez", userType: "Broker / Consultant", orgName: "ACME Consultant", role: "User", status: true },
  { id: "31", username: "daniel.lewis@acmehealth.com", clientId: "NET8443220", name: "Daniel Lewis", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "32", username: "paul.lee@acmehealth.com", clientId: "NET8443220", name: "Paul Lee", userType: "Network", orgName: "ACME Health", role: "User", status: true },
  { id: "33", username: "mark.walker@hcclinic.com", clientId: "NET8443220", name: "Mark Walker", userType: "DPC", orgName: "HC Clinic", role: "User", status: true },
  { id: "34", username: "donald.hall@heritagehealth.com", clientId: "NET8443220", name: "Donald Hall", userType: "DPC", orgName: "Heritage Health Center", role: "User", status: true },
];

export default function ManageUsers() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [primaryOrgType, setPrimaryOrgType] = useState("Network");
  const [orgNameFilter, setOrgNameFilter] = useState("ACME Health");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    clientId: "NET8443220",
    name: "",
    userType: "Network",
    orgName: "ACME Health",
    role: "User",
    status: true,
  });

  const handleReset = () => {
    setPrimaryOrgType("Network");
    setOrgNameFilter("ACME Health");
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      clientId: "NET8443220",
      name: "",
      userType: "DPC",
      orgName: "Heritage Health Center",
      role: "User",
      status: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      clientId: user.clientId,
      name: user.name,
      userType: user.userType,
      orgName: user.orgName,
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
    );
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newUser: UserRecord = {
        id: Date.now().toString(),
        ...formData,
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsModalOpen(false);
  };

  const columns: Column<UserRecord>[] = [
    { key: "username", header: "Username", cell: (r) => <span className="truncate max-w-[260px] block" title={r.username}>{r.username}</span> },
    { key: "clientId", header: "Client ID", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "name", header: "Name", className: "font-medium text-foreground" },
    { key: "userType", header: "User Type", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "orgName", header: "Organization Name", className: "text-muted-foreground dark:text-muted-foreground/70" },
    { key: "role", header: "User Role", className: "text-muted-foreground dark:text-muted-foreground/70" },
    {
      key: "status",
      header: (
        <div className="flex items-center gap-1">
          <span>Status</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-muted-foreground/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>Active or Suspended status</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: (r) => (
        <Switch
          checked={r.status}
          onCheckedChange={() => handleToggleStatus(r.id)}
          className="data-[state=checked]:bg-emerald-500 scale-90 origin-left"
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      cell: (r) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEdit(r)}
            className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-secondary dark:hover:bg-card transition-colors"
            title="Edit user"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(r.id)}
            className="p-1 rounded text-muted-foreground hover:text-red-600 hover:bg-secondary dark:hover:bg-card transition-colors"
            title="Delete user"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Page
      title="Manage Users"
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
              <Select value={primaryOrgType} onValueChange={setPrimaryOrgType}>
                <SelectTrigger className="h-9 w-[220px] bg-background border-border dark:border-border text-sm shadow-2xs">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="DPC">DPC</SelectItem>
                  <SelectItem value="Broker / Consultant">Broker / Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/70">
                Select Organization Name
              </label>
              <Select value={orgNameFilter} onValueChange={setOrgNameFilter}>
                <SelectTrigger className="h-9 w-[220px] bg-background border-border dark:border-border text-sm shadow-2xs">
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACME Health">ACME Health</SelectItem>
                  <SelectItem value="Heritage Health Center">Heritage Health Center</SelectItem>
                  <SelectItem value="HC Clinic">HC Clinic</SelectItem>
                  <SelectItem value="ACME Consultant">ACME Consultant</SelectItem>
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
            <span>Add User</span>
          </Button>
        </div>

        {/* Users Directory Table Primitive */}
        <DataTable
          columns={columns}
          rows={users}
          rowKey={(row) => row.id}
          pageSize={10}
        />

        {/* Add / Edit Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-primary font-bold">
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientId" className="text-right">
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3 text-xs"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">User Type</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.userType}
                    onValueChange={(val) => setFormData({ ...formData, userType: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="DPC">DPC</SelectItem>
                      <SelectItem value="Broker / Consultant">Broker / Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Organization</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.orgName}
                    onValueChange={(val) => setFormData({ ...formData, orgName: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACME Health">ACME Health</SelectItem>
                      <SelectItem value="Heritage Health Center">Heritage Health Center</SelectItem>
                      <SelectItem value="HC Clinic">HC Clinic</SelectItem>
                      <SelectItem value="ACME Consultant">ACME Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Role</Label>
                <div className="col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    checked={formData.status}
                    onCheckedChange={(val) => setFormData({ ...formData, status: val })}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formData.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
                Save User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Page>
  );
}
