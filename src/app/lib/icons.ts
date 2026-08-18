/**
 * Centralized icon re-export module powered by Iconsax (TwoTone variant).
 *
 * Re-exports every icon component name used across the application,
 * wrapping iconsax-react components so variant="TwoTone" is automatically
 * applied by default.
 *
 * Iconsax components accept `className`, `size`, `color`, and `variant` props
 * and render crisp, layered SVG icons.
 */

import React, { type ComponentType, type CSSProperties } from "react";
import * as IS from "iconsax-react";

export type IconVariant = "TwoTone" | "Outline" | "Bold" | "Bulk" | "Broken" | "Linear";
export type IconSizePreset = "sm" | "md" | "lg" | "xl";
export type IconColorMode = "theme" | "contextual" | "monochrome";

export interface IconSettingsContextType {
  variant: IconVariant;
  setVariant?: (variant: IconVariant) => void;
  scale: number;
  setScale?: (scale: number) => void;
  size: IconSizePreset;
  setSize?: (size: IconSizePreset) => void;
  colorMode: IconColorMode;
  setColorMode?: (mode: IconColorMode) => void;
  enableDuotoneMix: boolean;
  setEnableDuotoneMix?: (enabled: boolean) => void;
}

export const IconVariantContext = React.createContext<IconSettingsContextType>({
  variant: "TwoTone",
  scale: 1,
  size: "md",
  colorMode: "theme",
  enableDuotoneMix: true,
});

export type IconsaxIconProps = {
  className?: string;
  size?: string | number;
  color?: string;
  variant?: IconVariant;
  scale?: number;
  style?: CSSProperties;
  [key: string]: any;
};

export type HeroIcon = ComponentType<IconsaxIconProps>;
export type LucideIcon = HeroIcon;

function wrap(IconComponent: ComponentType<any>): HeroIcon {
  if (!IconComponent) {
    throw new Error("Iconsax component is undefined!");
  }
  const DynamicIcon = (props: IconsaxIconProps) => {
    const context = React.useContext(IconVariantContext);
    const activeVariant = props.variant || context?.variant || "TwoTone";
    const isDuotone = activeVariant === "TwoTone" || activeVariant === "Bulk";
    const enableDuotone = context?.enableDuotoneMix ?? true;
    const isThemeColor = (context?.colorMode ?? "theme") === "theme";

    // Dynamic classes
    const classes = [
      "hc-icon",
      isDuotone && enableDuotone ? "hc-icon-duotone-palette" : "",
      isThemeColor && !props.color && (!props.className || (!props.className.includes("text-") && !props.className.includes("fill-"))) ? "hc-icon-palette" : "",
      props.className,
    ].filter(Boolean).join(" ");

    // Scale calculation if passed explicitly on prop
    const customStyle = props.scale ? { ...props.style, transform: `scale(${props.scale})` } : props.style;

    return React.createElement(IconComponent, {
      variant: activeVariant,
      size: props.size || "24",
      color: props.color || "currentColor",
      ...props,
      className: classes,
      style: customStyle,
    });
  };
  DynamicIcon.displayName = IconComponent.displayName || IconComponent.name || "IconsaxIcon";
  return DynamicIcon as unknown as HeroIcon;
}

// ── Complete Iconsax TwoTone Mappings ──────────────────────────────────

// A
export const Accessibility     = wrap(IS.People);
export const Activity          = wrap(IS.Activity);
export const AlertCircle       = wrap(IS.InfoCircle);
export const AlertOctagon      = wrap(IS.Warning2);
export const AlertTriangle     = wrap(IS.Warning2);
export const ArrowDown         = wrap(IS.ArrowDown2);
export const ArrowDownRight    = wrap(IS.ArrowDown2);
export const ArrowLeft         = wrap(IS.ArrowLeft2);
export const ArrowRight        = wrap(IS.ArrowRight2);
export const ArrowUp           = wrap(IS.ArrowUp2);
export const ArrowUpDown       = wrap(IS.ArrangeVertical);
export const ArrowUpRight      = wrap(IS.ArrowUp2);
export const ArrowLeftRight    = wrap(IS.ArrangeHorizontal);
export const Award             = wrap(IS.MedalStar);

// B
export const BadgeDollarSign   = wrap(IS.Money);
export const Ban               = wrap(IS.Forbidden);
export const BarChart          = wrap(IS.Chart);
export const BarChart2         = wrap(IS.Chart2);
export const BarChart3         = wrap(IS.Chart);
export const Bell              = wrap(IS.Notification);
export const BookOpen          = wrap(IS.BookSaved);
export const Bot               = wrap(IS.Cpu);
export const BrainCircuit      = wrap(IS.Cpu);
export const BriefcaseMedical  = wrap(IS.Hospital);
export const Building2         = wrap(IS.Building);

