"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Mail, Shield, RefreshCw, Heart } from "lucide-react"

// Exact same interest categories as registration
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

export function UpdateInterestsPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Email, 2: OTP & Interests
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Show popup on every page refresh
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1500) // Show after 1.5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleSendOTP = async () => {
    if (!email) return
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/update-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email })
      })

      const data = await response.json()
      if (response.ok) {
        setStep(2)
        setInterests(data.currentInterests || [])
        setMessage("OTP sent to your email! Current interests are pre-selected.")
      } else {
        setMessage(data.error || "Failed to send OTP")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInterests = async () => {
    if (!otp || interests.length === 0) return
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch('/api/update-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-update', email, otp, interests })
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("✅ Interests updated successfully!")
        setTimeout(() => {
          setIsOpen(false)
          // Reset form for next time
          setStep(1)
          setEmail("")
          setOtp("")
          setInterests([])
          setMessage("")
        }, 2000)
      } else {
        setMessage(data.error || "Failed to update interests")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interest])
    } else {
      setInterests(interests.filter(i => i !== interest))
    }
  }

  const resetForm = () => {
    setStep(1)
    setEmail("")
    setOtp("")
    setInterests([])
    setMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Update Your Interests
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Enter your registered email to update interests</p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email">Registered Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <Button onClick={handleSendOTP} disabled={loading || !email} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send OTP
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Check your email for the verification code</p>
            </div>

            <div>
              <Label htmlFor="otp">Enter 6-Digit OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-1">⏰ OTP expires in 10 minutes</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Heart className="text-pink-600 w-4 h-4" />
                <Label className="text-base font-semibold text-slate-800">Interests & Hobbies</Label>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Optional</span>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
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
                            onClick={() => handleInterestChange(interest, !isSelected)}
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
                  <p className="text-sm text-blue-700 font-medium mb-2">Selected Interests ({interests.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {interests.map((interest) => (
                      <span key={interest} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {message && (
              <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleUpdateInterests} 
                disabled={loading || !otp || interests.length === 0}
                className="flex-1"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Interests
              </Button>
            </div>
          </div>
        )}

        <div className="text-center border-t pt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-sm text-gray-500">
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}