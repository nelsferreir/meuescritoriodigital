// src/app/(public)/page.tsx

import Link from "next/link";
import { Briefcase, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-24 lg:py-32 xl:py-48">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                A gestão do seu escritório, simplificada e inteligente
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Centralize informações de clientes, gerencie casos e acesse documentos de qualquer lugar. Foque no que realmente importa: seus clientes.
              </p>
            </div>
            <Link href="/cadastro">
              <Button size="lg">Comece a usar gratuitamente</Button>
            </Link>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Principais Funcionalidades</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que você precisa em um só lugar</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nosso sistema foi pensado para otimizar a rotina de advogados, tornando a gestão de informações mais rápida e segura.
              </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-2 text-center">
              <div className="flex justify-center items-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Gestão de Clientes</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre e acesse rapidamente todas as informações relevantes dos seus clientes, de contatos a documentos.
              </p>
            </div>
            <div className="grid gap-2 text-center">
              <div className="flex justify-center items-center mb-4">
                <Briefcase className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Controle de Casos</h3>
              <p className="text-sm text-muted-foreground">
                Organize seus casos, acompanhe o status, e vincule clientes e documentos a cada processo de forma intuitiva.
              </p>
            </div>
            <div className="grid gap-2 text-center">
              <div className="flex justify-center items-center mb-4">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Documentos na Nuvem</h3>
              <p className="text-sm text-muted-foreground">
                Faça o upload de documentos importantes e acesse-os de qualquer dispositivo, com segurança e praticidade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}