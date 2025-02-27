'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  const supabase = createClientComponentClient()
  const [testResults, setTestResults] = useState<{[key: string]: boolean | string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
    }
    checkUser()
  }, [supabase.auth])

  const formatError = (error: any): string => {
    if (typeof error === 'string') return error
    if (error instanceof Error) return error.message
    if (error && typeof error === 'object' && 'message' in error) return error.message
    return JSON.stringify(error)
  }

  const runTests = async () => {
    setIsLoading(true)
    const results: {[key: string]: boolean | string} = {}

    // Test 1: Verificar conexión con Supabase
    try {
      const { data, error } = await supabase.from('muscle_groups').select('count').single()
      results['Conexión Supabase'] = error ? `Error: ${formatError(error)}` : true
    } catch (error) {
      results['Conexión Supabase'] = `Error: ${formatError(error)}`
    }

    // Test 2: Verificar autenticación
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      if (!session) throw new Error('No hay sesión activa')
      results['Autenticación'] = true
      setUserId(session.user.id)
    } catch (error) {
      results['Autenticación'] = `Error: ${formatError(error)}`
      setIsLoading(false)
      return
    }

    // Test 3: Probar operaciones CRUD
    try {
      if (!userId) throw new Error('Usuario no autenticado')

      // Crear grupo muscular
      const { data: muscleGroup, error: createError } = await supabase
        .from('muscle_groups')
        .insert({
          name: 'Grupo de Prueba',
          description: 'Descripción de prueba',
          user_id: userId // Importante: incluir el user_id
        })
        .select()
        .single()

      if (createError) throw createError

      // Verificar que se creó correctamente
      const { data: readData, error: readError } = await supabase
        .from('muscle_groups')
        .select('*')
        .eq('id', muscleGroup?.id)
        .single()

      if (readError) throw readError

      // Actualizar grupo muscular
      const { error: updateError } = await supabase
        .from('muscle_groups')
        .update({ description: 'Descripción actualizada' })
        .eq('id', muscleGroup?.id)

      if (updateError) throw updateError

      // Eliminar grupo muscular
      const { error: deleteError } = await supabase
        .from('muscle_groups')
        .delete()
        .eq('id', muscleGroup?.id)

      if (deleteError) throw deleteError

      results['Operaciones CRUD'] = true
    } catch (error) {
      results['Operaciones CRUD'] = `Error: ${formatError(error)}`
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Pruebas de Integración Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTests} 
            disabled={isLoading}
            className="mb-4 w-full"
          >
            {isLoading ? 'Ejecutando pruebas...' : 'Ejecutar pruebas'}
          </Button>

          <div className="space-y-2">
            {Object.entries(testResults).map(([test, status]) => (
              <div 
                key={test} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{test}</span>
                <span className={`${
                  status === true 
                    ? 'text-green-500' 
                    : typeof status === 'string' && status.startsWith('Error')
                    ? 'text-red-500'
                    : 'text-yellow-500'
                } font-medium`}>
                  {status === true ? '✓ OK' : status}
                </span>
              </div>
            ))}
          </div>

          {!userId && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
              ⚠️ Debes iniciar sesión para ejecutar todas las pruebas correctamente.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}