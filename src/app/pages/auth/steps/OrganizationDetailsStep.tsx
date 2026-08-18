import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { BriefcaseMedical, Network } from "../../../lib/icons";
import { cn } from "../../../components/ui/utils";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export interface OrganizationDetailsStepProps {
  selectedType: "dpc" | "network" | null;
  onTypeChange: (type: "dpc" | "network" | null) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function OrganizationDetailsStep({ selectedType, onTypeChange, onNext, onPrev }: OrganizationDetailsStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    address: "",
    zip: "",
    city: "San Francisco",
    state: "CA"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    if (!isExpanded) return true;
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = `${selectedType === "dpc" ? "Practice" : "Network"} name is required`;
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.zip.trim() || formData.zip.trim().length < 5) newErrors.zip = "Valid ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      if (validate()) {
        onNext();
      }
    }
  };

  const handlePrevClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      onPrev();
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      <div className="mb-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Organization Details
        </h2>
        <div className="mt-4 w-full border-t border-border" />
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <span className="text-[15px] font-semibold text-foreground" id="org-type-group-label">
          Which best describes your organization? <span className="text-primary" aria-hidden="true">*</span>
        </span>
        
        <div 
          role="radiogroup" 
          aria-labelledby="org-type-group-label"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4" 
          style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1)" }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedType === "dpc"}
            onClick={() => onTypeChange("dpc")}
            className={cn(
              "flex items-center justify-center gap-3 rounded-lg border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isExpanded ? "flex-row p-3 text-left" : "flex-col p-6 text-center",
              selectedType === "dpc"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card hover:border-primary/50 hover:bg-muted"
            )}
            style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), background-color 150ms ease-out, border-color 150ms ease-out" }}
          >
            <BriefcaseMedical
              className={cn(
                isExpanded ? "size-6" : "size-10",
                selectedType === "dpc" ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={2}
              aria-hidden="true"
              style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), color 150ms ease-out" }}
            />
            <div 
              className={cn("flex flex-col", isExpanded ? "gap-0 items-start" : "gap-1 items-center")}
              style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1)" }}
            >
              <span 
                className={cn("font-bold text-foreground", isExpanded && "text-sm")}
                style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), font-size 150ms ease-out" }}
              >
                DPC (Direct Primary Care)
              </span>
              {!isExpanded && (
                <span className="text-xs text-muted-foreground animate-in fade-in zoom-in duration-300">
                  For individual or group medical practices
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={selectedType === "network"}
            onClick={() => onTypeChange("network")}
            className={cn(
              "flex items-center justify-center gap-3 rounded-lg border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isExpanded ? "flex-row p-3 text-left" : "flex-col p-6 text-center",
              selectedType === "network"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card hover:border-primary/50 hover:bg-muted"
            )}
            style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), background-color 150ms ease-out, border-color 150ms ease-out" }}
          >
            <Network
              className={cn(
                isExpanded ? "size-6" : "size-10",
                selectedType === "network" ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={2}
              aria-hidden="true"
              style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), color 150ms ease-out" }}
            />
            <div 
              className={cn("flex flex-col", isExpanded ? "gap-0 items-start" : "gap-1 items-center")}
              style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1)" }}
            >
              <span 
                className={cn("font-bold text-foreground", isExpanded && "text-sm")}
                style={{ transition: "all 400ms cubic-bezier(0.35, 1.55, 0.65, 1), font-size 150ms ease-out" }}
              >
                Network
              </span>
              {!isExpanded && (
                <span className="text-xs text-muted-foreground animate-in fade-in zoom-in duration-300">
                  For healthcare organizations with multiple practices
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {isExpanded && selectedType && (
        <div className="flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgName" className="text-sm font-semibold text-foreground">
              {selectedType === "dpc" ? "Practice Name" : "Network Name"} <span className="text-primary" aria-hidden="true">*</span>
            </Label>
            <Input 
              id="orgName"
              placeholder={`Enter ${selectedType === "dpc" ? "practice" : "network"} name`} 
              aria-required="true"
              aria-invalid={!!errors.name}
              className={cn("h-11 bg-muted border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary", errors.name && "border-red-500 focus-visible:ring-red-500")}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && <span className="text-xs text-red-500 font-medium" role="alert">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgWebsite" className="text-sm font-semibold text-foreground">
              Website
            </Label>
            <Input 
              id="orgWebsite"
              placeholder="Enter website URL" 
              className="h-11 bg-muted border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgAddress" className="text-sm font-semibold text-foreground">
              Address <span className="text-primary" aria-hidden="true">*</span>
            </Label>
            <Input 
              id="orgAddress"
              placeholder="Enter address" 
              aria-required="true"
              aria-invalid={!!errors.address}
              className={cn("h-11 bg-muted border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary", errors.address && "border-red-500 focus-visible:ring-red-500")}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            {errors.address && <span className="text-xs text-red-500 font-medium" role="alert">{errors.address}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="orgZip" className="text-sm font-semibold text-foreground">
              ZIP Code <span className="text-primary" aria-hidden="true">*</span>
            </Label>
            <Input 
              id="orgZip"
              placeholder="Enter ZIP code" 
              aria-required="true"
              aria-invalid={!!errors.zip}
              className={cn("h-11 bg-muted border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary", errors.zip && "border-red-500 focus-visible:ring-red-500")}
              value={formData.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
            />
            {errors.zip && <span className="text-xs text-red-500 font-medium" role="alert">{errors.zip}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="orgCity" className="text-sm font-semibold text-foreground">
                City
              </Label>
              <Input 
                id="orgCity"
                placeholder="Auto-filled from ZIP" 
                disabled 
                value={formData.zip.length >= 5 ? formData.city : ""}
                className="h-11 bg-muted/50 border-border text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="orgState" className="text-sm font-semibold text-foreground">
                State
              </Label>
              <Input 
                id="orgState"
                placeholder="Auto-filled from ZIP" 
                disabled 
                value={formData.zip.length >= 5 ? formData.state : ""}
                className="h-11 bg-muted/50 border-border text-muted-foreground cursor-not-allowed placeholder:text-muted-foreground" 
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full gap-4 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevClick}
          className="flex-1 rounded-md border-border bg-card text-foreground hover:bg-muted py-6 text-base font-semibold"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={handleNextClick}
          disabled={!selectedType}
          className="flex-[2] rounded-md py-6 text-base font-semibold"
        >
          {isExpanded && selectedType === "network" ? "Create" : "Next"}
        </Button>
      </div>
    </div>
  );
}
