import { MoreHorizontal } from "../../lib/icons";
import { 
  AreaChart, Area, XAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { cn } from "../ui/utils";

export type KpiSparklineCardProps = {
  title: string;
  value: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  data: Array<any>;
  dataKey?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
};

export function KpiSparklineCard({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  data, 
  dataKey = "value",
  color = "#10b981",
  onClick,
  className
}: KpiSparklineCardProps) {
  const gradientId = `grad-${title.replace(/[^a-zA-Z0-9]/g, '-')}`;
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group rounded-2xl border border-transparent bg-card p-6 shadow-sm transition-[box-shadow,transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-md flex flex-col h-[240px]",
        onClick ? "cursor-pointer active:scale-[0.98]" : "",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="flex size-8 items-center justify-center rounded-full border border-transparent text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="size-4" />
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-medium tracking-tight text-foreground tabular-nums">{value}</span>
        {change && (
          <span className={cn(
            "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium",
            changeType === "positive" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : 
            changeType === "negative" ? "bg-destructive/10 text-destructive dark:bg-destructive/20" :
            "bg-muted text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
              dy={10}
            />
            <RechartsTooltip 
              content={<ChartTooltip colorMap={{ [dataKey]: color }} />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
