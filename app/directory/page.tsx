import { Navigation } from "@/components/navigation"
import dynamic from "next/dynamic"

const StudentDirectory = dynamic(() => import("@/components/student-directory").then(mod => ({ default: mod.StudentDirectory })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading directory...</p>
      </div>
    </div>
  )
})

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Student Directory</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Discover and connect with fellow GCETT students
            </p>
          </div>

          <StudentDirectory />
        </div>
      </div>
    </div>
  )
}
