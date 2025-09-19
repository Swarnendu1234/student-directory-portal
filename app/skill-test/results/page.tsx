"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Trophy, Clock, Calendar } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Get result data from URL params or API
    const testType = searchParams.get('type')
    const score = searchParams.get('score')
    
    // Mock result data
    setResult({
      candidateName: "John Doe",
      testType: testType === 'ai-ml' ? 'AI/ML' : 'UI/UX',
      score: parseInt(score || '0'),
      totalQuestions: testType === 'ai-ml' ? 15 : 5,
      timeTaken: testType === 'ai-ml' ? 1800 : 2700,
      testDate: new Date().toISOString(),
      status: testType === 'ai-ml' ? 'Completed' : 'Pending Evaluation',
      rank: Math.floor(Math.random() * 100) + 1
    })
  }, [searchParams])

  const downloadPDF = () => {
    // Generate and download PDF report
    const element = document.createElement('a')
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('PDF Report Content')
    element.download = `skill-test-report-${result?.testType.toLowerCase()}.pdf`
    element.click()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-orange-600"
    return "text-red-600"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Average"
    return "Needs Improvement"
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">Loading results...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Test Results</h1>
          <p className="text-lg text-muted-foreground">
            {result.status === 'Completed' ? 'Your test has been completed and graded' : 'Your submission is under review'}
          </p>
        </div>

        {/* Result Card */}
        <Card className="p-8 mb-8">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Candidate Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{result.candidateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test Type:</span>
                      <span className={`font-medium px-2 py-1 rounded text-sm ${
                        result.testType === 'AI/ML' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {result.testType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${
                        result.status === 'Completed' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Test Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Date:</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(result.testDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time Taken:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(result.timeTaken)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span>{result.totalQuestions}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Your Score</h3>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                    {result.status === 'Completed' ? `${result.score}%` : 'Pending'}
                  </div>
                  {result.status === 'Completed' && (
                    <div className="text-lg text-muted-foreground">
                      {getPerformanceLevel(result.score)}
                    </div>
                  )}
                </div>

                {result.status === 'Completed' && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">Rank</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">#{result.rank}</div>
                    <div className="text-sm text-muted-foreground">out of 1,247 participants</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={downloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/skill-test/leaderboard">View Leaderboard</a>
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/skill-test">Take Another Test</a>
          </Button>
        </div>

        {/* Performance Breakdown */}
        {result.status === 'Completed' && result.testType === 'AI/ML' && (
          <Card className="p-6 mt-8">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-4">Performance Breakdown</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-muted-foreground">Easy Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-muted-foreground">Medium Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Hard Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}