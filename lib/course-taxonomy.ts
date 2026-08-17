export type ActivityKey = "kitesurf" | "buggy" | "landboard" | "rental"

export type FormatKey =
  | "all"
  | "group"
  | "semi_private"
  | "private"
  | "combo"
  | "beginner"
  | "connected"
  | "lessons"

export interface CoursePackage {
  id: number
  hours: number
  price: number
  description?: string | null
  isActive: boolean
}

export interface CourseCategory {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  packages: CoursePackage[]
}

export const ACTIVITY_ORDER: ActivityKey[] = ["kitesurf", "buggy", "landboard", "rental"]

export function classifyActivity(name: string): ActivityKey | "other" {
  const n = name.toLowerCase()
  if (n.includes("rental") || n.includes("location")) return "rental"
  if (n.includes("buggy")) return "buggy"
  if (n.includes("land")) return "landboard"
  if (n.includes("kite") || n.includes("surf") || n.includes("wing")) return "kitesurf"
  return "other"
}

export function classifyFormat(name: string): Exclude<FormatKey, "all" | "lessons"> | "other" {
  const n = name.toLowerCase()
  if (n.includes("semi")) return "semi_private"
  if (n.includes("private") || n.includes("privé") || n.includes("prive")) return "private"
  if (n.includes("group") || n.includes("groupe")) return "group"
  if (n.includes("combo")) return "combo"
  if (n.includes("connected") || n.includes("connect")) return "connected"
  if (n.includes("beginner") || n.includes("débutant") || n.includes("debutant")) return "beginner"
  return "other"
}

export function isExtraHour(pkg: CoursePackage) {
  const desc = (pkg.description || "").toLowerCase()
  return desc.includes("extra") || (pkg.hours === 1 && desc.length > 0)
}

export function activePackages(category: CourseCategory) {
  return category.packages.filter((pkg) => pkg.isActive)
}

export function lowestPrice(categories: CourseCategory[]) {
  const prices = categories.flatMap((c) => activePackages(c).map((p) => p.price))
  return prices.length ? Math.min(...prices) : null
}

export function groupCategories(categories: CourseCategory[]) {
  const groups: Record<Exclude<ActivityKey, "rental">, CourseCategory[]> = {
    kitesurf: [],
    buggy: [],
    landboard: [],
  }

  for (const category of categories) {
    const activity = classifyActivity(category.name)
    if (activity === "kitesurf" || activity === "buggy" || activity === "landboard") {
      groups[activity].push(category)
    } else if (activity !== "rental") {
      groups.kitesurf.push(category)
    }
  }

  return groups
}

export const ACTIVITY_IMAGES: Record<ActivityKey, string> = {
  kitesurf: "/images/kitesurfing-4.jpg",
  buggy: "/images/buggy-3.jpg",
  landboard: "/images/landboard-2.jpg",
  rental: "/images/kitesurfing-22.jpg",
}

export const FORMAT_IMAGES: Partial<Record<FormatKey, string>> = {
  group: "/images/kitesurfing-4.jpg",
  semi_private: "/images/kitesurfing-3.jpg",
  private: "/images/kitesurfing-8.jpg",
  combo: "/images/buggy-2.jpg",
  beginner: "/images/buggy-4.jpg",
  connected: "/images/buggy-5.jpg",
}
