import { Page } from "../../components/layout/Page";
import { outcomesChips } from "../../data/filters";
import { FilePlus, ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function ReportBuilder() {
  return (
    <Page title="Report Builder" crumbs={[{ label: "Patient Outcomes" }]} chips={outcomesChips}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5">
            <div className="space-y-2 max-w-full">
              <label className="text-sm font-medium text-foreground">
                Select Diagnosis
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 justify-between font-normal text-muted-foreground hover:bg-transparent border-border"
                >
                  Choose a diagnosis
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
                <Button className="shrink-0">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
