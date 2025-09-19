import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with the developer for any queries or support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone/Whatsapp</h3>
              <a 
                href="tel:+916291330610" 
                className="text-foreground hover:text-muted-foreground font-medium"
              >
                +91 6291330610
              </a>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <a 
                href="mailto:swarnendumajumdert2007@gmail.com" 
                className="text-foreground hover:text-muted-foreground font-medium text-sm break-words"
              >
                swarnendumajumdert2007@gmail.com
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Developed by <span className="font-semibold">Swarnendu Majumder</span>
          </p>
        </div>
      </div>
    </div>
  )
}