// C
export const Cake              = wrap(IS.Gift);
export const Calculator        = wrap(IS.Calculator);
export const Calendar          = wrap(IS.Calendar);
export const CalendarCheck     = wrap(IS.CalendarTick);
export const CalendarClock     = wrap(IS.Calendar1);
export const CalendarDays      = wrap(IS.Calendar);
export const CalendarRange     = wrap(IS.Calendar1);
export const CalendarX         = wrap(IS.CalendarRemove);
export const Check             = wrap(IS.TickCircle);
export const CheckCircle       = wrap(IS.TickCircle);
export const CheckCircle2      = wrap(IS.TickCircle);
export const CheckIcon         = wrap(IS.TickCircle);
export const ChevronDown       = wrap(IS.ArrowDown2);
export const ChevronDownIcon   = wrap(IS.ArrowDown2);
export const ChevronDownIcon_  = wrap(IS.ArrowDown2);
export const ChevronLeft       = wrap(IS.ArrowLeft2);
export const ChevronLeftIcon   = wrap(IS.ArrowLeft2);
export const ChevronRight      = wrap(IS.ArrowRight2);
export const ChevronRightIcon  = wrap(IS.ArrowRight2);
export const ChevronRightIcon_ = wrap(IS.ArrowRight2);
export const ChevronUp         = wrap(IS.ArrowUp2);
export const ChevronUpIcon     = wrap(IS.ArrowUp2);
export const CircleIcon        = wrap(IS.MinusCirlce);
export const ClipboardCheck    = wrap(IS.TaskSquare);
export const ClipboardList     = wrap(IS.Task);
export const ClipboardX        = wrap(IS.TaskSquare);
export const Clock             = wrap(IS.Clock);
export const Code              = wrap(IS.Code);
export const CodeXml           = wrap(IS.DocumentCode);
export const Contrast          = wrap(IS.Moon);
export const Copy              = wrap(IS.Copy);

// D
export const Database          = wrap(IS.Data);
export const DollarSign        = wrap(IS.DollarCircle);
export const Download          = wrap(IS.Import);

// E
export const Edit3             = wrap(IS.Edit2);
export const ExternalLink      = wrap(IS.ExportSquare);
export const Eye               = wrap(IS.Eye);
export const EyeOff            = wrap(IS.EyeSlash);

// F
export const FileCheck         = wrap(IS.DocumentText);
export const FileCode2         = wrap(IS.DocumentCode);
export const FilePlus          = wrap(IS.DocumentUpload);
export const FileSpreadsheet   = wrap(IS.TableDocument);
export const FileText          = wrap(IS.DocumentText);
export const FileX             = wrap(IS.DocumentFilter);
export const Filter            = wrap(IS.Filter);
export const FlaskConical      = wrap(IS.Health);

// G
export const Gauge             = wrap(IS.Speedometer);
export const GitBranch         = wrap(IS.Hierarchy);
export const Globe             = wrap(IS.Global);
export const GripVerticalIcon  = wrap(IS.HambergerMenu);

// H
export const Handshake         = wrap(IS.People);
export const Heart             = wrap(IS.Heart);
export const HeartCrack        = wrap(IS.HeartSlash || IS.Heart);
export const HeartPulse        = wrap(IS.HeartCircle || IS.Heart);
export const HelpCircle        = wrap(IS.MessageQuestion);
export const History           = wrap(IS.Clock);
export const Home              = wrap(IS.Home);

// I
export const Info              = wrap(IS.InfoCircle);

// L
export const Layers            = wrap(IS.Layer);
export const LayoutDashboard   = wrap(IS.Category);
export const LayoutGrid        = wrap(IS.Element3);
export const LayoutTemplate    = wrap(IS.Grid1);
export const Lightbulb         = wrap(IS.LampOn);
export const LineChart         = wrap(IS.Graph);
export const Link              = wrap(IS.Link);
export const Link2             = wrap(IS.Link2);
export const ListTodo          = wrap(IS.TaskSquare);
export const Loader2           = wrap(IS.Refresh);
export const Lock              = wrap(IS.Lock);
export const LogOut            = wrap(IS.Logout);

