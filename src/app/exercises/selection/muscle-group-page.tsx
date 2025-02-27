"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PlusCircle, Dumbbell, ArrowLeft, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface MuscleGroup {
  id: number
  name: string
  description: string
  user_id: string
}

export default function SeleccionGrupoMuscular() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMuscleGroups()
  }, [])

  const fetchMuscleGroups = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para ver los grupos musculares",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.from("muscle_groups").select("*").order("created_at", { ascending: true })

      if (error) throw error

      if (data) {
        setMuscleGroups(data as MuscleGroup[])
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los grupos musculares",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewGroup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para crear grupos musculares",
          variant: "destructive",
        })
        return
      }

      if (newGroupName.trim() === "") {
        toast({
          title: "Error",
          description: "El nombre del grupo muscular es requerido",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("muscle_groups")
        .insert({
          name: newGroupName.trim(),
          description: newGroupDescription.trim(),
          user_id: session.user.id,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setMuscleGroups([...muscleGroups, data as MuscleGroup])
        setNewGroupName("")
        setNewGroupDescription("")
        setIsAddingNew(false)

        toast({
          title: "Éxito",
          description: "Grupo muscular creado correctamente",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el grupo muscular",
        variant: "destructive",
      })
    }
  }

  const handleSelectGroup = (groupId: number) => {
    localStorage.setItem("selectedGroup", groupId.toString())
    router.push(`/seleccion-variante?grupoMuscular=${groupId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Selección de Grupo Muscular</h1>
          <Link href="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Dumbbell className="mr-2" />
              Grupos Musculares Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {muscleGroups.length > 0 ? (
              <ul className="space-y-4 mb-6">
                <AnimatePresence>
                  {muscleGroups.map((group) => (
                    <motion.li
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium text-lg">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          </div>
                          <Button onClick={() => handleSelectGroup(group.id)} variant="default">
                            Seleccionar
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <p className="text-muted-foreground italic mb-6">
                No hay grupos musculares disponibles. ¡Crea uno nuevo!
              </p>
            )}

            {!isAddingNew ? (
              <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full">
                <PlusCircle className="mr-2" />
                Añadir nuevo grupo muscular
              </Button>
            ) : (
              <form onSubmit={handleAddNewGroup} className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium mb-1">
                    Nombre del grupo muscular
                  </label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <Textarea
                    id="groupDescription"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Añadir Grupo</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

