import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Award, Heart, Mail, MapPin, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              About GCETT Directory
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Connecting the Future Engineers of <span className="text-primary">West Bengal</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              The GCETT Student Directory Portal is designed to foster connections, collaboration, and community among
              students at Government College of Engineering & Textile Technology.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To create a comprehensive platform that enables GCETT students to discover, connect, and collaborate
                  with their peers, fostering a vibrant academic and professional community that extends beyond
                  graduation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To build the most trusted and comprehensive student network for GCETT, where every student can
                  showcase their talents, find mentors, collaborate on projects, and build lasting professional
                  relationships.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Features */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose GCETT Directory?</h2>
              <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Built specifically for GCETT students, by GCETT students, with features that matter most to our
                community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Verified Profiles</h3>
                  <p className="text-sm text-muted-foreground">
                    All profiles are verified through WBJEE roll numbers ensuring authenticity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Academic Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Designed specifically for engineering and textile technology students.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Find students with similar interests, skills, and academic goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by students, for students, with continuous feedback and improvements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* College Information */}
          <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">About GCETT</h2>
              <p className="text-lg text-muted-foreground text-balance max-w-3xl mx-auto">
                Government College of Engineering & Textile Technology is a premier institution in West Bengal,
                dedicated to excellence in engineering and textile education.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">7</h3>
                <p className="text-sm text-muted-foreground">Engineering Departments</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">2000+</h3>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">50+</h3>
                <p className="text-sm text-muted-foreground">Years of Excellence</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Departments</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Computer Science & Engineering",
                  "Electronics & Communication Engineering",
                  "Electrical Engineering",
                  "Mechanical Engineering",
                  "Civil Engineering",
                  "Textile Technology",
                  "Chemical Engineering",
                ].map((dept) => (
                  <Badge key={dept} variant="secondary" className="text-xs">
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions or suggestions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          Government College of Engineering & Textile Technology
                          <br />
                          Serampore, Hooghly, West Bengal 712201
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">+91 33 2663 2154</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">info@gcett.ac.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">Support & Feedback</h3>
                  <p className="text-muted-foreground mb-6">
                    For technical support, feature requests, or general feedback about the directory portal, please
                    reach out to us.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <a href="mailto:directory@gcett.ac.in">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Feedback
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="/register">Join the Directory</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-primary/5 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Join hundreds of GCETT students who are already part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/register">Create Your Profile</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/directory">Browse Directory</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
