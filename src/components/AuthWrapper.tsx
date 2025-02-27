"use client"

import { useSession } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const session = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading time
      if (!session) {
        router.push("/login")
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [session, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not logged in</div>
  }

  return (
    <>
      {children}
      <div className="fixed bottom-0 left-0 w-full bg-secondary p-4">
        <Button variant="outline" onClick={() => session.user.logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )
}

