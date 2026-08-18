import { Shield } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { AiAuditTab } from "../../components/ai/AiAuditTab";

export default function AdminAuditLog() {
  return (
    <Page
      title="Trust & Regulatory Audit Log"
      crumbs={[{ label: "Admin & Settings" }]}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col h-[80vh] min-h-[600px]">
          <div className="px-6 py-4 border-b border-border bg-muted/10 shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Shield className="size-4 text-primary" />
              System-Wide HIPAA Regulatory Trail & AI Trust Metrics
            </h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto bg-background">
            <AiAuditTab />
          </div>
        </div>
      </div>
    </Page>
  );
}
