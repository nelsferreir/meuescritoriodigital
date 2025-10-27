'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signIn } from '@/lib/actions/auth.actions';
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
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl font-semibold py-3"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center gap-2 justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Entrando...
        </div>
      ) : (
        <div className="flex items-center gap-2 justify-center">
          <Lock className="h-4 w-4" />
          Entrar
        </div>
      )}
    </Button>
); }

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      <Card className="relative z-10 w-full max-w-md bg-card/95 dark:bg-card/80 border-2 border-stone-200 dark:border-stone-900 shadow-lg">

        <CardHeader className="space-y-2 pb-6 pt-3">
          <div className="text-center space-y-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
              Olá, pronto para acelerar? Seja bem-vindo(a) de volta!
            </CardTitle>
            <CardDescription>
              Cuidamos das suas estratégias. Entre em seu escritório digital com segurança:
            </CardDescription>
          </div>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="grid gap-6 pb-8">
            {/* Email Field */}
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-foreground/90 font-medium text-sm">
                Email cadastrado
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  required
                  className="pl-10 bg-stone-50 dark:bg-input border-stone-300 dark:border-input focus:border-orange-500 focus:ring-orange-500 rounded-xl py-3 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/90 font-medium text-sm">
                  Senha
                </Label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-500 font-medium transition-colors duration-200"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Sua senha segura"
                  required
                  className="pl-10 pr-10 bg-stone-50 dark:bg-input border-stone-300 dark:border-input focus:border-orange-500 focus:ring-orange-500 rounded-xl py-3 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {state && !state.success && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center dark:bg-destructive/10 dark:border-destructive/30">
                <div className="text-red-600 dark:text-destructive text-sm font-medium">
                  {state.message}
                </div>
              </div>
            )}

            {/* Success Message */}
            {state && state.success && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center dark:bg-green-500/10 dark:border-green-500/30">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  {state.message}
                </div>
              </div>
            )}

            <SubmitButton />

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Não tem cadastro?{' '}
                <Link 
                  href="/cadastro" 
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-500 font-semibold underline underline-offset-4 transition-colors duration-200"
                >
                  Cadastre-se agora
                </Link>
              </p>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
); }