"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle, Loader2, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function UIUXSubmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedinId: "",
    portfolioDescription: ""
  })
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const [redesignFile, setRedesignFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPortfolioFile(file)
    }
  }

  const handleRedesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRedesignFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProgress(0)

    try {
      // Simulate progress steps
      setProgress(15)
      
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('linkedinId', formData.linkedinId)
      submitData.append('portfolioDescription', formData.portfolioDescription)
      submitData.append('category', 'UI/UX')
      
      setProgress(30)
      
      if (portfolioFile) {
        submitData.append('portfolioFile', portfolioFile)
      }
      
      setProgress(50)
      
      if (redesignFile) {
        submitData.append('redesignFile', redesignFile)
      }
      
      setProgress(70)

      const response = await fetch('/api/skill-test/submit', {
        method: 'POST',
        body: submitData
      })
      
      setProgress(90)

      if (response.ok) {
        setProgress(100)
        setSubmitted(true)
        setTimeout(() => {
          router.push('/skill-test')
        }, 2000)
      }
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Card className="p-8">
            <CardContent className="p-0 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Submission Successful!</h1>
              <p className="text-lg mb-6">Your UI/UX portfolio has been submitted successfully.</p>
              <p className="text-muted-foreground">Redirecting to main page...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">UI/UX Portfolio Submission</h1>
          <p className="text-lg text-muted-foreground">
            Complete the redesign challenge and submit your portfolio
          </p>
        </div>

        <Card className="p-8">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Redesign Challenge Section */}
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-xl font-bold mb-4 text-orange-800">🎨 Redesign Challenge (Required)</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">Challenge: Redesign Revolut Homepage</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Redesign the homepage of <strong>Revolut.com</strong> using Figma or any design software.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <ExternalLink className="w-4 h-4" />
                      <a href="https://www.revolut.com" target="_blank" className="text-blue-600 hover:underline text-sm">
                        Visit Revolut.com to analyze current design
                      </a>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Focus on improving user experience and visual design</p>
                      <p>• Consider mobile responsiveness in your design</p>
                      <p>• Export your design as PNG/JPG or PDF</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="redesignFile">Upload Your Redesign *</Label>
                    <div className="mt-2">
                      <input
                        id="redesignFile"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleRedesignFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        required
                      />
                    </div>
                    {redesignFile && (
                      <p className="text-sm text-green-600 mt-2">✓ Redesign uploaded: {redesignFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinId">LinkedIn Profile URL (Optional)</Label>
                  <Input
                    id="linkedinId"
                    value={formData.linkedinId}
                    onChange={(e) => setFormData({...formData, linkedinId: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioFile">Portfolio File (PDF, PNG, JPG, ZIP)</Label>
                <div className="mt-2">
                  <input
                    id="portfolioFile"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
                {portfolioFile && (
                  <p className="text-sm text-green-600 mt-2">Selected: {portfolioFile.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="portfolioDescription">Portfolio Description (Optional)</Label>
                <Textarea
                  id="portfolioDescription"
                  value={formData.portfolioDescription}
                  onChange={(e) => setFormData({...formData, portfolioDescription: e.target.value})}
                  rows={4}
                  placeholder="Describe your UI/UX projects, design philosophy, and experience..."
                />
              </div>

              <Button type="submit" disabled={loading || !redesignFile} className="w-full bg-orange-600 hover:bg-orange-700">
                {loading ? 'Submitting...' : 'Submit Portfolio'}
              </Button>
              
              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-sm mx-4">
                    <div className="mb-4">
                      <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Submitting Portfolio</h3>
                    <p className="text-gray-600 mb-4">Please wait while we upload your UI/UX portfolio and redesign...</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}