import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Touchpad,
  Music2,
  Network,
  Phone,
  Send,
  Cog,
  Flag,
  HandFist,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Contact } from "@/lib/types";

export const programIcons: LucideIcon[] = [
  Touchpad,
  Network,
  HandFist,
  Flag,
  Cog,
];
export const profileIcons = {
  education: GraduationCap,
  work: BriefcaseBusiness,
  achievement: Check,
  location: MapPin,
  book: BookOpen,
};
export const uiIcons = { Menu, X, ChevronRight, Send, Check };

export function ContactIcon({ type }: { type: Contact["type"] }) {
  const Icon = {
    EMAIL: Mail,
    PHONE: Phone,
    ADDRESS: MapPin,
    INSTAGRAM: Instagram,
    TIKTOK: Music2,
    FACEBOOK: Facebook,
    LINKEDIN: Linkedin,
    X,
  }[type];
  return <Icon aria-hidden="true" size={22} strokeWidth={1.8} />;
}
