'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUp } from '@/lib/actions/auth.actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Criando conta...' : 'Criar Conta'}
    </Button>
); }

export function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Cadastro</CardTitle>
        <CardDescription>
          Crie sua conta para acessar o seu escritório digital.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" name="name" placeholder="Seu nome" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
            />
          </div>

          {state && (
            <div
              className={`rounded-md p-3 text-sm font-medium text-center ${
                state.success
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {state.message}
            </div>
          )}

          <SubmitButton />

          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
); }