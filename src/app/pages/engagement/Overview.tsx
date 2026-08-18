import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  Stethoscope,
  Activity,
  HeartPulse,
  Clock,
  Gauge,
  Pill,
  PackageCheck,
  Moon,
  PillBottle,
  MessageSquare,
  MessagesSquare,
  MoonStar,
  Smartphone,
} from "../../lib/icons";
import { Page } from "../../components/layout/Page";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { engagementChips } from "../../data/filters";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton } from "../../components/dashboard/SkeletonPrimitives";

function SectionLabel({ children }: { children: string }) {
  return (
    <h3 className="mb-3 mt-1 flex items-center gap-2 text-xs tracking-wide text-muted-foreground/80 uppercase">
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  );
}

export default function EngagementOverview() {
  const navigate = useNavigate();
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <Page title="Engagement and Utilization" chips={engagementChips}>
        {[0, 1, 2].map((s) => (
          <section key={s} className="stagger-section">
            <div className="mb-3 mt-1 flex items-center gap-2">
              <div className="h-3 w-24 rounded bg-accent animate-pulse" />
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (<KpiCardSkeleton key={i} />))}
            </div>
          </section>
        ))}
      </Page>
    );
  }

  return (
    <Page title="Engagement and Utilization" chips={engagementChips}>
      <section className="stagger-section">
        <SectionLabel>Patient Activity</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <KpiCard
            icon={Users}
            title="Active Patients (As of End Date)"
            value="2,823"
            caption="Total active patients as of end date"
            info="This is the count of active patients who are Active on a Direct Primary Care plan, as of the Selected End Date."
            onClick={() => navigate("/engagement/active-patients")}
          />
          <KpiCard
            icon={UserCheck}
            title="Total Active Patients (Selected Duration)"
            value="2,823"
            caption="Total signed-up active patients"
            info="This is the cumulative count of active patients who have signed up for the Direct Primary Care plan, between the selected Start and End dates."
            onClick={() => navigate("/engagement/total-active-patients")}
          />
          <KpiCard
            icon={Stethoscope}
            title="Total # Encounters"
            value="7,214"
            caption="Encounters during selected timeframe"
            info="This is the total number of encounters that have occurred during the selected period for all employees on the plan, as of the latest date and time the dashboard was updated. This includes office visits, chat (conversations via the Spruce messaging application), and telehealth encounters."
            onClick={() => navigate("/engagement/encounters")}
          />
          <KpiCard
            icon={Activity}
            title="Encounter Types - Breakdown"
            subs={[
              { value: "53.2%", label: "In Person" },
              { value: "17.6%", label: "Virtual" },
              { value: "15%", label: "Telehealth" },
            ]}
            info="This is the breakdown of encounters by type, including in-person, telehealth, and chat (conversations through the Spruce messaging application), for the selected period."
            onClick={() => navigate("/engagement/encounter-types-breakdown")}
          />
          <KpiCard
            icon={HeartPulse}
            title="Care Episodes - Breakdown"
            value="39,903"
            caption="Total care episodes"
            info="This is the breakdown of encounters by the type of care provided, examples include Med Management, Blood Work, etc."
            onClick={() => navigate("/engagement/care-episodes-breakdown")}
          />
        </div>
      </section>

      <section className="stagger-section">
        <SectionLabel>Encounters & Prescriptions</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <KpiCard
            icon={Clock}
            title="Total # After Hours Encounters"
            value="6,627"
            caption="Total after-hours encounters"
            info="This represents the total count of encounters that occurred after 5 PM and before 8 AM (Local Practice Timezone) on weekdays, as well as any time during weekends."
            onClick={() => navigate("/engagement/after-hours-encounters")}
          />
          <KpiCard
            icon={Gauge}
            title="Patient Touch Ratio"
            value="99.2%"
            caption="Patient touch ratio"
            info="This ratio, expressed as a percentage, represents the proportion of active patients who have had any type of encounter during the selected period."
            onClick={() => navigate("/engagement/patient-touch-ratio")}
          />
          <KpiCard
            icon={Pill}
            title="Prescription Orders"
            subs={[{ value: "5,417", label: "Overall" }, { value: "726", label: "Refills (13.4%)" }]}
            info="This is the count of all prescription orders. The refill count and percentage provide the count of refill prescription orders and the percentage (% of all overall prescription orders)."
            onClick={() => navigate("/engagement/prescriptions")}
          />
          <KpiCard
            icon={PackageCheck}
            title="Prescription Orders - Breakdown"
            value="100%"
            caption="In-Office Dispensed"
            info="This is the breakdown of prescription orders by types of prescription dispensed, i.e., “In-Office Dispensed”, “Retail”, and “Mail Order”, for the selected period."
            onClick={() => navigate("/engagement/prescriptions-breakdown")}
          />
          <KpiCard
            icon={Moon}
            title="Total # Active Manifest Members"
            value="225"
            caption="Total active manifest members"
            info="All currently active manifest members on your plan"
            onClick={() => navigate("/engagement/total-active-manifest-members")}
          />
        </div>
      </section>

      <section className="stagger-section">
        <SectionLabel>Messaging & Digital</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <KpiCard
            icon={PillBottle}
            title="Total # After Hours Prescriptions"
            subs={[{ value: "5,382", label: "Overall" }, { value: "719", label: "Refills (13.4%)" }]}
            info="This is the count of all after-hours prescription orders. The refills count and percentage provide the refill prescription order count and the percentage (% of all the after-hours prescription orders). All orders made after 5 PM and before 8 AM (Local Practice Timezone) on weekdays, and anytime during weekends or standard federal holidays, are considered after hours."
            onClick={() => navigate("/engagement/after-hours-prescriptions")}
          />
          <KpiCard
            icon={MessageSquare}
            title="Total # Messages"
            value="446"
            caption="Messages during selected timeframe"
            info="This is the total number of phone calls, chats, texts, and messages exchanged during the selected period with all employees on the plan, through the communication system. It includes messages from both the patient and the doctor/doctor's team, covering all conversations."
            onClick={() => navigate("/engagement/messages")}
          />
          <KpiCard
            icon={MessagesSquare}
            title="Message Types - Breakdown"
            value="100%"
            caption="Spruce Messages"
            info="This is the breakdown of messages across different types, such as chat, call, and email, for the selected period."
            onClick={() => navigate("/engagement/message-types-breakdown")}
          />
          <KpiCard
            icon={MoonStar}
            title="Total # After Hours Messages"
            value="369"
            caption="After hours & weekends"
            info="This is the count of all messages sent after 5 PM and before 8 AM (Local Practice Timezone) on weekdays, as well as anytime during weekends."
            onClick={() => navigate("/engagement/after-hours-messages")}
          />
          <KpiCard
            icon={Smartphone}
            title="Digital Engagement"
            subs={[{ value: "65", label: "Overall" }, { value: "65", label: "AfterHours (100%)" }]}
            info="This is the count of all active adult patients who have communicated with the practice via digital channels (email, secure message, SMS). The 'Overall' count provide the total digital communications, while 'Afterhours' count and percentage includes only those patients who communicated outside regular business hours."
            onClick={() => navigate("/engagement/digital-engagement")}
          />
        </div>
      </section>
    </Page>
  );
}
