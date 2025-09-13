"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Edit,
  MessageCircle,
} from "lucide-react"

interface StudentProfileProps {
  studentId: string
}

// Mock student data - in a real app, this would come from an API
const mockStudent = {
  id: "1",
  name: "Arjun Sharma",
  email: "arjun.sharma@gcett.ac.in",
  phone: "+91 9876543210",
  department: "Computer Science & Engineering",
  year: "3rd Year",
  semester: "6th",
  cgpa: 8.7,
  wbjeeRoll: "1234567890",
  bio: "Passionate about web development and machine learning. Currently working on AI-powered applications and contributing to open source projects. I love solving complex problems and building innovative solutions that can make a real impact.",
  skills: ["React", "Python", "Machine Learning", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS"],
  interests: ["AI/ML", "Web Development", "Open Source", "Competitive Programming", "Tech Talks"],
  location: "Kolkata, West Bengal",
  joinedDate: "August 2022",
  avatar: "/placeholder.svg",
  linkedIn: "https://linkedin.com/in/arjunsharma",
  github: "https://github.com/arjunsharma",
  portfolio: "https://arjunsharma.dev",
  projects: [
    {
      title: "AI-Powered Study Assistant",
      description: "A machine learning application that helps students with personalized study recommendations.",
      tech: ["Python", "TensorFlow", "React", "FastAPI"],
      link: "https://github.com/arjunsharma/study-assistant",
    },
    {
      title: "Campus Event Management System",
      description: "Full-stack web application for managing college events and student registrations.",
      tech: ["React", "Node.js", "MongoDB", "Express"],
      link: "https://github.com/arjunsharma/campus-events",
    },
  ],
  achievements: [
    "Winner - GCETT Hackathon 2023",
    "Google Summer of Code Participant 2023",
    "Dean's List - Academic Excellence",
    "Best Project Award - Software Engineering Course",
  ],
}

export function StudentProfile({ studentId }: StudentProfileProps) {
  const student = mockStudent // In real app, fetch based on studentId

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="w-24 h-24 mx-auto md:mx-0">
                <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{student.department}</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {student.year} • {student.semester} Semester
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>CGPA: {student.cgpa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{student.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {student.joinedDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button size="sm" asChild>
                    <a href={`mailto:${student.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{student.bio}</p>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                <div className="space-y-6">
                  {student.projects.map((project, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.title}</h3>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <div className="space-y-3">
                  {student.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${student.email}`} className="text-sm hover:text-primary">
                      {student.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{student.location}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex gap-2">
                  {student.linkedIn && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={student.linkedIn} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {student.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={student.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {student.portfolio && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={student.portfolio} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Academic Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WBJEE Roll:</span>
                    <span className="font-mono">{student.wbjeeRoll}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span>{student.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Year:</span>
                    <span>{student.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semester:</span>
                    <span>{student.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGPA:</span>
                    <span className="font-semibold">{student.cgpa}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
