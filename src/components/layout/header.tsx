import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.actions';
import { MobileNav } from './mobile-nav';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const guestLinks = [
    { href: '/#features', label: 'Funcionalidades' },
  ];

  const authLinks = [
    { href: '/dashboard', label: 'Painel' },
    { href: '/dashboard/clientes', label: 'Clientes' },
    { href: '/dashboard/casos', label: 'Casos' },
  ];

  const linksToRender = user ? authLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo e Links Principais */}
        <div className="mr-auto flex items-center gap-8">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <span className="font-bold text-lg">Meu Escritório Digital</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {linksToRender.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost">{link.label}</Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Ações do Usuário e Menu Mobile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <form action={signOut}>
                <Button variant="outline" size="sm">Sair</Button>
              </form>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button>Cadastre-se Gratuitamente</Button>
                </Link>
              </>
            )}
          </div>
          <MobileNav user={user} authLinks={authLinks} guestLinks={guestLinks} />
        </div>
      </div>
    </header>
); }