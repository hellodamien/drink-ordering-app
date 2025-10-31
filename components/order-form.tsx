"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface Drink {
  id: string
  name: string
  category: string
  base_price: number
}

interface OrderFormProps {
  apiUrl: string
  onSuccess: () => void
}

export function OrderForm({ apiUrl, onSuccess }: OrderFormProps) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    drink_id: "",
    size: "medium",
    customer_name: "",
  })

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${apiUrl}/menu`)
        if (!response.ok) throw new Error("Impossible de charger le menu")
        const data = await response.json()
        setDrinks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [apiUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande")
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#6F4E37] animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-none shadow-md p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-[#6F4E37] mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] mb-2">Commande créée !</h3>
          <p className="text-[#5A5A5A]">Redirection vers le suivi...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#6F4E37] mb-4 text-balance">
          Créer une Commande
        </h2>
        <p className="text-lg text-[#5A5A5A] leading-relaxed text-pretty">Personnalisez votre boisson parfaite</p>
      </div>

      <Card className="bg-white border-none shadow-md">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Drink Selection */}
            <div className="space-y-2">
              <Label htmlFor="drink" className="text-base font-medium text-[#2C2C2C]">
                Choisissez votre boisson
              </Label>
              <Select
                value={formData.drink_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, drink_id: value }))}
              >
                <SelectTrigger id="drink" className="border-[#D4A574] focus:ring-[#6F4E37]">
                  <SelectValue placeholder="Sélectionnez une boisson" />
                </SelectTrigger>
                <SelectContent>
                  {drinks.map((drink) => (
                    <SelectItem key={drink.id} value={drink.id}>
                      {drink.name} - {drink.base_price.toFixed(2)}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-[#2C2C2C]">Taille</Label>
              <RadioGroup
                value={formData.size}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, size: value }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" className="border-[#D4A574] text-[#6F4E37]" />
                  <Label htmlFor="small" className="font-normal cursor-pointer text-[#2C2C2C]">
                    Petit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" className="border-[#D4A574] text-[#6F4E37]" />
                  <Label htmlFor="medium" className="font-normal cursor-pointer text-[#2C2C2C]">
                    Moyen
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" className="border-[#D4A574] text-[#6F4E37]" />
                  <Label htmlFor="large" className="font-normal cursor-pointer text-[#2C2C2C]">
                    Grand
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium text-[#2C2C2C]">
                Nom pour la commande
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Entrez votre nom"
                value={formData.customer_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                className="border-[#D4A574] focus:ring-[#6F4E37]"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#6F4E37] text-[#FBF8F3] hover:bg-[#5A3E2B] h-12 text-base font-medium"
              disabled={!formData.drink_id || !formData.customer_name || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Passer la commande"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
