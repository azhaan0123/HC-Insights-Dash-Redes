import React, { useState } from "react";
import { Plus, Trash2, Eye, Pencil, Mail } from "lucide-react";
import { Page } from "../../components/layout/Page";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface TemplateRecord {
  id: string;
  name: string;
  isDefault?: boolean;
  type: "CSAT" | "NPS" | "Text";
  from: string;
  subject: string;
}

const INITIAL_TEMPLATES: TemplateRecord[] = [
  { id: "1", name: "default-template-acme", isDefault: true, type: "CSAT", from: "support@acmehealth.com", subject: "How was your recent visit?" },
  { id: "2", name: "follow-up-csat-v2", type: "CSAT", from: "care@acmehealth.com", subject: "Quick 1-minute feedback survey" },
  { id: "3", name: "urgent-care-csat", type: "CSAT", from: "feedback@acmehealth.com", subject: "We value your opinion" },
  { id: "4", name: "default-nps-template-acme", isDefault: true, type: "NPS", from: "leadership@acmehealth.com", subject: "Would you recommend ACME Health?" },
  { id: "5", name: "quarterly-nps-pulse", type: "NPS", from: "experience@acmehealth.com", subject: "Your health journey check-in" },
  { id: "6", name: "sms-short-csat", isDefault: true, type: "Text", from: "ACME-DPC", subject: "Rate visit 1-5" },
];

export default function SurveyTemplates() {
  const [activeTab, setActiveTab] = useState<"CSAT" | "NPS" | "Text">("CSAT");
  const [templates, setTemplates] = useState<TemplateRecord[]>(INITIAL_TEMPLATES);
  
  // Dialog State
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRecord | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ name: "", from: "", subject: "" });

  const filtered = templates.filter((t) => t.type === activeTab);

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenCreate = () => {
    setForm({ name: `new-${activeTab.toLowerCase()}-template`, from: "support@acmehealth.com", subject: "Please rate your experience" });
    setIsCreating(true);
  };

  const handleOpenEdit = (t: TemplateRecord) => {
    setEditingTemplate(t);
    setForm({ name: t.name, from: t.from, subject: t.subject });
  };

  const handleSave = () => {
    if (!form.name) return;
    if (isCreating) {
      const newRec: TemplateRecord = {
        id: Date.now().toString(),
        name: form.name,
        type: activeTab,
        from: form.from,
        subject: form.subject,
      };
      setTemplates((prev) => [...prev, newRec]);
      setIsCreating(false);
    } else if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...form } : t))
      );
      setEditingTemplate(null);
    }
  };

  const setDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.type !== activeTab) return t;
        return { ...t, isDefault: t.id === id };
      })
    );
  };

  const leadingTabs = (
    <div className="inline-flex rounded-md border border-border dark:border-border bg-secondary dark:bg-muted p-1">
      {(["CSAT", "NPS", "Text"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-1.5 text-xs font-semibold rounded transition-all ${
            activeTab === tab
              ? "bg-white dark:bg-card text-primary shadow-2xs"
              : "text-muted-foreground dark:text-muted-foreground/70 hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <Page
      title="Templates"
      subtitle="Note: The default selected template will have a highlighted border color."
      crumbs={[{ label: "Admin & Settings" }]}
      leading={leadingTabs}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="flex justify-end mb-4 max-w-[1600px] mx-auto w-full">
        <Button
          onClick={handleOpenCreate}
          className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-2xs gap-1.5 transition-colors inline-flex items-center"
        >
          <Plus className="size-4" />
          <span>Create Template</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setDefault(item.id)}
            className={`rounded-lg bg-card p-4 shadow-sm flex flex-col transition-all cursor-pointer ${
              item.isDefault
                ? "border-2 border-primary"
                : "border border-border dark:border-border hover:border-border dark:hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground truncate max-w-[180px]" title={item.name}>
                Template
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="text-muted-foreground/70 hover:text-red-600 transition-colors p-1"
                title="Delete template"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="mt-3 bg-secondary/80 dark:bg-muted/30 rounded p-4 flex-1 flex flex-col min-h-[180px] relative overflow-hidden border border-border/50 dark:border-border/50">
              <div className="space-y-1.5 w-full mb-auto text-[10px] text-muted-foreground/70 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-10 text-right">From</span>
                  <div className="h-4 bg-white dark:bg-card border rounded w-32 px-1 flex items-center truncate text-[9px] text-muted-foreground dark:text-muted-foreground/70">
                    {item.from}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10 text-right">Subject</span>
                  <div className="h-4 bg-white dark:bg-card border rounded w-44 px-1 flex items-center truncate text-[9px] text-muted-foreground dark:text-muted-foreground/70">
                    {item.subject}
                  </div>
                </div>
              </div>

              <div className="my-auto text-center">
                <span className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground/70">
                  Template preview not available
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/50 dark:border-border pt-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPreviewTemplate(item)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-foreground/70 hover:text-foreground font-medium transition-colors"
              >
                <Eye className="size-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleOpenEdit(item)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded border border-border dark:border-border bg-muted dark:bg-muted hover:bg-secondary dark:hover:bg-muted/80 font-medium transition-colors text-foreground"
              >
                <Pencil className="size-3.2 text-muted-foreground" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2 font-bold">
              <Mail className="size-5" />
              <span>Preview: {previewTemplate?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-sm">
            <div className="rounded border p-3 bg-muted dark:bg-muted/30 space-y-1 text-xs">
              <div><span className="text-muted-foreground/70">Type:</span> <strong className="text-foreground">{previewTemplate?.type} Survey</strong></div>
              <div><span className="text-muted-foreground/70">From:</span> <span className="text-foreground">{previewTemplate?.from}</span></div>
              <div><span className="text-muted-foreground/70">Subject:</span> <span className="text-foreground font-medium">{previewTemplate?.subject}</span></div>
            </div>
            <div className="border rounded-lg p-6 bg-card text-center space-y-4 shadow-2xs">
              <h3 className="text-lg font-bold text-foreground">{previewTemplate?.subject}</h3>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                Hi [Patient Name], thank you for choosing ACME Health! We would love to hear your feedback on your visit with Dr. Smith.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className="size-8 rounded-full border border-primary text-primary text-xs font-bold flex items-center justify-center">
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setPreviewTemplate(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={isCreating || !!editingTemplate} onOpenChange={() => { setIsCreating(false); setEditingTemplate(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">
              {isCreating ? `Create ${activeTab} Template` : "Edit Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Template Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-3 text-xs" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Sender (From)</Label>
              <Input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="col-span-3 text-xs" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subject Line</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="col-span-3 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditingTemplate(null); }}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
