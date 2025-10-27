'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePassword } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Salvando...' : 'Salvar Nova Senha'}
    </Button>
); }

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePassword, null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
     
    });

    return () => {
      subscription.unsubscribe();
  }; }, []);


  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Crie uma nova senha</CardTitle>
        <CardDescription>
          Digite sua nova senha abaixo. Ela deve ter no mínimo 6 caracteres.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                className="pl-10"
              />
            </div>
          </div>

          {state && !state.success && (
            <div className="rounded-md bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
              {state.message}
            </div>
          )}

          {state && state.success && (
             <div className="flex flex-col items-center gap-4 rounded-md bg-green-100 p-4 text-center text-sm font-medium text-green-800">
                <p>{state.message}</p>
                <Link href="/login" className='w-full'>
                  <Button className="w-full">Ir para o Login</Button>
                </Link>
            </div>
          )}

          {!state?.success && <SubmitButton />}

        </CardContent>
      </form>
    </Card>
); }