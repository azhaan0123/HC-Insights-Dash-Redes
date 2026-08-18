import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, RotateCcw, Home } from "../../lib/icons";
import { Button } from "../ui/button";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected application error occurred.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data?.message || "";
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-xs">
        <AlertTriangle className="size-7" />
      </div>
      <h2 className="text-xl font-bold text-foreground tracking-tight">Something went wrong</h2>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
        {errorMessage}
      </p>
      {errorDetails && (
        <pre className="mt-4 max-h-36 max-w-lg overflow-auto rounded-lg bg-muted p-3 text-left font-mono text-xs text-muted-foreground/80 border">
          {errorDetails}
        </pre>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Reload Page
        </Button>
        <Button
          asChild
          size="sm"
          className="gap-2"
        >
          <Link to="/engagement">
            <Home className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
