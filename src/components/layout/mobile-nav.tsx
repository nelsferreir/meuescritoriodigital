'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Send } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.actions';
import type { User } from '@supabase/supabase-js';

type NavLink = { href: string; label: string; };

interface MobileNavProps {
  user: User | null;
  guestLinks: NavLink[];
  authLinks: NavLink[];
}

export function MobileNav({ user, guestLinks, authLinks }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const links = user ? authLinks : guestLinks;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[80vw] max-w-xs flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle asChild>
            <Link href={user ? "/dashboard" : "/"} onClick={() => setOpen(false)} className="font-bold text-lg">
              Meu Escritório Digital
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6">
          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-base">
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <SheetFooter className="p-6 pt-4 border-t">
          {user ? (
             <form action={signOut} className="w-full">
                <Button variant="outline" className="w-full">Sair</Button>
            </form>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link href="/login" onClick={() => setOpen(false)} className="w-full">
                <Button variant="ghost" className="w-full">Entrar</Button>
              </Link>
              <Link href="/cadastro" onClick={() => setOpen(false)} className="w-full">
                <Button className="w-full">Cadastre-se</Button>
              </Link>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
); }