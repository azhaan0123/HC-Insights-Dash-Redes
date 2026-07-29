import React, { useState } from "react";
import { Page } from "../../components/layout/Page";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { cn } from "../../components/ui/utils";
import { Save, Sliders, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function SurveyConfiguration() {
  // CSAT State
  const [csatEnabled, setCsatEnabled] = useState(true);
  const [csatTemplate, setCsatTemplate] = useState("default-template-acme");
  const [csatRanges, setCsatRanges] = useState({
    low: { label: "Low", min: 1, max: 2 },
    neutral: { label: "Neutral", min: 3, max: 4 },
    satisfied: { label: "Satisfied", min: 5, max: 5 },
  });
  const [csatCooldownSame, setCsatCooldownSame] = useState(0);
  const [csatCooldownSameUnit, setCsatCooldownSameUnit] = useState("Days");
  const [csatCooldownCross, setCsatCooldownCross] = useState(7);
  const [csatCooldownCrossUnit, setCsatCooldownCrossUnit] = useState("Days");
  const [csatAutoSend, setCsatAutoSend] = useState(false);
  const [csatDelayHours, setCsatDelayHours] = useState(900);
  const [csatFreqDays, setCsatFreqDays] = useState(30);
  const [csatSaved, setCsatSaved] = useState(false);

  // NPS State
  const [npsEnabled, setNpsEnabled] = useState(true);
  const [npsTemplate, setNpsTemplate] = useState("default-nps-template-acme");
  const [npsRanges, setNpsRanges] = useState({
    detractor: { label: "Detractor", min: 1, max: 6 },
    passive: { label: "Passive", min: 7, max: 8 },
    promoter: { label: "Promoter", min: 9, max: 10 },
  });
  const [npsCooldownSame, setNpsCooldownSame] = useState(90);
  const [npsCooldownSameUnit, setNpsCooldownSameUnit] = useState("Days");
  const [npsCooldownCross, setNpsCooldownCross] = useState(7);
  const [npsCooldownCrossUnit, setNpsCooldownCrossUnit] = useState("Days");
  const [npsAutoSend, setNpsAutoSend] = useState(false);
  const [npsFreqDays, setNpsFreqDays] = useState(180);
  const [npsSaved, setNpsSaved] = useState(false);

  const handleSaveCsat = () => {
    setCsatSaved(true);
    setTimeout(() => setCsatSaved(false), 2500);
  };

  const handleSaveNps = () => {
    setNpsSaved(true);
    setTimeout(() => setNpsSaved(false), 2500);
  };

  return (
    <Page
      title="Survey Configuration"
      subtitle="Manage CSAT and NPS settings side-by-side. Choose scale, ranges, cooldowns, automation, and templates for each type."
      crumbs={[{ label: "Admin & Settings" }]}
      showGenerateReport={false}
      showFilters={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-[1600px] mx-auto w-full">
        {/* ======================= CSAT CARD ======================= */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">CSAT Settings</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground border border-border/60">
                  Customer Satisfaction
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Configure scale, ranges, cooldowns, automation, and email templates.
              </p>
            </div>
            <Button
              onClick={handleSaveCsat}
              className={cn(
                "h-9 px-4 text-sm font-medium shadow-2xs shrink-0 transition-all flex items-center gap-1.5",
                csatSaved
                  ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              {csatSaved ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save
                </>
              )}
            </Button>
          </div>

          {/* Status Toggle Banner */}
          <div className="rounded-xl border border-border/60 bg-muted/20 dark:bg-muted/10 p-4 flex items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-2.5 rounded-full shrink-0 shadow-xs transition-colors",
                  csatEnabled ? "bg-emerald-500 shadow-emerald-500/50" : "bg-muted-foreground/40"
                )}
              />
              <div>
                <span className="text-sm font-semibold text-foreground block">
                  CSAT Survey Collection
                </span>
                <span className="text-xs text-muted-foreground">
                  {csatEnabled
                    ? "Currently enabled across automated workflows and manual dispatch."
                    : "Surveys are paused. No CSAT invitations will be sent."}
                </span>
              </div>
            </div>
            <Switch
              checked={csatEnabled}
              onCheckedChange={setCsatEnabled}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Scale & Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="size-3.5" />
                Scale
              </label>
              <Input
                disabled
                value="1 - 5 (5-Point Likert Scale)"
                className="h-9 bg-muted/40 text-muted-foreground font-medium cursor-not-allowed border-border/60 text-xs shadow-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Email Template
              </label>
              <Select value={csatTemplate} onValueChange={setCsatTemplate}>
                <SelectTrigger className="h-9 bg-background border-border/60 text-xs shadow-2xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-template-acme">
                    <span>default-template-acme </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-1">(Default)</span>
                  </SelectItem>
                  <SelectItem value="custom-csat-v2">custom-csat-v2</SelectItem>
                  <SelectItem value="post-encounter-csat-v3">post-encounter-csat-v3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Ranges */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Score Classifications & Ranges
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Range 1 - Low */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 1 - Low</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200/80 dark:border-red-800/50">
                    1 - 2
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={csatRanges.low.label}
                    onChange={(e) => setCsatRanges({ ...csatRanges, low: { ...csatRanges.low, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={csatRanges.low.min}
                      onChange={(e) => setCsatRanges({ ...csatRanges, low: { ...csatRanges.low, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={csatRanges.low.max}
                      onChange={(e) => setCsatRanges({ ...csatRanges, low: { ...csatRanges.low, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Range 2 - Neutral */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 2 - Neutral</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                    3 - 4
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={csatRanges.neutral.label}
                    onChange={(e) => setCsatRanges({ ...csatRanges, neutral: { ...csatRanges.neutral, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={csatRanges.neutral.min}
                      onChange={(e) => setCsatRanges({ ...csatRanges, neutral: { ...csatRanges.neutral, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={csatRanges.neutral.max}
                      onChange={(e) => setCsatRanges({ ...csatRanges, neutral: { ...csatRanges.neutral, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Range 3 - Satisfied */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 3 - Satisfied</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                    5 - 5
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={csatRanges.satisfied.label}
                    onChange={(e) => setCsatRanges({ ...csatRanges, satisfied: { ...csatRanges.satisfied, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={csatRanges.satisfied.min}
                      onChange={(e) => setCsatRanges({ ...csatRanges, satisfied: { ...csatRanges.satisfied, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={csatRanges.satisfied.max}
                      onChange={(e) => setCsatRanges({ ...csatRanges, satisfied: { ...csatRanges.satisfied, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cooldowns Section */}
          <div className="rounded-xl border border-border/60 bg-muted/15 dark:bg-muted/5 p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Cooldown Intervals</span>
              <span className="text-[11px] text-muted-foreground ml-auto">Prevent patient survey fatigue</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Same Type Interval</span>
                <span className="text-[11px] text-muted-foreground">Minimum gap before sending another CSAT survey</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Input
                    type="number"
                    value={csatCooldownSame}
                    onChange={(e) => setCsatCooldownSame(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono w-20 px-2.5"
                  />
                  <Select value={csatCooldownSameUnit} onValueChange={setCsatCooldownSameUnit}>
                    <SelectTrigger className="h-8 bg-background border-border/60 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Cross Type Interval</span>
                <span className="text-[11px] text-muted-foreground">Minimum gap after sending any other survey type</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Input
                    type="number"
                    value={csatCooldownCross}
                    onChange={(e) => setCsatCooldownCross(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono w-20 px-2.5"
                  />
                  <Select value={csatCooldownCrossUnit} onValueChange={setCsatCooldownCrossUnit}>
                    <SelectTrigger className="h-8 bg-background border-border/60 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Sending Section */}
          <div className="rounded-xl border border-border/60 bg-muted/15 dark:bg-muted/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Send className="size-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-foreground block">Automatic Sending</span>
                  <span className="text-[11px] text-muted-foreground">Trigger surveys automatically post-encounter</span>
                </div>
              </div>
              <Switch checked={csatAutoSend} onCheckedChange={setCsatAutoSend} />
            </div>

            <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-200", csatAutoSend ? "opacity-100" : "opacity-50 pointer-events-none")}>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Delay After Encounter</span>
                <div className="flex items-center gap-2">
                  <Input
                    disabled={!csatAutoSend}
                    type="number"
                    value={csatDelayHours}
                    onChange={(e) => setCsatDelayHours(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono px-2.5"
                  />
                  <span className="text-xs font-medium text-muted-foreground shrink-0">Hours</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Wait time before sending survey link</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Recurring Frequency</span>
                <div className="flex items-center gap-2">
                  <Input
                    disabled={!csatAutoSend}
                    type="number"
                    value={csatFreqDays}
                    onChange={(e) => setCsatFreqDays(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono px-2.5"
                  />
                  <span className="text-xs font-medium text-muted-foreground shrink-0">Days</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Cadence for recurring patient surveys</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================= NPS CARD ======================= */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">NPS Settings</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground border border-border/60">
                  Net Promoter Score
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Configure scale, ranges, cooldowns, automation, and email templates.
              </p>
            </div>
            <Button
              onClick={handleSaveNps}
              className={cn(
                "h-9 px-4 text-sm font-medium shadow-2xs shrink-0 transition-all flex items-center gap-1.5",
                npsSaved
                  ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              {npsSaved ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save
                </>
              )}
            </Button>
          </div>

          {/* Status Toggle Banner */}
          <div className="rounded-xl border border-border/60 bg-muted/20 dark:bg-muted/10 p-4 flex items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-2.5 rounded-full shrink-0 shadow-xs transition-colors",
                  npsEnabled ? "bg-blue-500 shadow-blue-500/50" : "bg-muted-foreground/40"
                )}
              />
              <div>
                <span className="text-sm font-semibold text-foreground block">
                  NPS Survey Collection
                </span>
                <span className="text-xs text-muted-foreground">
                  {npsEnabled
                    ? "Currently enabled across automated workflows and manual dispatch."
                    : "Surveys are paused. No NPS invitations will be sent."}
                </span>
              </div>
            </div>
            <Switch
              checked={npsEnabled}
              onCheckedChange={setNpsEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Scale & Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="size-3.5" />
                Scale
              </label>
              <Input
                disabled
                value="1 - 10 (10-Point Scale)"
                className="h-9 bg-muted/40 text-muted-foreground font-medium cursor-not-allowed border-border/60 text-xs shadow-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="size-3.5" />
                Email Template
              </label>
              <Select value={npsTemplate} onValueChange={setNpsTemplate}>
                <SelectTrigger className="h-9 bg-background border-border/60 text-xs shadow-2xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default-nps-template-acme">
                    <span>default-nps-template-acme </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-1">(Default)</span>
                  </SelectItem>
                  <SelectItem value="custom-nps-v1">custom-nps-v1</SelectItem>
                  <SelectItem value="quarterly-nps-v2">quarterly-nps-v2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Ranges */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Score Classifications & Ranges
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Range 1 - Detractor */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 1 - Detractor</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200/80 dark:border-red-800/50">
                    1 - 6
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={npsRanges.detractor.label}
                    onChange={(e) => setNpsRanges({ ...npsRanges, detractor: { ...npsRanges.detractor, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={npsRanges.detractor.min}
                      onChange={(e) => setNpsRanges({ ...npsRanges, detractor: { ...npsRanges.detractor, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={npsRanges.detractor.max}
                      onChange={(e) => setNpsRanges({ ...npsRanges, detractor: { ...npsRanges.detractor, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Range 2 - Passive */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 2 - Passive</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50">
                    7 - 8
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={npsRanges.passive.label}
                    onChange={(e) => setNpsRanges({ ...npsRanges, passive: { ...npsRanges.passive, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={npsRanges.passive.min}
                      onChange={(e) => setNpsRanges({ ...npsRanges, passive: { ...npsRanges.passive, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={npsRanges.passive.max}
                      onChange={(e) => setNpsRanges({ ...npsRanges, passive: { ...npsRanges.passive, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Range 3 - Promoter */}
              <div className="rounded-xl border border-border/60 bg-card p-3.5 flex flex-col gap-3 shadow-2xs transition-all hover:border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Range 3 - Promoter</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
                    9 - 10
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Label</span>
                  <Input
                    value={npsRanges.promoter.label}
                    onChange={(e) => setNpsRanges({ ...npsRanges, promoter: { ...npsRanges.promoter, label: e.target.value } })}
                    className="h-8 bg-background border-border/60 text-xs px-2.5 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Min</span>
                    <Input
                      type="number"
                      value={npsRanges.promoter.min}
                      onChange={(e) => setNpsRanges({ ...npsRanges, promoter: { ...npsRanges.promoter, min: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Max</span>
                    <Input
                      type="number"
                      value={npsRanges.promoter.max}
                      onChange={(e) => setNpsRanges({ ...npsRanges, promoter: { ...npsRanges.promoter, max: Number(e.target.value) } })}
                      className="h-8 bg-background border-border/60 text-xs px-2 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cooldowns Section */}
          <div className="rounded-xl border border-border/60 bg-muted/15 dark:bg-muted/5 p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Cooldown Intervals</span>
              <span className="text-[11px] text-muted-foreground ml-auto">Prevent patient survey fatigue</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Same Type Interval</span>
                <span className="text-[11px] text-muted-foreground">Minimum gap before sending another NPS survey</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Input
                    type="number"
                    value={npsCooldownSame}
                    onChange={(e) => setNpsCooldownSame(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono w-20 px-2.5"
                  />
                  <Select value={npsCooldownSameUnit} onValueChange={setNpsCooldownSameUnit}>
                    <SelectTrigger className="h-8 bg-background border-border/60 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Cross Type Interval</span>
                <span className="text-[11px] text-muted-foreground">Minimum gap after sending any other survey type</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Input
                    type="number"
                    value={npsCooldownCross}
                    onChange={(e) => setNpsCooldownCross(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono w-20 px-2.5"
                  />
                  <Select value={npsCooldownCrossUnit} onValueChange={setNpsCooldownCrossUnit}>
                    <SelectTrigger className="h-8 bg-background border-border/60 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Automatic Sending Section */}
          <div className="rounded-xl border border-border/60 bg-muted/15 dark:bg-muted/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Send className="size-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-foreground block">Automatic Sending</span>
                  <span className="text-[11px] text-muted-foreground">Trigger surveys automatically on a recurring cadence</span>
                </div>
              </div>
              <Switch checked={npsAutoSend} onCheckedChange={setNpsAutoSend} />
            </div>

            <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-200", npsAutoSend ? "opacity-100" : "opacity-50 pointer-events-none")}>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground">Recurring Frequency</span>
                <div className="flex items-center gap-2">
                  <Input
                    disabled={!npsAutoSend}
                    type="number"
                    value={npsFreqDays}
                    onChange={(e) => setNpsFreqDays(Number(e.target.value))}
                    className="h-8 bg-background border-border/60 text-xs font-mono px-2.5"
                  />
                  <span className="text-xs font-medium text-muted-foreground shrink-0">Days</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Cadence for periodic NPS surveys</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
