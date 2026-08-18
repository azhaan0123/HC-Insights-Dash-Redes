import { Search, Mail, LineChart, Globe } from "../lib/icons";
import { Page } from "../components/layout/Page";
import { KpiCard } from "../components/dashboard/KpiCard";
import { Panel } from "../components/dashboard/EmptyState";
import { Sparkline } from "../components/dashboard/charts";
import { DataTable, type Column } from "../components/dashboard/DataTable";
import { seoKeywords } from "../data/datasets";
import { usePageLoading } from "../hooks/usePageLoading";
import { KpiCardSkeleton, TableSkeleton } from "../components/dashboard/SkeletonPrimitives";

export default function Marketing() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Marketing">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </Page>
    );
  }

  const seoColumns: Column<typeof seoKeywords[0]>[] = [
    { key: "keyword", header: "Keyword" },
    { key: "volume", header: "Monthly Search Volume", align: "right" },
    { key: "april", header: "April Rank", align: "center" },
    { key: "may", header: "May Rank", align: "center" },
    { key: "june", header: "June Rank", align: "center" },
    { key: "trend", header: "Rank Analysis", cell: (r) => <Sparkline data={r.trend} /> }
  ];
  return (
    <Page title="Marketing" chips={[]} showGenerateReport={false}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-section mb-6">
        <KpiCard icon={Search} title="SEO Performance" value="29" caption="Total Keywords" />
        <KpiCard
          icon={Mail}
          title="Email Campaign Overview"
          subs={[
            { value: "20240", label: "Emails Sent" },
            { value: "18894", label: "Delivered" },
            { value: "7957", label: "Opens" },
            { value: "929", label: "Clicks" },
            { value: "112", label: "Replies" },
          ]}
        />
        <KpiCard
          icon={LineChart}
          title="Google Analytics - Summary"
          subs={[
            { value: "148", label: "Visitors" },
            { value: "133", label: "New Visitors" },
            { value: "165.4", label: "Avg. Engagement Time" },
          ]}
        />
        <KpiCard
          icon={Globe}
          title="Google Search Console"
          subs={[
            { value: "5676", label: "Impressions" },
            { value: "56", label: "Clicks" },
          ]}
        />
      </div>

      <div className="stagger-section">
        <Panel title="SEO Performance">
          <DataTable 
            columns={seoColumns} 
            rows={seoKeywords} 
            rowKey={(r) => r.keyword} 
            attached 
            dense
          />
        </Panel>
      </div>
    </Page>
  );
}
