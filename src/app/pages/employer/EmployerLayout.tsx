import React from "react";
import { Outlet } from "react-router";

export default function EmployerLayout() {
  return (
    <div className="flex h-full w-full flex-col min-w-0 bg-muted/20">
      <Outlet />
    </div>
  );
}
