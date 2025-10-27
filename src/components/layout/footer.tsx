import Link from 'next/link';
import { AlignHorizontalJustifyCenter, Mail, MapPin, Instagram, Facebook, Cable } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerSections = [
    {
      title: 'Produto',
      links: [
        { label: 'Funcionalidades', href: '/#features' },
        { label: 'Planos', href: '/#pricing' },
        { label: 'Casos de Sucesso', href: '/cases' },
        { label: 'Updates', href: '/updates' },
    ], }, {
      title: 'Recursos',
      links: [
        { label: 'Documentação', href: '/docs' },
        { label: 'Tutoriais', href: '/tutorials' },
    ], }, {
      title: 'Dr. Nelson Ferreira',
      links: [
        { label: 'Sobre Mim', href: '/about' },
        { label: 'Contato', href: '/contact' },
        { label: 'Parceiros', href: '/partners' },
  ], }, ];

  return (
    <footer className="relative border-t border-border bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-stone-900/[0.02] dark:bg-grid-stone-400/[0.04] bg-[size:60px_60px]" />
      <div className="container mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="px-4 py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-6">
            {/* Brand Section */}
            <div className="xl:col-span-3">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 text-white shadow-lg">
                  <AlignHorizontalJustifyCenter className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
                    Dr. Nelson Ferreira
                  </span>
                  <span className="text-sm text-muted-foreground -mt-1">
                    Direito com propósito e performance.
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
                Revolucionando com tecnologia de ponta. Mais organização, segurança e controle para o seu dia a dia.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">nelsferreir@gmail.com</span>
                </div>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Brasília, Distrito Federal, Brasil</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section, index) => (
              <div key={section.title} className="xl:col-span-1">
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-muted-foreground hover:text-orange-700 dark:hover:text-orange-400 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              {/* Copyright */}
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} <span className="font-semibold text-foreground/80">Dr. Nelson Ferreira</span>. Todos os direitos reservados.
                </p>
              </div>

              {/* Social Links and Secondary Navigation */}
              <div className="flex items-center gap-6">
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <Link 
                    href="#" 
                    className="text-muted-foreground/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="#" 
                    className="text-muted-foreground/60 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                </div>

                {/* Legal Links */}
                <nav className="flex items-center gap-6">
                  <Link 
                    href="/terms" 
                    className="text-sm text-muted-foreground hover:text-orange-700 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    Termos
                  </Link>
                  <Link 
                    href="/privacy" 
                    className="text-sm text-muted-foreground hover:text-orange-700 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    Privacidade
                  </Link>
                  <Link 
                    href="/cookies" 
                    className="text-sm text-muted-foreground hover:text-orange-700 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    Cookies
                  </Link>
                </nav>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cable className="h-3 w-3 text-green-500" />
                Sistema 100% seguro e criptografado (+Conformidade com a LGPD)
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                <AlignHorizontalJustifyCenter className="h-3 w-3 text-orange-500" />
                Desenvolvido para performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
); }