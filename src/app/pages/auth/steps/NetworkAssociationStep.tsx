import { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Badge } from "../../../components/ui/badge";
import { X } from "../../../lib/icons";
import { cn } from "../../../components/ui/utils";

const MOCK_NETWORKS = [
  "Aetna Health Network",
  "UnitedHealthcare Partners",
  "Cigna Healthcare",
  "Blue Cross Blue Shield",
  "Kaiser Permanente",
  "Humana Networks",
  "Anthem Blue Cross",
  "Centene Corporation",
  "Molina Healthcare",
  "Ascension Health",
  "Trinity Health",
  "CommonSpirit Health",
  "Providence Health",
  "Mount Sinai Health System",
  "Mayo Clinic Care Network",
  "Cleveland Clinic Network",
  "Johns Hopkins Medicine"
];

function NetworkAutocomplete({ 
  selectedNetworks, 
  onAddNetwork,
  onRemoveNetwork,
  onOpenChange 
}: { 
  selectedNetworks: string[]; 
  onAddNetwork: (net: string) => void;
  onRemoveNetwork: (net: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal state to parent
  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  const filtered = inputValue.length >= 4 
    ? MOCK_NETWORKS.filter(n => 
        n.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedNetworks.includes(n)
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Input
        id="networkAutocomplete"
        role="combobox"
        aria-expanded={isOpen && inputValue.length >= 4}
        aria-controls="network-listbox"
        aria-autocomplete="list"
        placeholder="Type at least 4 characters to search and add networks..."
        className="h-11 bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (e.target.value.length >= 4) setIsOpen(true);
          else setIsOpen(false);
        }}
        onFocus={() => {
          if (inputValue.length >= 4) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && isOpen && filtered.length > 0) {
            e.preventDefault();
            onAddNetwork(filtered[0]);
            setInputValue("");
            setIsOpen(false);
          }
        }}
      />
      
      {isOpen && inputValue.length >= 4 && (
        <div 
          id="network-listbox"
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {filtered.length > 0 ? (
            <div className="py-1">
              {filtered.map((network) => (
                <div
                  key={network}
                  role="option"
                  aria-selected={false}
                  className="px-4 py-2.5 text-sm hover:bg-muted cursor-pointer text-foreground transition-colors"
                  onClick={() => {
                    onAddNetwork(network);
                    setInputValue("");
                    setIsOpen(false);
                  }}
                >
                  {network}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-5 text-sm">
              <span className="text-muted-foreground text-center">
                No onboarded networks found matching "{inputValue}"
              </span>
              <button 
                type="button"
                className="text-[13px] font-semibold text-primary hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/support', '_blank');
                }}
              >
                Get Support?
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected Networks Pills */}
      {selectedNetworks.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {selectedNetworks.map((net) => (
            <Badge
              key={net}
              variant="secondary"
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 shadow-2xs transition-all animate-in zoom-in-95 duration-150"
            >
              <span>{net}</span>
              <button
                type="button"
                onClick={() => onRemoveNetwork(net)}
                className="rounded-full p-0.5 hover:bg-primary/20 text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                title={`Remove ${net}`}
                aria-label={`Remove ${net}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export interface NetworkAssociationStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function NetworkAssociationStep({ onNext, onPrev }: NetworkAssociationStepProps) {
  const [isAffiliated, setIsAffiliated] = useState(true);
  const [isIndependent, setIsIndependent] = useState(false);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const canProceed = !isAffiliated || (isAffiliated && selectedNetworks.length > 0);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out h-full">
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Network Association
        </h2>
        <div className="mt-4 w-full border-t border-border" />
      </div>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-2" role="group" aria-labelledby="network-affil-label">
          <span className="text-[15px] font-semibold text-foreground" id="network-affil-label">
            Is your practice affiliated with a network? <span className="text-primary" aria-hidden="true">*</span>
          </span>
          
          <div className="relative inline-flex h-[42px] items-center rounded-full border border-border bg-muted p-1 w-max">
            {/* Sliding Pill Background */}
            <div 
              className={cn(
                "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isAffiliated ? "left-1 bg-primary shadow-sm" : "left-1/2 bg-card shadow-sm"
              )}
              aria-hidden="true"
            />
            <button
              type="button"
              aria-pressed={isAffiliated}
              onClick={() => setIsAffiliated(true)}
              className={cn(
                "relative z-10 px-8 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                isAffiliated ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yes
            </button>
            <button
              type="button"
              aria-pressed={!isAffiliated}
              onClick={() => setIsAffiliated(false)}
              className={cn(
                "relative z-10 px-8 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                !isAffiliated ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              No
            </button>
          </div>
        </div>

        {/* Independent DPC Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex flex-col gap-0.5 pr-4">
            <Label htmlFor="independent-dpc-switch" className="text-[15px] font-semibold text-foreground cursor-pointer">
              Are you onboarding as an Independent DPC
            </Label>
            <span className="text-xs text-muted-foreground">Select if operating independently without network sponsorship</span>
          </div>
          <Switch 
            id="independent-dpc-switch" 
            checked={isIndependent} 
            onCheckedChange={setIsIndependent} 
          />
        </div>

        <div 
          className="grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ 
            gridTemplateRows: isAffiliated ? "1fr" : "0fr", 
            opacity: isAffiliated ? 1 : 0,
            marginTop: isAffiliated ? "0.25rem" : "0"
          }}
        >
          <div className={cn("px-2 -mx-2 pt-1 -mt-1", !isDropdownOpen && "overflow-hidden")}>
            <div className="flex flex-col gap-1.5 pb-2">
              <Label htmlFor="networkAutocomplete" className="text-[15px] font-semibold text-foreground">
                Network Names <span className="text-primary" aria-hidden="true">*</span>
              </Label>
              <NetworkAutocomplete 
                selectedNetworks={selectedNetworks} 
                onAddNetwork={(net) => setSelectedNetworks(prev => [...prev, net])}
                onRemoveNetwork={(net) => setSelectedNetworks(prev => prev.filter(n => n !== net))}
                onOpenChange={setIsDropdownOpen}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1 rounded-md border-border bg-card text-foreground hover:bg-muted py-6 text-base font-semibold cursor-pointer"
        >
          Previous
        </Button>
        <Button 
          type="button"
          onClick={onNext} 
          disabled={!canProceed}
          className="flex-[2] rounded-md py-6 text-base font-semibold cursor-pointer"
        >
          Create
        </Button>
      </div>
    </div>
  );
}
