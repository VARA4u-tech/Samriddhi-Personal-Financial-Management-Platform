import {
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Clapperboard,
  Coffee,
  Dumbbell,
  Gamepad2,
  HeartPulse,
  Home,
  MoreHorizontal,
  Music2,
  Plane,
  ReceiptText,
  Shirt,
  ShoppingBag,
  Smartphone,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  car: CarFront,
  coffee: Coffee,
  education: BookOpen,
  entertainment: Clapperboard,
  gamepad: Gamepad2,
  health: HeartPulse,
  home: Home,
  music: Music2,
  other: MoreHorizontal,
  plane: Plane,
  receipt: ReceiptText,
  shirt: Shirt,
  shopping: ShoppingBag,
  smartphone: Smartphone,
  transport: CarFront,
  utensils: Utensils,
  utilities: ReceiptText,
  wallet: WalletCards,
};

const legacyIconMap: Record<string, string> = {
  "🍔": "utensils",
  "🏠": "home",
  "🚗": "transport",
  "💊": "health",
  "✈️": "plane",
  "📱": "smartphone",
  "🎬": "entertainment",
  "📚": "education",
  "💼": "briefcase",
  "🛒": "shopping",
  "💰": "wallet",
  "🎮": "gamepad",
  "🏋️": "health",
  "☕": "coffee",
  "🎵": "music",
  "👗": "shirt",
  "💡": "utilities",
};

function getIconKey(icon: string, name?: string) {
  const normalized = icon.toLowerCase().replace(/\s+/g, "-");
  if (iconMap[normalized]) return normalized;
  if (legacyIconMap[icon]) return legacyIconMap[icon];

  const categoryName = name?.toLowerCase() ?? "";
  if (categoryName.includes("food") || categoryName.includes("dining")) return "utensils";
  if (categoryName.includes("transport")) return "transport";
  if (categoryName.includes("shop")) return "shopping";
  if (categoryName.includes("entertain")) return "entertainment";
  if (categoryName.includes("health")) return "health";
  if (categoryName.includes("bill") || categoryName.includes("utilit")) return "utilities";
  return "other";
}

export function CategoryIcon({
  icon,
  name,
  size = 18,
  className,
}: {
  icon: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[getIconKey(icon, name)] ?? MoreHorizontal;
  return (
    <Icon
      size={size}
      strokeWidth={1.8}
      aria-label={`${name ?? "Category"} icon`}
      className={className}
    />
  );
}

export const CATEGORY_ICON_OPTIONS = [
  "utensils",
  "home",
  "transport",
  "health",
  "plane",
  "smartphone",
  "entertainment",
  "education",
  "briefcase",
  "shopping",
  "wallet",
  "gamepad",
  "coffee",
  "music",
  "shirt",
  "receipt",
];
