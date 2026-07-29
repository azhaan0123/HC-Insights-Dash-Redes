import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./tooltip";

export const ICD10_MAP: Record<string, string> = {
  "R05": "Cough",
  "J44.9": "Chronic obstructive pulmonary disease, unspecified",
  "I23.3": "Rupture of cardiac wall without hemopericardium",
  "I10": "Essential (primary) hypertension",
  "E11.9": "Type 2 diabetes mellitus without complications",
  "E12.00": "Malnutrition-related diabetes mellitus",
  "I10.5": "Hypertensive heart and chronic kidney disease",
  "I24.9": "Acute ischemic heart disease, unspecified",
  "I17.7": "Atherosclerosis of coronary artery bypass graft",
  "C22.4": "Other sarcomas of liver",
  "I24.4": "Dressler's syndrome",
  "E66.9": "Obesity, unspecified",
  "E53.8": "Deficiency of other specified B group vitamins",
  "Z79.890": "Hormone replacement therapy",
  "E55.9": "Vitamin D deficiency, unspecified",
  "F41.9": "Anxiety disorder, unspecified",
  "E78.5": "Hyperlipidemia, unspecified",
};

interface Icd10CodeProps {
  code: string;
  className?: string;
  children?: React.ReactNode;
}

export function Icd10Code({ code, className, children }: Icd10CodeProps) {
  const diagnosis = ICD10_MAP[code];
  const content = children || code;

  if (!diagnosis) {
    return <span className={className}>{content}</span>;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className || ""}`}>{content}</span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-medium text-[13px]">{diagnosis}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
