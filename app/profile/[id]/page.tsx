import { Navigation } from "@/components/navigation"
import { StudentProfile } from "@/components/student-profile"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <StudentProfile studentId={params.id} />
    </div>
  )
}
