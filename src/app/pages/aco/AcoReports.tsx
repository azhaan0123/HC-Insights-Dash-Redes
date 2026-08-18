import { FileText, Users, CalendarCheck, BarChart3, Download } from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { acoChips } from "../../data/filters";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../../components/dashboard/SkeletonPrimitives";

export default function AcoReports() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Reports" crumbs={[{ label: "ACO Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  return (
    <Page title="Reports" crumbs={[{ label: "ACO Insights" }]} chips={acoChips}>
      <div className="space-y-6">
        
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">ACO Reports Center</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Access and download standard and custom reports for ACO performance analysis.
          </p>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Monthly ACO Performance Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Overall performance on key quality and cost measures.
            </p>
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="size-4" />
              Download Report
            </Button>
          </Card>

          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Users className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Provider Comparison Report</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Side-by-side comparison of provider performance.
            </p>
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="size-4" />
              Download Report
            </Button>
          </Card>

          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Detailed Gaps in Care List</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              List of all patients with identified care gaps.
            </p>
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="size-4" />
              Download Report
            </Button>
          </Card>

          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Utilization Trend Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Trends for ED visits, hospitalizations, and readmissions.
            </p>
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="size-4" />
              Download Report
            </Button>
          </Card>

        </div>

        {/* Footer Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Custom Report Builder</h2>
          <p className="text-sm text-muted-foreground">
            The custom report builder feature is planned for a future update. This section will allow users to define parameters, select metrics, and generate tailored reports.
          </p>
        </Card>

      </div>
    </Page>
  );
}
