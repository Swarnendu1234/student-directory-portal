"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Heart, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const interestCategories = {
  "🎯 Academic & Professional": [
    "Coding / Programming",
    "Web Development", 
    "App Development",
    "Data Science / AI / ML",
    "Cybersecurity",
    "Entrepreneurship / Startups",
    "Research & Innovation",
    "Public Speaking / Debating",
    "Writing / Blogging",
    "Constitution",
    "Law",
    "Political Science",
    "Public Administration",
    "Civil Service"
  ],
  "🎨 Creative & Media": [
    "Video Editing",
    "Graphic Design",
    "Photography",
    "Content Creation",
    "Music (Singing / Instruments / Production)",
    "Art & Sketching",
    "Dance",
    "Drama / Theatre",
    "Film Making"
  ],
  "🎮 Tech & Gaming": [
    "Gaming",
    "Game Development",
    "AR / VR",
    "Robotics",
    "Drone Technology"
  ],
  "🏃 Sports & Fitness": [
    "Cricket",
    "Football",
    "Basketball",
    "Badminton",
    "Athletics",
    "Chess",
    "Table Tennis",
    "Volleyball",
    "Yoga / Meditation",
    "Gym & Fitness"
  ],
  "🌍 Social & Lifestyle": [
    "Volunteering / Social Work",
    "Event Management",
    "Traveling",
    "Cooking",
    "Fashion / Styling",
    "Reading / Book Clubs"
  ]
}

interface InterestsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function InterestsPopup({ isOpen, onClose }: InterestsPopupProps) {
  const [email, setEmail] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [validatingEmail, setValidatingEmail] = useState(false)
  const [hasUpdated, setHasUpdated] = useState(false)
  const { toast } = useToast()



  const validateEmail = async (emailValue: string) => {
    if (!emailValue) {
      setEmailError("")
      setHasUpdated(false)
      return
    }

    setValidatingEmail(true)
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setEmailError("")
        setInterests(data.interests || [])
        setHasUpdated(data.hasUpdated || false)
      } else {
        setEmailError(data.error || "Email not found, please register first")
        setInterests([])
        setHasUpdated(false)
      }
    } catch (error) {
      setEmailError("Failed to verify email")
      setHasUpdated(false)
    } finally {
      setValidatingEmail(false)
    }
  }

  const updateInterests = async () => {
    if (!email) {
      setEmailError("Please enter your email")
      return
    }

    if (emailError) {
      toast({ title: "Error", description: "Please fix email error first", variant: "destructive" })
      return
    }

    if (hasUpdated) {
      toast({ title: "Error", description: "This email has already updated interests", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/update-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, interests })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({ title: "Success", description: "Interests updated successfully!" })
        setHasUpdated(true)
        handleClose()
      } else {
        toast({ title: "Error", description: data.error || "Failed to update interests", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update interests", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideInterestsPopup', 'true')
    }
    setEmail("")
    setInterests([])
    setEmailError("")
    setHasUpdated(false)
    setDontShowAgain(false)
    onClose()
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value) {
      const timeoutId = setTimeout(() => validateEmail(value), 500)
      return () => clearTimeout(timeoutId)
    } else {
      setEmailError("")
      setInterests([])
      setHasUpdated(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold">Update Your Interests</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your registered email"
                className={`mt-1 ${emailError ? 'border-red-500' : ''}`}
              />
              {validatingEmail && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Select Your Interests:</h3>
            {Object.entries(interestCategories).map(([category, categoryInterests]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-slate-700 text-sm">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {categoryInterests.map((interest) => {
                    const isSelected = interests.includes(interest)
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          setInterests(prev => 
                            isSelected 
                              ? prev.filter(i => i !== interest)
                              : [...prev, interest]
                          )
                        }}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-blue-100 border-blue-300 text-blue-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                        }`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {interests.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700 font-medium mb-2">Selected ({interests.length}):</p>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest) => (
                  <span key={interest} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasUpdated && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 text-sm">⚠️ This email has already updated interests</p>
            </div>
          )}

          <Button onClick={updateInterests} disabled={loading || hasUpdated} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {hasUpdated ? "Already Updated" : "Update Interests"}
          </Button>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dontShow" className="text-sm text-slate-600">
              Don't show this popup again
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}