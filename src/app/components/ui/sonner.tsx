"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:!text-muted-foreground group-[.toast]:!opacity-100 font-medium text-xs",
          title: "group-[.toast]:!text-foreground font-semibold text-sm",
          actionButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground font-semibold px-3 py-1.5 rounded-md",
          cancelButton:
            "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground font-semibold px-3 py-1.5 rounded-md",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--normal-description": "var(--muted-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
