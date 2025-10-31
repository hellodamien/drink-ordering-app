"use client"

import { useState } from "react"
import { MenuSection } from "./components/menu-section"
import { OrderForm } from "./components/order-form"
import { OrderTracking } from "./components/order-tracking"
import { Coffee, Settings } from "lucide-react"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"

function App() {
  const [activeTab, setActiveTab] = useState<"menu" | "order" | "track">("menu")
  const [apiUrl, setApiUrl] = useState("http://localhost:8080")
  const [showSettings, setShowSettings] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-[#6F4E37] text-[#FBF8F3]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8" />
              <h1 className="font-serif text-3xl font-bold text-balance">Brew & Co</h1>
            </div>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab("menu")}
                className={`text-base font-medium transition-colors ${
                  activeTab === "menu" ? "text-[#D4A574]" : "text-[#FBF8F3] hover:text-[#D4A574]"
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab("order")}
                className={`text-base font-medium transition-colors ${
                  activeTab === "order" ? "text-[#D4A574]" : "text-[#FBF8F3] hover:text-[#D4A574]"
                }`}
              >
                Commander
              </button>
              <button
                onClick={() => setActiveTab("track")}
                className={`text-base font-medium transition-colors ${
                  activeTab === "track" ? "text-[#D4A574]" : "text-[#FBF8F3] hover:text-[#D4A574]"
                }`}
              >
                Suivi
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-[#FBF8F3] hover:text-[#D4A574] transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </nav>
          </div>

          {/* API URL Configuration */}
          {showSettings && (
            <div className="mt-6 bg-[#5A3E2B] rounded-lg p-4">
              <Label htmlFor="api-url" className="text-[#FBF8F3] mb-2 block">
                URL de l'API
              </Label>
              <Input
                id="api-url"
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="bg-[#FBF8F3] border-[#D4A574] text-[#2C2C2C]"
              />
              <p className="text-xs text-[#D4A574] mt-2">Modifiez l'URL de votre API Go ici</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === "menu" && <MenuSection apiUrl={apiUrl} onOrderClick={() => setActiveTab("order")} />}
        {activeTab === "order" && <OrderForm apiUrl={apiUrl} onSuccess={() => setActiveTab("track")} />}
        {activeTab === "track" && <OrderTracking apiUrl={apiUrl} />}
      </div>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-[#FBF8F3] mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#5A5A5A]">© 2025 Brew & Co. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-[#5A5A5A] hover:text-[#D4A574] transition-colors">
                À propos
              </a>
              <a href="#" className="text-sm text-[#5A5A5A] hover:text-[#D4A574] transition-colors">
                Contact
              </a>
              <a href="#" className="text-sm text-[#5A5A5A] hover:text-[#D4A574] transition-colors">
                Emplacements
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
