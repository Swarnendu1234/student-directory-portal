import { Navigation } from "@/components/navigation"
import { SignInForm } from "@/components/auth/signin-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your GCETT directory account</p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  )
}
