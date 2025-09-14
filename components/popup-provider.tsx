"use client"

import { useState, useEffect } from "react"
import { InterestsPopup } from "./interests-popup"
import { Toaster } from "@/components/ui/toaster"

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const hidePopup = localStorage.getItem('hideInterestsPopup')
    if (!hidePopup) {
      setShowPopup(true)
    }
  }, [])

  return (
    <>
      {children}
      <InterestsPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
      <Toaster />
    </>
  )
}