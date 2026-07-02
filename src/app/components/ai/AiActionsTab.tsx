import React from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { PenTool, BarChart3, Zap, Users, MessageSquare, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function AiActionsTab() {
  return (
    <ScrollArea className="flex-1 min-h-0 h-full px-4 py-2">
      <div className="flex flex-col gap-4 pb-4">
        
        {/* Drafting Assistant */}
        <Card className="shadow-none border-border/60">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PenTool className="size-4 text-blue-500" />
              Drafting Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            
            <div className="flex items-center p-1 border rounded-lg bg-card shadow-sm w-full overflow-hidden">
              <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0">
                <Users className="size-3.5" />
                Audience
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate px-2">Diabetic patients due for A1C</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-md text-xs font-medium w-fit border border-transparent">
                <FileText className="size-3.5" />
                Draft Message
              </div>
              <Textarea 
                className="text-sm resize-none h-28 focus-visible:ring-1 bg-muted/30" 
                defaultValue="Hi [Patient Name], our records indicate you are due for your routine A1C screening. Keeping track of this is vital for your health. Please reply or call us to schedule your appointment."
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" className="flex-1 text-xs font-medium shadow-sm">Send Campaign</Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs font-medium shadow-sm">Regenerate</Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Automations */}
        <Card className="shadow-none border-purple-500/20 bg-purple-500/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Zap className="size-4" />
              Automated Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <p className="text-sm font-medium text-foreground leading-snug">
              Schedule follow-ups for all high-risk patients missing their annual wellness visit.
            </p>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center p-1 border border-purple-500/20 rounded-lg bg-background/80 shadow-sm w-full overflow-hidden">
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0">
                  <Users className="size-3.5" />
                  Target
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate px-2">Found 24 patients</span>
              </div>
              
              <div className="flex items-center p-1 border border-purple-500/20 rounded-lg bg-background/80 shadow-sm w-full overflow-hidden">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0">
                  <MessageSquare className="size-3.5" />
                  Action
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate px-2">Send SMS reminder link</span>
              </div>
            </div>

            <Button size="sm" className="w-full text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-sm mt-1">
              Approve & Execute
            </Button>
          </CardContent>
        </Card>

        {/* Natural Language Chart Builder */}
        <Card className="shadow-none border-dashed border-2 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors bg-transparent">
          <CardContent className="p-6 text-center">
            <div className="grid place-items-center size-12 bg-muted rounded-full mx-auto mb-3">
              <BarChart3 className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold mb-1">Widget Builder</p>
            <p className="text-xs text-muted-foreground mb-4">
              Describe a chart or report you want to build and pin to your dashboard.
            </p>
            <Button size="sm" variant="secondary" className="text-xs font-medium w-full shadow-sm">
              Open Builder
            </Button>
          </CardContent>
        </Card>

      </div>
    </ScrollArea>
  );
}
