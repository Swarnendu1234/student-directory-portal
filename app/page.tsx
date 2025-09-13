import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Users, GraduationCap, Search, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            Government College of Engineering & Textile Technology, Serampore
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 tracking-tight">
            Student Directory
            <span className="text-muted-foreground"> Portal</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with your peers, discover talents, and build lasting relationships within our engineering community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-base font-medium" asChild>
              <a href="/directory">Browse Directory</a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium bg-transparent" asChild>
              <a href="/register">Register Now</a>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground/50 mt-8">Made by Swarnendu Majumder</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Everything you need to connect</h2>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              A comprehensive platform designed specifically for GCETT students to network and collaborate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Student Profiles</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Comprehensive profiles with academic details, skills, and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Find students by department, year, skills, or interests instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">WBJEE Verified</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Authentic profiles verified through WBJEE roll numbers.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your data is protected with enterprise-grade security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to join the community?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Create your profile today and start connecting with fellow GCETT students.
          </p>
          <Button size="lg" className="px-8 py-3 text-base font-medium" asChild>
            <a href="/register">Get Started</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold mb-1">GCETT Student Directory</h3>
              <p className="text-sm text-muted-foreground">Government College of Engineering & Textile Technology</p>
            </div>
            <div className="text-sm text-muted-foreground">Made by Swarnendu Majumder</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
