"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "fr"

const dictionary = {
  en: {
    navHome: "Home",
    navCourses: "Courses",
    navTarifs: "Tarifs",
    navRental: "Rental",
    navActivities: "Activities",
    navGallery: "Gallery",
    navContact: "Contact",
    navLogin: "Login",
    navSignup: "Sign Up",
    navLogout: "Logout",
    navAdmin: "Admin",
    bookNow: "Book Now",
    bookSession: "Book a Session",
    exploreCourses: "Explore Courses",
    viewGallery: "View Gallery",
    getInTouch: "Get In Touch",
    contactUs: "Contact Us",
    viewAllCourses: "View All Courses",
    viewRental: "View Rental Options",
    hi: "Hi",
    menu: "Menu",
    close: "Close",
    language: "Language",
    currency: "Currency",
    locationDakhla: "Dakhla, Morocco",
    certifiedInstructors: "Certified instructors",
    equipmentIncluded: "Equipment included",
    lagoonSpots: "Lagoon, Speed spot, White dune",
    footerTagline:
      "Morocco's premier kite sports destination offering world-class lessons and unforgettable experiences.",
    quickLinks: "Quick Links",
    sports: "Sports",
    contactInfo: "Contact Info",
    rights: "Ola Y Lagona. All rights reserved.",
    kitesurf: "Kitesurf",
    buggy: "Buggy",
    landboard: "Landboard",
    rental: "Rental",
    paddle: "Paddle",
    group: "Group",
    semiPrivate: "Semi-private",
    private: "Private",
    allFormats: "All formats",
    duration: "Duration",
    price: "Price",
    included: "What's included",
    extraHour: "Extra hour",
    days: "Days",
    fullGear: "Full gear",
    insurance: "Insurance",
    extraDay: "Extra day",
    selectOffer: "Select an offer",
    compare: "Compare",
    from: "From",
    perPerson: "per person",
    tryAgain: "Try again",
    loading: "Loading…",
  },
  fr: {
    navHome: "Accueil",
    navCourses: "Cours",
    navTarifs: "Tarifs",
    navRental: "Location",
    navActivities: "Activités",
    navGallery: "Galerie",
    navContact: "Contact",
    navLogin: "Connexion",
    navSignup: "Inscription",
    navLogout: "Déconnexion",
    navAdmin: "Admin",
    bookNow: "Réserver",
    bookSession: "Réserver une session",
    exploreCourses: "Voir les cours",
    viewGallery: "Voir la galerie",
    getInTouch: "Nous contacter",
    contactUs: "Contactez-nous",
    viewAllCourses: "Tous les cours",
    viewRental: "Voir la location",
    hi: "Salut",
    menu: "Menu",
    close: "Fermer",
    language: "Langue",
    currency: "Devise",
    locationDakhla: "Dakhla, Maroc",
    certifiedInstructors: "Instructeurs certifiés",
    equipmentIncluded: "Matériel inclus",
    lagoonSpots: "Lagune, Speed spot, White dune",
    footerTagline:
      "La destination kite au Maroc : des cours de haut niveau et des expériences inoubliables à Dakhla.",
    quickLinks: "Liens rapides",
    sports: "Sports",
    contactInfo: "Contact",
    rights: "Ola Y Lagona. Tous droits réservés.",
    kitesurf: "Kitesurf",
    buggy: "Buggy",
    landboard: "Landboard",
    rental: "Location",
    paddle: "Paddle",
    group: "Groupe",
    semiPrivate: "Semi-privé",
    private: "Privé",
    allFormats: "Tous les formats",
    duration: "Durée",
    price: "Prix",
    included: "Inclus",
    extraHour: "Heure supplémentaire",
    days: "Jours",
    fullGear: "Matériel complet",
    insurance: "Assurance",
    extraDay: "Jour supplémentaire",
    selectOffer: "Choisir une offre",
    compare: "Comparer",
    from: "À partir de",
    perPerson: "par personne",
    tryAgain: "Réessayer",
    loading: "Chargement…",
  },
} as const

export type TranslationKey = keyof typeof dictionary.en

type LanguageContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = window.localStorage.getItem("oyl-lang")
    if (stored === "en" || stored === "fr") {
      setLangState(stored)
    }
  }, [])

  const setLang = (next: Lang) => {
    setLangState(next)
    window.localStorage.setItem("oyl-lang", next)
    document.documentElement.lang = next
  }

  const t = (key: TranslationKey) => dictionary[lang][key] ?? dictionary.en[key]

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
