import { Navigation } from "@/components/navigation"
import dynamic from "next/dynamic"

const RegistrationForm = dynamic(() => import("@/components/registration-form").then(mod => ({ default: mod.RegistrationForm })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading registration form...</p>
      </div>
    </div>
  )
})

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Join the Directory</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Create your profile and connect with fellow GCETT students
            </p>
          </div>

          <RegistrationForm />
        </div>
      </div>
    </div>
  )
}
