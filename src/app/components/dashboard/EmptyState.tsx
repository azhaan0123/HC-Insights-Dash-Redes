export function EmptyState({
  message = "No data available",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center py-16 text-sm text-muted-foreground/70 ${className}`}>
      {message}
    </div>
  );
}

/** Wrapper card with a title bar matching the dashboard panel style. */
export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-transparent bg-card p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {typeof title === "string" ? (
            <h3 className="text-foreground" style={{ fontSize: "0.95rem" }}>{title}</h3>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
