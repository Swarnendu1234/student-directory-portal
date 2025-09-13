"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, AlertCircle } from "lucide-react"

interface Notice {
  _id: string
  title: string
  content: string
  type: string
  priority: string
  createdAt: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/admin/notices')
      if (response.ok) {
        const data = await response.json()
        setNotices(data)
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "default"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Notices & Notifications</h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading notices...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <Card key={notice._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{notice.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                      <Badge variant="outline">{notice.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {notice.content}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {notices.length === 0 && !loading && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notices available</h3>
                <p className="text-muted-foreground">Check back later for updates and announcements.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}