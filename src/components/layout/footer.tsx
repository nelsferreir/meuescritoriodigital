import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Meu Escritório Digital. Todos os direitos reservados.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-sm hover:underline underline-offset-4">
            Privacidade
          </Link>
        </nav>
      </div>
    </footer>
); }