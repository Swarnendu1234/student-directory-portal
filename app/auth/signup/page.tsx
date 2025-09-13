import { Navigation } from "@/components/navigation"
import { SignUpForm } from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join the GCETT student community</p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
