"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

export default function AIMLSubmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedinId: "",
    portfolioDescription: ""
  })
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
  const [additionalFile, setAdditionalFile] = useState<File | null>(null)
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

  const handleAdditionalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAdditionalFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setProgress(0)

    try {
      // Simulate progress steps
      setProgress(20)
      
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('linkedinId', formData.linkedinId)
      submitData.append('portfolioDescription', formData.portfolioDescription)
      submitData.append('category', 'AI/ML')
      
      setProgress(40)
      
      if (portfolioFile) {
        submitData.append('portfolioFile', portfolioFile)
      }
      
      if (additionalFile) {
        submitData.append('redesignFile', additionalFile)
      }
      
      setProgress(60)

      const response = await fetch('/api/skill-test/submit', {
        method: 'POST',
        body: submitData
      })
      
      setProgress(80)

      if (response.ok) {
        setProgress(100)
        setSubmitted(true)
        setTimeout(() => {
          router.push('/skill-test')
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Submission failed:', errorData)
        alert(`Submission failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Submission failed. Please try again.')
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
              <p className="text-lg mb-6">Your AI/ML portfolio has been submitted successfully.</p>
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
          <h1 className="text-3xl font-bold mb-4">AI/ML Portfolio Submission</h1>
          <p className="text-lg text-muted-foreground">
            Complete the AI/ML challenge and submit your solution
          </p>
        </div>

        {/* AI/ML Challenge Section */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">🤖 AI/ML Challenge: Resume Classification System</h2>
            
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Problem Statement:</h3>
              <p className="text-sm text-gray-700 mb-3">
                You are given a dataset of resumes (PDF/Word/Text) with candidate details. Build a model that can classify candidates into job roles (e.g., Data Scientist, Web Developer, AI Engineer) based on their resume content.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-3">Tasks for Students:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-fit">Step 1</span>
                  <div>
                    <strong>Preprocessing:</strong> Extract text from resumes (PDF/Doc)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-fit">Step 2</span>
                  <div>
                    <strong>Feature Engineering:</strong> Convert text into embeddings (TF-IDF / Word2Vec / BERT)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-fit">Step 3</span>
                  <div>
                    <strong>Modeling:</strong> Train a classification model (Logistic Regression, SVM, or simple Neural Net)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-fit">Step 4</span>
                  <div>
                    <strong>Output:</strong> Given a new resume, the system should predict the most relevant job role
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium min-w-fit">Bonus</span>
                  <div>
                    <strong>Ranking System:</strong> Add a ranking system (e.g., score candidates for AI/ML role)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Submission Requirements:</strong> Upload your complete solution including code, model, documentation, and a demo/results file.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-8">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Work Upload Section */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold mb-4 text-green-800">📁 Upload Your AI/ML Solution</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">Required Files:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Source code (.py, .ipynb, .zip)</p>
                      <p>• Trained model files (.pkl, .h5, .joblib)</p>
                      <p>• Documentation (README.md, report.pdf)</p>
                      <p>• Results/Demo (screenshots, output files)</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="portfolioFile">Upload Complete Solution *</Label>
                    <div className="mt-2">
                      <input
                        id="portfolioFile"
                        type="file"
                        accept=".zip,.rar,.7z,.pdf,.py,.ipynb"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        required
                      />
                    </div>
                    {portfolioFile && (
                      <p className="text-sm text-green-600 mt-2">✓ Solution uploaded: {portfolioFile.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Accepted formats: ZIP, RAR, 7Z, PDF, PY, IPYNB (Max 50MB)
                    </p>
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
                <Label htmlFor="additionalFile">Additional Portfolio (Optional)</Label>
                <div className="mt-2">
                  <input
                    id="additionalFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                    onChange={handleAdditionalFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {additionalFile && (
                  <p className="text-sm text-green-600 mt-2">✓ Additional portfolio: {additionalFile.name}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload additional work samples, case studies, or portfolio documents
                </p>
              </div>

              <div>
                <Label htmlFor="portfolioDescription">Solution Description (Optional)</Label>
                <Textarea
                  id="portfolioDescription"
                  value={formData.portfolioDescription}
                  onChange={(e) => setFormData({...formData, portfolioDescription: e.target.value})}
                  rows={4}
                  placeholder="Describe your approach to the resume classification challenge, technologies used, model performance, and key insights..."
                />
              </div>

              <Button type="submit" disabled={loading || !portfolioFile} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? 'Submitting...' : 'Submit AI/ML Solution'}
              </Button>
              
              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-sm mx-4">
                    <div className="mb-4">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Submitting Portfolio</h3>
                    <p className="text-gray-600 mb-4">Please wait while we upload your AI/ML portfolio...</p>
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