'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestPasswordReset } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar Link de Recuperação'}
    </Button>
); }

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
        <CardDescription>
          Digite seu e-mail para receber um link de redefinição de senha.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    required
                    className="pl-10"
                />
            </div>
          </div>

          {state && (
            <div
              className={`rounded-md p-3 text-sm font-medium text-center ${
                state.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {state.message}
            </div>
          )}

          <SubmitButton />

          <div className="mt-4 text-center text-sm">
            Lembrou a senha?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
); }