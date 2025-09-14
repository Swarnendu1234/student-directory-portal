"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Mail, ExternalLink, Github, Linkedin, TrendingUp } from "lucide-react"

interface Student {
  _id: string
  fullName: string
  email: string
  department: string
  phone: string
  homeTown: string
  currentYear: string
  profilePhotoUrl?: string
  createdAt: string
}



const departments = [
  "All Departments",
  "Textile Technology Department",
  "Computer Science & Engineering",
  "Information Technology",
  "Apparel Production Management",
]

const years = [
  "All Years",
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year"
]



export function StudentDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedYear, setSelectedYear] = useState("All Years")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetchStudents()
    
    // Check if coming from registration
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh') === 'true') {
      // Force refresh and clear URL parameter
      setTimeout(() => {
        fetchStudents()
        window.history.replaceState({}, '', '/directory')
      }, 500)
    }
    
    // Listen for page visibility changes to refresh data
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStudents()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchStudents()
    }
  }, [searchQuery, selectedDepartment, selectedYear, mounted])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions(searchQuery)
      }
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, showSuggestions])

  useEffect(() => {
    if (mounted) {
      // Auto-refresh every 1 hour to show new registrations
      const interval = setInterval(fetchStudents, 3600000)
      return () => clearInterval(interval)
    }
  }, [mounted])

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setIsTrending(data.trending)
      setSelectedIndex(-1)
    } catch (error) {
      setSuggestions([])
    }
  }

  const handleSearchFocus = () => {
    setShowSuggestions(true)
    if (!searchQuery) {
      fetchSuggestions('')
    }
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.fullName)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<strong>$1</strong>')
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedDepartment !== 'All Departments') params.append('department', selectedDepartment)
      if (selectedYear !== 'All Years') params.append('year', selectedYear)
      
      console.log('Fetching students with params:', params.toString())
      
      const response = await fetch(`/api/students?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch students')
      }
      
      const data = await response.json()
      console.log('Fetched students:', data)
      
      setStudents(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err instanceof Error ? err.message : 'Failed to load students')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading directory...</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatPhone = (phone: string) => {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Search by Name, Phone, or Home Town…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  {isTrending && (
                    <div className="px-3 py-2 text-xs text-gray-500 border-b flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending Students
                    </div>
                  )}
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion._id}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                        index === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium text-sm" 
                           dangerouslySetInnerHTML={{ __html: highlightMatch(suggestion.fullName, searchQuery) }} />
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span dangerouslySetInnerHTML={{ __html: highlightMatch(suggestion.homeTown, searchQuery) }} />
                        {suggestion.phone && (
                          <span dangerouslySetInnerHTML={{ __html: highlightMatch(suggestion.phone, searchQuery) }} />
                        )}
                      </div>
                      <div className="text-xs text-blue-600">{suggestion.department}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSuggestions && suggestions.length === 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                </div>
              )}
            </div>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
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
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Loading students...
            </span>
          ) : (
            `Showing ${filteredStudents.length} students`
          )}
        </p>
        {!loading && (
          <button
            onClick={fetchStudents}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Student Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Sl No.</th>
                  <th className="text-left p-4 font-semibold text-sm">Photo</th>
                  <th className="text-left p-4 font-semibold text-sm">Name</th>
                  <th className="text-left p-4 font-semibold text-sm">Department</th>
                  <th className="text-left p-4 font-semibold text-sm">Year</th>
                  <th className="text-left p-4 font-semibold text-sm">Home Town</th>
                  <th className="text-left p-4 font-semibold text-sm">Phone</th>
                  <th className="text-left p-4 font-semibold text-sm">Contact</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading students...
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-medium">{index + 1}</td>
                      <td className="p-4">
                        <Avatar 
                          className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                          onClick={() => {
                            if (student.profilePhotoUrl) {
                              setSelectedImage({ url: student.profilePhotoUrl, name: student.fullName })
                            }
                          }}
                        >
                          <AvatarImage 
                            src={student.profilePhotoUrl || "/placeholder.svg"} 
                            alt={student.fullName}
                            className="object-cover"
                            onError={(e) => {
                              console.log('Image failed to load:', student.profilePhotoUrl)
                            }}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {getInitials(student.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{student.fullName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(student.createdAt).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-xs">
                          {student.department}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{student.currentYear}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{student.homeTown}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{formatPhone(student.phone)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${student.email}`} title="Send Email">
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {!loading && filteredStudents.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Students Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedDepartment !== 'All Departments' || selectedYear !== 'All Years'
                ? 'No students match your search criteria.' 
                : 'No students have registered yet. Be the first to join!'}
            </p>
            {(searchQuery || selectedDepartment !== 'All Departments' || selectedYear !== 'All Years') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedDepartment("All Departments")
                  setSelectedYear("All Years")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
