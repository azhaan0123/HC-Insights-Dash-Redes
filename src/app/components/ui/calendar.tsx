"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "../../lib/icons";
import { DayPicker } from "react-day-picker";
import { format, addYears, subYears } from "date-fns";

import { cn } from "./utils";
import { buttonVariants, Button } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month,
  onMonthChange,
  defaultMonth,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const [view, setView] = React.useState<"days" | "months" | "years">("days");
  
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    month || defaultMonth || new Date()
  );

  React.useEffect(() => {
    if (month) {
      setInternalMonth(month);
    }
  }, [month]);

  React.useEffect(() => {
    if (defaultMonth && !month) {
      setInternalMonth(defaultMonth);
    }
  }, [defaultMonth, month]);

  const handleMonthChange = (newMonth: Date) => {
    setInternalMonth(newMonth);
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
  };

  if (view === "months") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
      <div className={cn("p-3 w-[280px]", className)}>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="size-7 p-0 bg-transparent opacity-50 hover:opacity-100" onClick={() => handleMonthChange(subYears(internalMonth, 1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <div 
            className="text-sm font-medium cursor-pointer hover:text-primary transition-colors px-2 py-0.5 rounded-md hover:bg-muted"
            onClick={() => setView("years")}
          >
            {format(internalMonth, "yyyy")}
          </div>
          <Button variant="outline" className="size-7 p-0 bg-transparent opacity-50 hover:opacity-100" onClick={() => handleMonthChange(addYears(internalMonth, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, i) => (
            <Button
              key={m}
              variant={i === internalMonth.getMonth() ? "default" : "ghost"}
              className="h-9 font-normal"
              onClick={() => {
                const newDate = new Date(internalMonth);
                newDate.setMonth(i);
                handleMonthChange(newDate);
                setView("days");
              }}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (view === "years") {
    const currentYear = internalMonth.getFullYear();
    const startDecade = Math.floor(currentYear / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => startDecade - 1 + i);
    
    return (
      <div className={cn("p-3 w-[280px]", className)}>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="size-7 p-0 bg-transparent opacity-50 hover:opacity-100" onClick={() => handleMonthChange(subYears(internalMonth, 10))}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-sm font-medium">
            {startDecade} - {startDecade + 9}
          </div>
          <Button variant="outline" className="size-7 p-0 bg-transparent opacity-50 hover:opacity-100" onClick={() => handleMonthChange(addYears(internalMonth, 10))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => (
            <Button
              key={y}
              variant={y === currentYear ? "default" : "ghost"}
              className={cn("h-9 font-normal", (y < startDecade || y > startDecade + 9) && "opacity-50")}
              onClick={() => {
                const newDate = new Date(internalMonth);
                newDate.setFullYear(y);
                handleMonthChange(newDate);
                setView("months");
              }}
            >
              {y}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={internalMonth}
      onMonthChange={handleMonthChange}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...iconProps }) => (
          <ChevronLeft className={cn("size-4", className)} {...iconProps} />
        ),
        IconRight: ({ className, ...iconProps }) => (
          <ChevronRight className={cn("size-4", className)} {...iconProps} />
        ),
        CaptionLabel: ({ displayMonth }) => {
          return (
            <div
              className="text-sm font-medium cursor-pointer hover:text-primary transition-colors px-2 py-0.5 rounded-md hover:bg-muted"
              onClick={() => setView("months")}
            >
              {format(displayMonth, "MMMM yyyy")}
            </div>
          );
        },
        ...props.components,
      }}
      {...props}
    />
  );
}

export { Calendar };
