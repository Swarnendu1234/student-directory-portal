import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Palette, Upload } from "lucide-react"
import Link from "next/link"

export default function SkillTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Smart India Hackathon
          </h1>
          <h2 className="text-3xl font-semibold mb-6">Skill Assessment Tests</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your skills and compete with the best minds in India. Choose your domain and showcase your expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
            <CardContent className="p-0 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI/ML Portfolio</h3>
              <p className="text-muted-foreground mb-6">
                Submit your AI/ML projects, LinkedIn profile, and contact details
              </p>
              <div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <span>Portfolio Upload</span>
                </div>
                <div>LinkedIn Profile</div>
                <div>Contact Info</div>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/skill-test/ai-ml">Submit AI/ML Portfolio</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200">
            <CardContent className="p-0 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">UI/UX Portfolio</h3>
              <p className="text-muted-foreground mb-6">
                Submit your design portfolio, LinkedIn profile, and contact details
              </p>
              <div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <span>Portfolio Upload</span>
                </div>
                <div>LinkedIn Profile</div>
                <div>Contact Info</div>
              </div>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/skill-test/ui-ux">Submit UI/UX Portfolio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}