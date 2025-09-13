"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface FormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  wbjeeRoll: string
  profilePhoto: File | null
  homeTown: string

  // Academic Information
  department: string
  currentYear: string
  semester: string
  cgpa: string
}

const departments = [
  "Textile Technology Department",
  "Computer Science & Engineering",
  "Information Technology",
  "Apparel Production Management",
]

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]

export function RegistrationForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    wbjeeRoll: "",
    profilePhoto: null,
    homeTown: "",
    department: "",
    currentYear: "",
    semester: "",
    cgpa: "",
  })

  const [isValidating, setIsValidating] = useState(false)
  const [wbjeeValid, setWbjeeValid] = useState<boolean | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [duplicateErrors, setDuplicateErrors] = useState({
    email: '',
    phone: '',
    wbjeeRoll: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
      
      setFormData(prev => ({ ...prev, profilePhoto: file }))
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: null }))
    setPhotoPreview(null)
  }

  const checkDuplicate = async (field: string, value: string) => {
    if (!value) {
      setDuplicateErrors(prev => ({ ...prev, [field]: '' }))
      return
    }

    try {
      const response = await fetch('/api/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value })
      })
      const { exists } = await response.json()
      
      if (exists) {
        const messages = {
          email: 'This email is already registered.',
          phone: 'Phone number already exists. Please use a different one.',
          wbjeeRoll: 'WBJEE Roll Number is already registered.'
        }
        setDuplicateErrors(prev => ({ ...prev, [field]: messages[field as keyof typeof messages] }))
      } else {
        setDuplicateErrors(prev => ({ ...prev, [field]: '' }))
      }
    } catch (error) {
      setDuplicateErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateWBJEE = (rollNumber: string) => {
    const isValid = /^\d{8,15}$/.test(rollNumber)
    setWbjeeValid(isValid)
    if (isValid) {
      checkDuplicate('wbjeeRoll', rollNumber)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.wbjeeRoll || !formData.homeTown || !formData.department || !formData.currentYear || !formData.profilePhoto) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    // Check for duplicate errors
    if (duplicateErrors.email || duplicateErrors.phone || duplicateErrors.wbjeeRoll) {
      toast({ title: "Error", description: "Please fix duplicate field errors", variant: "destructive" })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      submitData.append('fullName', formData.fullName)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('wbjeeRoll', formData.wbjeeRoll)
      submitData.append('homeTown', formData.homeTown)
      submitData.append('department', formData.department)
      submitData.append('currentYear', formData.currentYear)
      submitData.append('profilePhoto', formData.profilePhoto)
      
      const response = await fetch('/api/register', {
        method: 'POST',
        body: submitData,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast({ title: "Success!", description: "Profile created!" })
        router.push('/directory')
      } else {
        toast({ title: "Registration Failed", description: result.error || "Something went wrong", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading registration form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join GCETT Directory</h1>
          <p className="text-slate-600">Create your professional profile in minutes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                      checkDuplicate('email', e.target.value)
                    }}
                    placeholder="your.email@example.com"
                    className={`h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${duplicateErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {duplicateErrors.email && <p className="text-sm text-red-500">{duplicateErrors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      checkDuplicate('phone', e.target.value)
                    }}
                    placeholder="6291330610"
                    className={`h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${duplicateErrors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                  {duplicateErrors.phone && <p className="text-sm text-red-500">{duplicateErrors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wbjeeRoll" className="text-sm font-medium text-slate-700">WBJEE Roll Number *</Label>
                  <div className="relative">
                    <Input
                      id="wbjeeRoll"
                      value={formData.wbjeeRoll}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, wbjeeRoll: e.target.value }))
                        validateWBJEE(e.target.value)
                      }}
                      placeholder="Enter WBJEE roll number"
                      className={`h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${duplicateErrors.wbjeeRoll || wbjeeValid === false ? 'border-red-500' : ''}`}
                      required
                    />
                    {wbjeeValid === true && !duplicateErrors.wbjeeRoll && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {wbjeeValid === false && <p className="text-sm text-red-500">Invalid WBJEE roll number format</p>}
                  {duplicateErrors.wbjeeRoll && <p className="text-sm text-red-500">{duplicateErrors.wbjeeRoll}</p>}
                  <p className="text-xs text-muted-foreground">Users roll numbers will not be disclosed to anyone</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeTown" className="text-sm font-medium text-slate-700">Home Town *</Label>
                <Input
                  id="homeTown"
                  value={formData.homeTown}
                  onChange={(e) => setFormData((prev) => ({ ...prev, homeTown: e.target.value }))}
                  placeholder="Enter your home town (e.g. Berhampore)"
                  className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Profile Photo</h3>
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Required</span>
            </div>
            
            <div className="flex justify-center">
              {!photoPreview ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors w-full max-w-sm">
                  <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto" className="cursor-pointer block">
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-700 block">
                        Click to upload a photo
                      </span>
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </Label>
                    <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Academic Information</h3>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-slate-700">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentYear" className="text-sm font-medium text-slate-700">Current Year *</Label>
                  <Select
                    value={formData.currentYear}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, currentYear: value }))}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-sm font-medium text-slate-700">Current Semester (Optional)</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          {sem} Semester
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpa" className="text-sm font-medium text-slate-700">CGPA (Optional)</Label>
                  <Input
                    id="cgpa"
                    value={formData.cgpa}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cgpa: e.target.value }))}
                    placeholder="8.5"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>



          <div className="pt-6 border-t border-slate-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => console.log('Button clicked!')}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Profile...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create My Profile</span>
                </>
              )}
            </Button>
          </div>

          {/* Loading Overlay */}
          {isSubmitting && !isSuccess && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm mx-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Creating Your Profile</h3>
                <p className="text-sm text-slate-600 mb-4">Uploading photo and saving details...</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {isSuccess && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm mx-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Profile Created Successfully!</h3>
                <p className="text-sm text-slate-600 mb-4">Redirecting to directory...</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          )}
          </CardContent>
        </Card>
        </form>
      </div>
    </div>
  )
}
