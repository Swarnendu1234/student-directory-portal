"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, LogOut, Bell, Loader2, CheckCircle, Users, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notice {
  _id: string
  title: string
  content: string
  type: string
  priority: string
  createdAt: string
}

interface Submission {
  _id: string
  name: string
  email: string
  phone: string
  linkedinId: string
  portfolioDescription: string
  category: 'AI/ML' | 'UI/UX'
  portfolio_file_name: string
  portfolio_url?: string
  redesign_file_name?: string
  redesign_url?: string
  created_at: string
  status: string
}

export default function AdminDashboard() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Academic",
    priority: "Medium"
  })

  const router = useRouter()

  useEffect(() => {
    fetchNotices()
    fetchSubmissions()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/admin/notices")
      if (response.ok) {
        const data = await response.json()
        setNotices(data)
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const url = "/api/admin/notices"
      const method = editingNotice ? "PUT" : "POST"
      const body = editingNotice 
        ? { ...formData, id: editingNotice._id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          fetchNotices()
          setIsDialogOpen(false)
          resetForm()
          setShowSuccess(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to save notice:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return

    try {
      const response = await fetch(`/api/admin/notices?id=${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        fetchNotices()
      }
    } catch (error) {
      console.error("Failed to delete notice:", error)
    }
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      priority: notice.priority
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ title: "", content: "", type: "Academic", priority: "Medium" })
    setEditingNotice(null)
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="notices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notices
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Portfolio Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notices" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Notices</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? "Edit Notice" : "Add New Notice"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Facility">Facility</SelectItem>
                        <SelectItem value="Registration">Registration</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {showSuccess && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
                    <CheckCircle className="w-4 h-4" />
                    <span>Notice {editingNotice ? "updated" : "created"} successfully! Email notifications sent.</span>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingNotice ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <Card key={notice._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(notice.priority)}>
                      {notice.priority}
                    </Badge>
                    <Badge variant="outline">{notice.type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(notice)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notice._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{notice.content}</p>
              </CardContent>
            </Card>
          ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Portfolio Submissions</h2>
              <div className="text-sm text-muted-foreground">
                Total: {submissions.length} submissions
              </div>
            </div>

            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{submission.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={submission.category === 'AI/ML' ? 'default' : 'secondary'}>
                          {submission.category}
                        </Badge>
                        <Badge variant="outline">{submission.status}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => { setViewingSubmission(submission); setIsSubmissionDialogOpen(true) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Phone:</strong> {submission.phone}</div>
                      <div><strong>LinkedIn:</strong> {submission.linkedin_id ? (
                        <a href={submission.linkedin_id} target="_blank" className="text-blue-600 hover:underline ml-1">View Profile</a>
                      ) : (
                        <span className="text-gray-500 ml-1">Not provided</span>
                      )}</div>
                      {submission.portfolio_file_name && (
                        <div><strong>Portfolio:</strong> 
                          {submission.portfolio_url ? (
                            <a href={submission.portfolio_url} target="_blank" className="text-blue-600 hover:underline ml-1">
                              {submission.portfolio_file_name}
                            </a>
                          ) : (
                            <span className="ml-1">{submission.portfolio_file_name}</span>
                          )}
                        </div>
                      )}
                      {submission.redesign_file_name && (
                        <div><strong>{submission.category === 'AI/ML' ? 'Solution:' : 'Redesign:'}</strong> 
                          {submission.redesign_url ? (
                            <a href={submission.redesign_url} target="_blank" className="text-orange-600 hover:underline ml-1">
                              {submission.redesign_file_name}
                            </a>
                          ) : (
                            <span className="ml-1">{submission.redesign_file_name}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Submission Dialog */}
        <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
            </DialogHeader>
            {viewingSubmission && (
              <div className="space-y-4 pr-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">{viewingSubmission.name}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Badge variant={viewingSubmission.category === 'AI/ML' ? 'default' : 'secondary'}>
                      {viewingSubmission.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <p className="break-all">{viewingSubmission.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{viewingSubmission.phone}</p>
                  </div>
                </div>
                <div>
                  <Label>LinkedIn Profile</Label>
                  {viewingSubmission.linkedin_id ? (
                    <a href={viewingSubmission.linkedin_id} target="_blank" className="text-blue-600 hover:underline block break-all">
                      {viewingSubmission.linkedin_id}
                    </a>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
                {/* For AI/ML: Show files in correct order */}
                {viewingSubmission.category === 'AI/ML' ? (
                  <>
                    {viewingSubmission.redesign_file_name && (
                      <div>
                        <Label>Solution File</Label>
                        {viewingSubmission.redesign_url ? (
                          <a href={viewingSubmission.redesign_url} target="_blank" className="text-orange-600 hover:underline font-medium block break-all">
                            {viewingSubmission.redesign_file_name} (Download)
                          </a>
                        ) : (
                          <p className="font-medium text-orange-600 break-all">{viewingSubmission.redesign_file_name}</p>
                        )}
                      </div>
                    )}
                    {viewingSubmission.portfolio_file_name && (
                      <div>
                        <Label>Additional Portfolio</Label>
                        {viewingSubmission.portfolio_url ? (
                          <a href={viewingSubmission.portfolio_url} target="_blank" className="text-blue-600 hover:underline block break-all">
                            {viewingSubmission.portfolio_file_name} (Download)
                          </a>
                        ) : (
                          <p className="break-all">{viewingSubmission.portfolio_file_name}</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* For UI/UX: Keep original order */
                  <>
                    {viewingSubmission.portfolio_file_name && (
                      <div>
                        <Label>Portfolio File</Label>
                        {viewingSubmission.portfolio_url ? (
                          <a href={viewingSubmission.portfolio_url} target="_blank" className="text-blue-600 hover:underline block break-all">
                            {viewingSubmission.portfolio_file_name} (Download)
                          </a>
                        ) : (
                          <p className="break-all">{viewingSubmission.portfolio_file_name}</p>
                        )}
                      </div>
                    )}
                    {viewingSubmission.redesign_file_name && (
                      <div>
                        <Label>Redesign Challenge File</Label>
                        {viewingSubmission.redesign_url ? (
                          <a href={viewingSubmission.redesign_url} target="_blank" className="text-orange-600 hover:underline font-medium block break-all">
                            {viewingSubmission.redesign_file_name} (Download)
                          </a>
                        ) : (
                          <p className="font-medium text-orange-600 break-all">{viewingSubmission.redesign_file_name}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
                <div>
                  <Label>Portfolio Description</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{viewingSubmission.portfolio_description || 'No description provided'}</p>
                </div>
                <div>
                  <Label>Submitted At</Label>
                  <p>{new Date(viewingSubmission.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}