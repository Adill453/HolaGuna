"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ActivityTabs } from "@/components/activity-tabs"
import { CourseShowcase } from "@/components/course-showcase"
import { CurrencySwitcher } from "@/components/currency-switcher"
import { RentalBookingModal } from "@/components/rental-booking-modal"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage, type TranslationKey } from "@/contexts/language-context"
import {
  ACTIVITY_IMAGES,
  FORMAT_IMAGES,
  activePackages,
  classifyFormat,
  groupCategories,
  isExtraHour,
  type ActivityKey,
  type CourseCategory,
  type CoursePackage,
  type FormatKey,
} from "@/lib/course-taxonomy"
import type { PricingColumn } from "@/components/pricing-table"

type RentalPrice = {
  id: number
  days: number
  isExtraDay: boolean
  fullGearPrice: number
  insurancePrice: number
}

const FALLBACK_RENTAL: RentalPrice[] = [
  { id: 1, days: 1, isExtraDay: false, fullGearPrice: 85, insurancePrice: 10 },
  { id: 2, days: 2, isExtraDay: false, fullGearPrice: 160, insurancePrice: 17 },
  { id: 3, days: 3, isExtraDay: false, fullGearPrice: 220, insurancePrice: 20 },
  { id: 4, days: 4, isExtraDay: false, fullGearPrice: 280, insurancePrice: 28 },
  { id: 5, days: 5, isExtraDay: false, fullGearPrice: 380, insurancePrice: 35 },
  { id: 6, days: 6, isExtraDay: false, fullGearPrice: 380, insurancePrice: 45 },
  { id: 7, days: 7, isExtraDay: false, fullGearPrice: 450, insurancePrice: 50 },
  { id: 8, days: 1, isExtraDay: true, fullGearPrice: 50, insurancePrice: 5 },
]

const KITESURF_INCLUDES = [
  "IKO certified instructor",
  "Full kite equipment",
  "Walkie-talkie coaching",
  "Lagoon, Speed spot or White dune",
]

const BUGGY_INCLUDES = [
  "Power kite briefing",
  "Buggy and safety gear",
  "Guided dune session",
  "Age 12+",
]

const LAND_INCLUDES = [
  "Landboard and kite",
  "Instructor supervision",
  "Safety equipment",
]

const RENTAL_INCLUDES = [
  "Full kite gear",
  "Independent riders (Level 3+)",
  "Optional insurance",
  "Advice on spots and conditions",
]

const ACTIVITY_LABEL: Record<ActivityKey, TranslationKey> = {
  kitesurf: "kitesurf",
  buggy: "buggy",
  landboard: "landboard",
  rental: "rental",
}

function formatLabel(format: FormatKey, t: (key: TranslationKey) => string, fallback: string) {
  const map: Partial<Record<FormatKey, TranslationKey>> = {
    all: "allFormats",
    group: "group",
    semi_private: "semiPrivate",
    private: "private",
  }
  const key = map[format]
  return key ? t(key) : fallback
}

function packagesByHours(category?: CourseCategory) {
  const map = new Map<number, CoursePackage>()
  if (!category) return map
  for (const pkg of activePackages(category)) {
    if (!isExtraHour(pkg)) map.set(pkg.hours, pkg)
  }
  return map
}

function extraPackage(category?: CourseCategory) {
  return category ? activePackages(category).find(isExtraHour) : undefined
}

