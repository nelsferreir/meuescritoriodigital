import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.actions';
import { MobileNav } from './mobile-nav';
import { AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const guestLinks = [
    { href: '/#features', label: 'Funcionalidades' },
    { href: '/#pricing', label: 'Planos' },
  ];

  const authLinks = [
    { href: '/dashboard', label: 'Painel Inicial' },
    { href: '/dashboard/clientes', label: 'Clientes' },
    { href: '/dashboard/casos', label: 'Casos' },
    { href: '/dashboard/documentos', label: 'Documentos' },
    { href: '/dashboard/calendario', label: 'Calendário' },
  ];

  const linksToRender = user ? authLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center px-4">

        <div className="mr-auto flex items-center gap-8">
          <Link 
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-amber-700 text-white shadow-lg">
              <AlignHorizontalJustifyCenter className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
                Dr. Nelson Ferreira
              </span>
              <span className="text-xs text-stone-500 -mt-1 hidden sm:block">
                Direito com propósito e performance.
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {linksToRender.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant="ghost" 
                  className="text-stone-700 hover:text-orange-700 hover:bg-orange-50/50 dark:text-stone-300 dark:hover:text-orange-400 dark:hover:bg-accent/50 transition-all duration-200 font-medium rounded-lg px-4 py-2 hover:cursor-pointer"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Ações do Usuário e Menu Mobile */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone-100/50 dark:bg-card border dark:border-border">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.email?.charAt(0)}
                  </div>
                  <div className="hidden lg:flex flex-col">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-200">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <AlignHorizontalJustifyEnd className="h-3 w-3 text-amber-500" />
                      Premium
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <form action={signOut}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-lg transition-all duration-200 hover:cursor-pointer"
                  >
                    Sair
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    className="rounded-lg font-medium transition-all duration-200 hover:cursor-pointer"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button 
                    className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:cursor-pointer"
                  >
                    <AlignHorizontalJustifyEnd className="h-4 w-4 mr-1" />
                    Quero me Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <MobileNav user={user} authLinks={authLinks} guestLinks={guestLinks} />
        </div>
      </div>
    </header>
); }