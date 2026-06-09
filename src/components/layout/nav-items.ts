import {
  LayoutDashboard,
  Zap,
  Map,
  ParkingSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sprint", href: "/sprint", icon: Zap },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Parking Lot", href: "/parking-lot", icon: ParkingSquare },
];