export function PricingExperience({
  categories,
  stickyTabs = true,
}: {
  categories: CourseCategory[]
  stickyTabs?: boolean
}) {
  const { t } = useLanguage()
  const { formatPriceWithSymbol } = useCurrency()
  const reduce = useReducedMotion()
  const grouped = useMemo(() => groupCategories(categories), [categories])
  const [rentalPrices, setRentalPrices] = useState<RentalPrice[]>(FALLBACK_RENTAL)

  const availableActivities = useMemo(() => {
    const keys: ActivityKey[] = []
    if (grouped.kitesurf.length) keys.push("kitesurf")
    if (grouped.buggy.length) keys.push("buggy")
    if (grouped.landboard.length) keys.push("landboard")
    keys.push("rental")
    return keys
  }, [grouped])

  const [activity, setActivity] = useState<ActivityKey>(availableActivities[0] || "kitesurf")
  const [format, setFormat] = useState<FormatKey>("all")
  const [selectedHours, setSelectedHours] = useState<number>()
  const [selectedColumn, setSelectedColumn] = useState<string>()
  const [selectedPackageId, setSelectedPackageId] = useState<number>()
  const [rentalDays, setRentalDays] = useState(1)
  const [rentalInsurance, setRentalInsurance] = useState(true)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/rental/pricing")
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.pricing) && data.pricing.length > 0) {
          setRentalPrices(
            data.pricing.map((p: RentalPrice) => ({
              id: p.id,
              days: p.days,
              isExtraDay: p.isExtraDay,
              fullGearPrice: p.fullGearPrice,
              insurancePrice: p.insurancePrice,
            })),
          )
        }
      } catch {
        // keep fallback
      }
    }
    fetchPricing()
  }, [])

  useEffect(() => {
    if (!availableActivities.includes(activity)) {
      setActivity(availableActivities[0])
    }
  }, [availableActivities, activity])

  const currentCategories = activity === "rental" ? [] : grouped[activity]
  const formatTabs = useMemo(() => {
    if (activity === "kitesurf") {
      const tabs: { key: FormatKey; label: string }[] = [{ key: "all", label: t("allFormats") }]
      for (const category of currentCategories) {
        const key = classifyFormat(category.name)
        if (key !== "other") {
          tabs.push({ key, label: formatLabel(key, t, category.name) })
        } else {
          tabs.push({ key: "lessons", label: category.name })
        }
      }
      return tabs.filter((tab, index, list) => list.findIndex((item) => item.key === tab.key) === index)
    }
    return currentCategories.map((category) => {
      const key = classifyFormat(category.name)
      return { key: key === "other" ? ("lessons" as FormatKey) : key, label: category.name, category }
    })
  }, [activity, currentCategories, t])

  useEffect(() => {
    if (activity === "rental") return
    if (activity === "kitesurf") {
      setFormat("all")
    } else if (formatTabs[0]) {
      setFormat(formatTabs[0].key)
    }
    setSelectedHours(undefined)
    setSelectedColumn(undefined)
    setSelectedPackageId(undefined)
  }, [activity])

  const kiteGroup = currentCategories.find((c) => classifyFormat(c.name) === "group")
  const kiteSemi = currentCategories.find((c) => classifyFormat(c.name) === "semi_private")
  const kitePrivate = currentCategories.find((c) => classifyFormat(c.name) === "private")

  const selectedCategory = useMemo(() => {
    if (activity === "kitesurf") {
      const columnFormat = selectedColumn as FormatKey | undefined
      const formatToUse = format === "all" ? columnFormat || "all" : format
      if (formatToUse === "group") return kiteGroup
      if (formatToUse === "semi_private") return kiteSemi
      if (formatToUse === "private") return kitePrivate
      return kitePrivate || kiteSemi || kiteGroup || currentCategories[0]
    }
    const match = currentCategories.find((category) => {
      const key = classifyFormat(category.name)
      return key === format || category.name === formatTabs.find((tab) => tab.key === format)?.label
    })
    return match || currentCategories[0]
  }, [activity, format, selectedColumn, currentCategories, kiteGroup, kiteSemi, kitePrivate, formatTabs])

  const showcase = useMemo(() => {
    if (activity === "rental") {
      const standard = rentalPrices.filter((p) => !p.isExtraDay)
      const extra = rentalPrices.find((p) => p.isExtraDay)
      const columns: PricingColumn[] = [
        {
          key: "gear",
          label: t("fullGear"),
          getPrice: (days) => standard.find((p) => p.days === days)?.fullGearPrice ?? null,
        },
        {
          key: "insurance",
          label: t("insurance"),
          getPrice: (days) => standard.find((p) => p.days === days)?.insurancePrice ?? null,
        },
      ]
      return {
        title: "Kitesurfing equipment rental",
        description:
          "Rent high-quality kitesurfing gear with flexible pricing for 1 to 7 days. Independent riders only — Level 3 or equivalent.",
        image: ACTIVITY_IMAGES.rental,
        label: t("rental"),
        includes: RENTAL_INCLUDES,
        hours: standard.map((p) => p.days),
        columns,
        footnoteRows: extra
          ? [{ label: t("extraDay"), values: [extra.fullGearPrice, extra.insurancePrice] }]
          : [],
        bookingCategory: null as CourseCategory | null,
        bookingPackages: [] as CoursePackage[],
      }
    }

    if (activity === "kitesurf" && format === "all") {
      const groupMap = packagesByHours(kiteGroup)
      const semiMap = packagesByHours(kiteSemi)
      const privateMap = packagesByHours(kitePrivate)
      const hours = Array.from(
        new Set([...groupMap.keys(), ...semiMap.keys(), ...privateMap.keys()]),
      ).sort((a, b) => a - b)

      const columns: PricingColumn[] = [
        {
          key: "group",
          label: t("group"),
          getPrice: (h) => groupMap.get(h)?.price ?? null,
          getPackage: (h) => groupMap.get(h) ?? null,
        },
        {
          key: "semi_private",
          label: t("semiPrivate"),
          getPrice: (h) => semiMap.get(h)?.price ?? null,
          getPackage: (h) => semiMap.get(h) ?? null,
        },
        {
          key: "private",
          label: t("private"),
          getPrice: (h) => privateMap.get(h)?.price ?? null,
          getPackage: (h) => privateMap.get(h) ?? null,
        },
      ]

      const extras = [extraPackage(kiteGroup), extraPackage(kiteSemi), extraPackage(kitePrivate)]
      const footnoteRows = extras.some(Boolean)
        ? [{ label: t("extraHour"), values: extras.map((pkg) => pkg?.price ?? null) }]
        : []

      return {
        title: "Kitesurf lessons in Dakhla",
        description:
          kitePrivate?.description ||
          kiteGroup?.description ||
          "Learn to ride the Dakhla lagoon with certified instructors. Choose group, semi-private or private coaching.",
        image: ACTIVITY_IMAGES.kitesurf,
        label: t("kitesurf"),
        includes: KITESURF_INCLUDES,
        hours,
        columns,
        footnoteRows,
        bookingCategory: selectedCategory || null,
        bookingPackages: selectedCategory ? activePackages(selectedCategory) : [],
      }
    }

    const category = selectedCategory
    const pkgs = category ? activePackages(category).filter((pkg) => !isExtraHour(pkg)) : []
    const extra = category ? extraPackage(category) : undefined
    const hours = pkgs.map((pkg) => pkg.hours).sort((a, b) => a - b)
    const map = packagesByHours(category)
    const formatKey = category ? classifyFormat(category.name) : "other"

    const columns: PricingColumn[] = [
      {
        key: "price",
        label: t("price"),
        getPrice: (h) => map.get(h)?.price ?? null,
        getPackage: (h) => map.get(h) ?? null,
      },
    ]

    return {
      title: category?.name || t(ACTIVITY_LABEL[activity]),
      description: category?.description,
      image:
        category?.imageUrl ||
        FORMAT_IMAGES[formatKey === "other" ? "beginner" : formatKey] ||
        ACTIVITY_IMAGES[activity],
      label: formatLabel(format, t, t(ACTIVITY_LABEL[activity])),
      includes: activity === "buggy" ? BUGGY_INCLUDES : activity === "landboard" ? LAND_INCLUDES : KITESURF_INCLUDES,
      hours,
      columns,
      footnoteRows: extra ? [{ label: extra.description || t("extraHour"), values: [extra.price] }] : [],
      bookingCategory: category || null,
      bookingPackages: category ? activePackages(category) : [],
    }
  }, [activity, format, selectedCategory, kiteGroup, kiteSemi, kitePrivate, rentalPrices, t])

  const handleSelect = (hours: number, columnKey: string, pkg?: CoursePackage | null) => {
    setSelectedHours(hours)
    setSelectedColumn(columnKey)
    if (activity === "rental") {
      setRentalDays(hours)
      setRentalInsurance(columnKey === "insurance" ? true : rentalInsurance)
      return
    }
    if (pkg) {
      setSelectedPackageId(pkg.id)
    }
  }

  const rentalCta = (
    <RentalBookingModal initialDays={rentalDays} includeInsurance={rentalInsurance} triggerLabel={t("bookNow")} />
  )

  return (
    <div className="space-y-5">
      <div
        className={
          stickyTabs
            ? "sticky top-[4.25rem] z-30 -mx-4 space-y-3 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-4"
            : "space-y-3"
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ActivityTabs
            items={availableActivities.map((key) => ({ key, label: t(ACTIVITY_LABEL[key]) }))}
            value={activity}
            onChange={(key) => setActivity(key as ActivityKey)}
          />
          <CurrencySwitcher className="self-start sm:self-auto" />
        </div>
        {activity !== "rental" && formatTabs.length > 1 ? (
          <ActivityTabs
            items={formatTabs.map((tab) => ({ key: String(tab.key), label: tab.label }))}
            value={String(format)}
            onChange={(key) => {
              setFormat(key as FormatKey)
              setSelectedHours(undefined)
              setSelectedColumn(undefined)
              setSelectedPackageId(undefined)
            }}
          />
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activity}-${format}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <CourseShowcase
            title={showcase.title}
            description={showcase.description}
            image={showcase.image}
            label={showcase.label}
            includes={showcase.includes}
            hours={showcase.hours}
            columns={showcase.columns}
            footnoteRows={showcase.footnoteRows}
            selectedHours={selectedHours}
            selectedColumn={selectedColumn}
            onSelect={handleSelect}
            bookingCategory={showcase.bookingCategory}
            bookingPackages={showcase.bookingPackages}
            selectedPackageId={selectedPackageId}
            customCta={activity === "rental" ? rentalCta : undefined}
            durationLabel={
              activity === "rental"
                ? (days) => `${days} ${t("days").toLowerCase()}`
                : undefined
            }
          />
        </motion.div>
      </AnimatePresence>

      {activity === "rental" ? (
        <p className="text-sm text-muted-foreground">
          Selected: {rentalDays} {t("days").toLowerCase()} · {t("fullGear")}{" "}
          {formatPriceWithSymbol(
            rentalPrices.find((p) => !p.isExtraDay && p.days === rentalDays)?.fullGearPrice ?? 0,
          )}
          {rentalInsurance
            ? ` + ${t("insurance")} ${formatPriceWithSymbol(
                rentalPrices.find((p) => !p.isExtraDay && p.days === rentalDays)?.insurancePrice ?? 0,
              )}`
            : ""}
        </p>
      ) : null}
    </div>
  )
}
