"use client"

import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { CheckCircle2, Clock, Coffee, Package, Loader2, AlertCircle, RefreshCw } from "lucide-react"

interface Order {
  id: string
  drink_id: string
  drink_name: string
  size: string
  extras: string[]
  customer_name: string
  status: string
  total_price: number
  ordered_at: string
}

interface OrderTrackingProps {
  apiUrl: string
}

const statusConfig = {
  pending: { label: "Commande reçue", icon: Clock, color: "text-[#D4A574]" },
  preparing: { label: "En préparation", icon: Coffee, color: "text-[#6F4E37]" },
  ready: { label: "Prête", icon: Package, color: "text-[#6F4E37]" },
  "picked-up": { label: "Récupérée", icon: CheckCircle2, color: "text-[#6F4E37]" },
  cancelled: { label: "Annulée", icon: AlertCircle, color: "text-red-600" },
}

export function OrderTracking({ apiUrl }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiUrl}/orders`)
      if (!response.ok) {
        throw new Error("Impossible de charger les commandes")
      }
      const data = await response.json()
      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // Refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [apiUrl])

  if (loading && orders.length === 0) {
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
          <div className="flex items-center gap-3 text-[#6F4E37] mb-4">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Erreur de connexion</h3>
              <p className="text-sm text-[#5A5A5A] mt-1">{error}</p>
            </div>
          </div>
          <Button onClick={fetchOrders} className="bg-[#6F4E37] text-[#FBF8F3] hover:bg-[#5A3E2B]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </Card>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg p-12 shadow-sm">
          <Clock className="w-16 h-16 text-[#D4A574] mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-[#2C2C2C] mb-3 text-balance">Aucune commande active</h2>
          <p className="text-[#5A5A5A] leading-relaxed text-pretty">Passez une commande pour suivre son statut ici</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#6F4E37] mb-4 text-balance">
          Suivi des Commandes
        </h2>
        <p className="text-lg text-[#5A5A5A] leading-relaxed text-pretty">Vos boissons seront bientôt prêtes</p>
        <Button
          onClick={fetchOrders}
          variant="outline"
          className="mt-4 border-[#D4A574] text-[#6F4E37] hover:bg-[#FBF8F3] bg-transparent"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Actualiser
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
          const StatusIcon = statusInfo.icon

          return (
            <Card key={order.id} className="bg-white border-none shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-2xl font-semibold text-[#2C2C2C] text-balance">
                        {order.drink_name}
                      </h3>
                      <Badge className="bg-[#D4A574] text-white border-none">{order.size}</Badge>
                    </div>
                    <p className="text-[#5A5A5A] text-sm">
                      Commande #{order.id} • {order.customer_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-bold text-[#6F4E37]">{order.total_price.toFixed(2)}€</p>
                  </div>
                </div>

                {order.extras && order.extras.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#2C2C2C] mb-2">Extras:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.extras.map((extra, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[#FBF8F3] text-[#6F4E37] border border-[#D4A574]"
                        >
                          {extra}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#FBF8F3]">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                    <div>
                      <p className="font-medium text-[#2C2C2C]">{statusInfo.label}</p>
                      <p className="text-xs text-[#5A5A5A]">{new Date(order.ordered_at).toLocaleString("fr-FR")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
