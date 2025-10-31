"use client"

import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Loader2, AlertCircle } from "lucide-react"

interface Drink {
  id: string
  name: string
  category: string
  base_price: number
}

interface MenuSectionProps {
  apiUrl: string
  onOrderClick: () => void
}

export function MenuSection({ apiUrl, onOrderClick }: MenuSectionProps) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${apiUrl}/menu`)
        if (!response.ok) {
          throw new Error("Impossible de charger le menu")
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#6F4E37] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-none shadow-md p-8">
          <div className="flex items-center gap-3 text-[#6F4E37]">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Erreur de connexion</h3>
              <p className="text-sm text-[#5A5A5A] mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#6F4E37] mb-4 text-balance">Notre Menu</h2>
        <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed text-pretty">
          Boissons artisanales préparées avec des ingrédients de qualité
        </p>
      </div>

      {drinks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#5A5A5A]">Aucune boisson disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <Card key={drink.id} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-[#2C2C2C] mb-1 text-balance">{drink.name}</h3>
                    <Badge variant="secondary" className="bg-[#FBF8F3] text-[#6F4E37] border border-[#D4A574] text-xs">
                      {drink.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-serif text-2xl font-bold text-[#6F4E37]">{drink.base_price.toFixed(2)}€</span>
                  <Button onClick={onOrderClick} className="bg-[#6F4E37] text-[#FBF8F3] hover:bg-[#5A3E2B]">
                    Commander
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
