import { Outlet } from "react-router";

/**
 * Shared layout wrapper for module sections (HCC, ACO, MIPS, Employer, Outcomes).
 * Provides consistent container styling with an Outlet for child routes.
 */
export default function ModuleLayout() {
  return (
    <div className="flex h-full w-full flex-col min-w-0 bg-muted/20">
      <Outlet />
    </div>
  );
}