// M
export const Mail              = wrap(IS.Sms);
export const MapPin            = wrap(IS.Location);
export const Megaphone         = wrap(IS.NotificationBing);
export const MessageCircle     = wrap(IS.MessageCircle);
export const MessageSquare     = wrap(IS.MessageSquare);
export const MessageSquareOff  = wrap(IS.Message);
export const MessageSquarePlus = wrap(IS.MessageAdd);
export const MessagesSquare    = wrap(IS.Messages1);
export const Minus             = wrap(IS.Minus);
export const MinusIcon         = wrap(IS.Minus);
export const Moon              = wrap(IS.Moon);
export const MoonStar          = wrap(IS.Moon);
export const MoreHorizontal    = wrap(IS.More);
export const MoreHorizontalIcon = wrap(IS.More);
export const MousePointer      = wrap(IS.Pointer);

// N
export const Network           = wrap(IS.Global);

// P
export const PackageCheck      = wrap(IS.Box1);
export const Palette           = wrap(IS.Brush);
export const PanelLeftIcon     = wrap(IS.SidebarLeft);
export const PanelRight        = wrap(IS.SidebarRight);
export const Paperclip         = wrap(IS.Paperclip);
export const Pause             = wrap(IS.Pause);
export const Pencil            = wrap(IS.Edit);
export const Percent           = wrap(IS.PercentageSquare);
export const Phone             = wrap(IS.Call);
export const PieChart          = wrap(IS.ChartSquare);
export const PiggyBank         = wrap(IS.MoneyArchive);
export const Pill              = wrap(IS.Health);
export const PillBottle        = wrap(IS.Health);
export const Pipette           = wrap(IS.Brush);
export const Play              = wrap(IS.Play);
export const PlayCircle        = wrap(IS.PlayCircle);
export const Plus              = wrap(IS.Add);
export const Presentation      = wrap(IS.PresentionChart);

// R
export const Receipt           = wrap(IS.Receipt1);
export const ReceiptText       = wrap(IS.ReceiptText);
export const RefreshCw         = wrap(IS.Refresh);
export const Reply             = wrap(IS.Send2);
export const Rocket            = wrap(IS.Flash);
export const RotateCcw         = wrap(IS.RotateLeft);

// S
export const Save              = wrap(IS.Save2);
export const ScanSearch        = wrap(IS.Scan);
export const Search            = wrap(IS.SearchNormal);
export const SearchIcon        = wrap(IS.SearchNormal);
export const Send              = wrap(IS.Send);
export const Settings          = wrap(IS.Setting2);
export const Share2            = wrap(IS.Share);
export const Shield            = wrap(IS.ShieldSecurity);
export const ShieldAlert       = wrap(IS.ShieldCross);
export const ShieldCheck       = wrap(IS.ShieldTick);
export const ShieldX           = wrap(IS.ShieldCross);
export const Sliders           = wrap(IS.SliderHorizontal);
export const SlidersHorizontal = wrap(IS.SliderHorizontal);
export const Smartphone        = wrap(IS.Mobile);
export const Smile             = wrap(IS.EmojiHappy);
export const Sparkles          = wrap(IS.MagicStar);
export const Star              = wrap(IS.Star);
export const Stethoscope       = wrap(IS.Health);
export const Sun               = wrap(IS.Sun);
export const Syringe          = wrap(IS.Health);

// T
export const Table             = wrap(IS.TableDocument);
export const TableIcon         = wrap(IS.TableDocument);
export const Tag               = wrap(IS.Tag);
export const Target            = wrap(IS.Radar);
export const Terminal         = wrap(IS.Command);
export const ThumbsDown        = wrap(IS.Dislike);
export const ThumbsUp          = wrap(IS.Like);
export const Trash2            = wrap(IS.Trash);
export const TriangleAlert     = wrap(IS.Warning2);
export const TrendingDown      = wrap(IS.TrendDown);
export const TrendingUp        = wrap(IS.TrendUp);
export const Trophy            = wrap(IS.MedalStar);
export const Type              = wrap(IS.Text);

// U
export const Undo2             = wrap(IS.RotateLeft);
export const Upload            = wrap(IS.Export);
export const UploadCloud       = wrap(IS.DocumentUpload);
export const User              = wrap(IS.User);
export const UserCheck         = wrap(IS.UserTick || IS.User);
export const UserCog           = wrap(IS.UserEdit || IS.Setting2);
export const UserMinus         = wrap(IS.UserMinus);
export const UserPlus          = wrap(IS.UserAdd);
export const UserX             = wrap(IS.UserRemove || IS.UserMinus);
export const Users             = wrap(IS.Profile2User);

// W
export const Wallet            = wrap(IS.Wallet);
export const Webhook           = wrap(IS.Link2);
export const Workflow          = wrap(IS.Routing);

// X
export const X                 = wrap(IS.CloseCircle);
export const XCircle           = wrap(IS.CloseCircle);
export const XIcon             = wrap(IS.CloseCircle);

// Z
export const Zap               = wrap(IS.Flash);
