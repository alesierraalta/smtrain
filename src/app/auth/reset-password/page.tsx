'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Button, Input, Label, Alert, AlertDescription } from '@/components/ui';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!accessToken) {
      setError('Token de acceso no válido.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser(accessToken, {
        password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Ha ocurrido un error al restablecer la contraseña.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleResetPassword} className="space-y-4 max-w-md w-full p-6 bg-white rounded-md">
        <h1 className="text-xl font-semibold">Restablecer Contraseña</h1>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success ? (
          <p className="text-green-600">Contraseña actualizada con éxito. <a href="/auth/login" className="underline">Inicia sesión</a>.</p>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Restablecer Contraseña</Button>
          </>
        )}
      </form>
    </div>
  );
}
