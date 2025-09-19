"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, Clock, Calendar } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  college: string
  score: number
  testType: 'AI/ML' | 'UI/UX'
  timeTaken: number
  testDate: string
  badge?: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [testFilter, setTestFilter] = useState("All")
  const [timeFilter, setTimeFilter] = useState("Overall")

  useEffect(() => {
    // Mock leaderboard data
    const mockEntries: LeaderboardEntry[] = [
      {
        rank: 1,
        name: "Rahul Sharma",
        college: "IIT Delhi",
        score: 95,
        testType: "AI/ML",
        timeTaken: 1200,
        testDate: "2024-01-15",
        badge: "Top Performer"
      },
      {
        rank: 2,
        name: "Priya Patel",
        college: "GCETT Serampore",
        score: 92,
        testType: "UI/UX",
        timeTaken: 2100,
        testDate: "2024-01-14",
        badge: "Fast Solver"
      },
      {
        rank: 3,
        name: "Arjun Kumar",
        college: "NIT Trichy",
        score: 90,
        testType: "AI/ML",
        timeTaken: 1350,
        testDate: "2024-01-13"
      }
    ]
    setEntries(mockEntries)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-lg">{rank}</span>
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Top Performer":
        return "bg-purple-100 text-purple-700"
      case "Fast Solver":
        return "bg-green-100 text-green-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Top performers in Smart India Hackathon Skill Tests
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={testFilter} onValueChange={setTestFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Test Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tests</SelectItem>
              <SelectItem value="AI/ML">AI/ML Test</SelectItem>
              <SelectItem value="UI/UX">UI/UX Test</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Today</SelectItem>
              <SelectItem value="Weekly">This Week</SelectItem>
              <SelectItem value="Overall">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Participant</th>
                    <th className="text-left p-4 font-semibold">College/Team</th>
                    <th className="text-left p-4 font-semibold">Test Type</th>
                    <th className="text-left p-4 font-semibold">Score</th>
                    <th className="text-left p-4 font-semibold">Time</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.rank} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{entry.name}</div>
                      </td>
                      <td className="p-4 text-muted-foreground">{entry.college}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.testType === 'AI/ML' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {entry.testType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-lg">{entry.score}%</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(entry.timeTaken)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entry.testDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {entry.badge && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(entry.badge)}`}>
                            {entry.badge}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          
          <Card className="p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <div className="text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          
          <Card className="p-6 text-center">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-green-600 mb-2">23m</div>
              <div className="text-muted-foreground">Average Time</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}