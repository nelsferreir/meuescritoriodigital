import Link from "next/link";
import { Briefcase, Users, FileText, Shield, Zap, ArrowRight, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Gerencie seus clientes com eficiência: histórico completo, documentos organizados e comunicação centralizada em um só lugar.",
      features: ["Perfil completo", "Histórico de interações", "Documentos vinculados"]
    },
    {
      icon: Briefcase,
      title: "Controle de Casos",
      description: "Tenha controle total sobre seus processos — visualize prazos, andamentos e metas com clareza e agilidade.",
      features: ["Linha do tempo", "Alertas de prazos", "Metas e progresso"]
    },
    {
      icon: FileText,
      title: "Documentos na Nuvem",
      description: "Armazene seus documentos com segurança e acesse tudo, de onde estiver, a qualquer momento.",
      features: ["Busca inteligente", "Versões automáticas", "Compartilhamento seguro"]
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Seus dados protegidos por criptografia de ponta a ponta e total conformidade com a LGPD.",
      features: ["Criptografia avançada", "Backup automático", "Conformidade LGPD"]
    },
    {
      icon: Zap,
      title: "Automações Inteligentes",
      description: "Elimine tarefas manuais e ganhe tempo com automações inteligentes que otimizam sua rotina.",
      features: ["Modelos", "Lembretes inteligentes", "Relatórios automáticos"]
    },
    {
      icon: Star,
      title: "Experiência Premium",
      description: "Interface intuitiva projetada especificamente para a rotina jurídica brasileira.",
      features: ["Design brasileiro", "Suporte especializado", "Atualizações contínuas"]
  } ];

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-orange-950 text-white">
        {/* Background Image w Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/sua-imagem.jpg"
            alt="Escritório jurídico"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-stone-900/80 to-orange-950/70" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-300 leading-tight">
                Direito com propósito e performance.
                <span className="block text-orange-400">Dr. Nelson Ferreira</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-stone-200 font-light leading-relaxed">
                O direito é dinâmico. A sua gestão também deve ser.
                <span className="block mt-2">Nós transformamos o trabalho jurídico em algo mais simples e eficaz.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-8">
              <Link href="/cadastro">
                <Button size="lg" className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-3 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-orange-600/25">
                  Saiba Mais
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10 px-8 py-3 text-lg rounded-full font-semibold backdrop-blur-sm">
                  Principais Funcionalidades
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                <span>Segurança de dados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                <span>Conformidade com a LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                <span>Suporte especializado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="w-full py-20 md:py-28 lg:py-32 bg-background relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-200 dark:to-zinc-400">
                Otimize seu Escritório
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Soluções inteligentes que se adaptam ao seu fluxo de trabalho; Economize horas de trabalho burocrático.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 text-white group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-amber-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link href="/cadastro">
              <Button size="lg" className="bg-gradient-to-r from-orange-700 to-amber-800 hover:from-orange-800 hover:to-amber-900 text-white px-12 py-6 text-lg rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex justify-center text-muted-foreground mt-4 text-sm gap-2">
              <p>Sem cartão de crédito</p><p>•</p><p>Setup em 2 minutos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full min-h-[380px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-stone-900 to-orange-950 text-white py-0">
        <div className="absolute inset-0">
          <Image
            src="/sua-imagem.jpg"
            alt="Escritório jurídico"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-stone-900/80 to-orange-950/70" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "600+", label: "Profissionais Satisfeitos" },
              { number: "10K+", label: "Processos Simplificados" },
              { number: "99.9%", label: "Estabilidade e Segurança Garantidas" },
              { number: "24/7", label: "Suporte Constante e Especializado" }
            ].map((stat, index) => (
              <div
                key={index}
                className="space-y-2 transition-transform transform hover:-translate-y-1 hover:scale-105 duration-300"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-orange-300 drop-shadow-lg">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-stone-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
); }