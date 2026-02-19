import {
  Building2,
  RotateCcw,
  Truck,
  Factory,
  MapPin,
  Bell,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export const SECTION_ICONS: Record<string, LucideIcon> = {
  general: Building2,
  return_initiation: RotateCcw,
  first_mile: Truck,
  processing: Factory,
  last_mile: MapPin,
  notifications_tracking: Bell,
  data_insights: BarChart3,
}
