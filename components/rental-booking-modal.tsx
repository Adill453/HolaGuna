"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/contexts/currency-context"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface RentalPrice {
  days: number | string
  fullGear: number
  insurance: number
}

const rentalPrices: RentalPrice[] = [
  { days: 1, fullGear: 85, insurance: 10 },
  { days: 2, fullGear: 160, insurance: 17 },
  { days: 3, fullGear: 220, insurance: 20 },
  { days: 4, fullGear: 280, insurance: 28 },
  { days: 5, fullGear: 380, insurance: 35 },
  { days: 6, fullGear: 380, insurance: 45 },
  { days: 7, fullGear: 450, insurance: 50 },
  { days: "Extra Day", fullGear: 50, insurance: 5 },
]

export function RentalBookingModal() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { formatPriceWithSymbol } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    days: 1,
    includeInsurance: true,
    startDate: undefined as Date | undefined,
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const selectedRental = rentalPrices.find((r) => 
    typeof r.days === "number" ? r.days === formData.days : false
  ) || rentalPrices[0]

  const totalPrice = selectedRental
    ? selectedRental.fullGear + (formData.includeInsurance ? selectedRental.insurance : 0)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return
    }

    if (!formData.startDate) {
      toast({
        variant: "destructive",
        title: "Date requise",
        description: "Veuillez sélectionner une date de début de location.",
      })
      return
    }

    setLoading(true)
    try {
      const rentalInfo = {
        type: "rental",
        days: formData.days,
        includeInsurance: formData.includeInsurance,
        fullGearPrice: selectedRental.fullGear,
        insurancePrice: formData.includeInsurance ? selectedRental.insurance : 0,
        totalPrice,
        startDate: formData.startDate.toISOString(),
      }

      const response = await fetch("/api/bookings/rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          startDate: formData.startDate.toISOString(),
          days: formData.days,
          includeInsurance: formData.includeInsurance,
          totalPrice,
          notes: `Location kitesurfing - ${formData.days} jour(s), ${formData.includeInsurance ? "avec" : "sans"} assurance. ${formData.message ? `Message: ${formData.message}` : ""}`,
          rentalInfo: JSON.stringify(rentalInfo),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la réservation")
      }

      toast({
        title: "Réservation confirmée !",
        description: "Nous vous contacterons bientôt pour confirmer les détails de votre location.",
      })
      setIsOpen(false)
      // Reset form
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        days: 1,
        includeInsurance: true,
        startDate: undefined,
        message: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Un problème est survenu lors de la réservation. Veuillez réessayer.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Réserver maintenant</Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => {
          // Prevent auto-focus when dialog opens if we're interacting with popover
          const target = e.target as HTMLElement
          if (target.closest('[data-radix-popover-content]')) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Réserver une location</DialogTitle>
          <DialogDescription>
            {user
              ? "Remplissez les détails ci-dessous pour réserver votre équipement de kitesurfing."
              : "Vous pouvez réserver en tant qu'invité ou vous connecter pour une expérience personnalisée."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="days" className="text-right">
                Nombre de jours
              </Label>
              <Select
                value={formData.days.toString()}
                onValueChange={(value) => setFormData({ ...formData, days: parseInt(value, 10) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choisir le nombre de jours" />
                </SelectTrigger>
                <SelectContent>
                  {rentalPrices
                    .filter((r): r is RentalPrice & { days: number } => typeof r.days === "number")
                    .map((rental) => {
                      const days = rental.days
                      return (
                        <SelectItem key={days} value={days.toString()}>
                          {days} jour{days > 1 ? "s" : ""}
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Équipement complet</Label>
              <div className="col-span-3 text-lg font-semibold">
                {formatPriceWithSymbol(selectedRental.fullGear)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="insurance" className="text-right">
                Assurance
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={formData.includeInsurance}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, includeInsurance: checked as boolean })
                  }
                />
                <Label htmlFor="insurance" className="cursor-pointer">
                  Inclure l'assurance (+{formatPriceWithSymbol(selectedRental.insurance)})
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Prix total</Label>
              <div className="col-span-3 text-lg font-semibold text-primary">
                {formatPriceWithSymbol(totalPrice)}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Date de début
              </Label>
              <div className="col-span-3">
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen} modal={false}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0 z-[60] pointer-events-auto" 
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.stopPropagation()}
                    onInteractOutside={(e) => {
                      // Prevent closing when clicking inside the dialog
                      const target = e.target as HTMLElement
                      if (target.closest('[role="dialog"]')) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({ ...formData, startDate: date })
                            setIsDatePickerOpen(false)
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Input
                id="message"
                placeholder="Commentaires ou demandes spéciales"
                className="col-span-3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-between">
            {!user && (
              <Button type="button" variant="outline" onClick={() => window.location.href = "/login"}>
                Se connecter
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "En cours..." : "Confirmer la réservation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

