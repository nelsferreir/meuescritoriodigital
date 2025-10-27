import Link from "next/link";
import { getDashboardMetrics, getSystemAlerts } from "@/lib/actions/dashboard.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Briefcase, Calendar, FileText, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { 
    clientCount, 
    activeCasesCount,
    upcomingDeadlines,
    totalDocumentsCount,
    recentActivitiesCount,
    successRate,
    recentActivityFeed
  } = await getDashboardMetrics();

  const systemAlerts = await getSystemAlerts();

  const stats = [
    {
      title: "Total de Clientes",
      value: clientCount,
      description: `${clientCount} clientes no sistema`,
      icon: <Users className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
    },
    {
      title: "Casos Ativos",
      value: activeCasesCount,
      description: `${activeCasesCount} processos em andamento`,
      icon: <Briefcase className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
    },
    {
      title: "Prazos Próximos",
      value: upcomingDeadlines,
      description: "Prazos nos próximos 7 dias",
      icon: <Calendar className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
    },
    {
      title: "Documentos Totais",
      value: totalDocumentsCount,
      description: `${totalDocumentsCount} arquivos armazenados`,
      icon: <FileText className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
    },
    {
      title: "Movimentações Recentes",
      value: recentActivitiesCount,
      description: "Atualizações nos últimos 7 dias",
      icon: <Activity className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
    },
    {
      title: "Taxa de Sucesso",
      value: `${successRate}%`,
      description: "Baseado nos casos fechados",
      icon: <CheckCircle className="h-8 w-8 text-stone-500 dark:text-stone-400" />,
  }, ];

  const quickActions = [
    { label: "Adicione um Novo Cliente", href: "/dashboard/clientes/novo", icon: Users },
    { label: "Adicione um Novo Caso", href: "/dashboard/casos/novo", icon: Briefcase },
    { label: "Adicione Documentos aos Casos", href: "/dashboard/documentos/", icon: FileText },
    { label: "Consultar Calendário", href: "/dashboard/calendario", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent dark:from-stone-200 dark:to-stone-400">
          Painel de Controle Inicial
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Mais do que dados — um relacionamento bem gerido. Com movimentações recentes, alertas e muito mais!
        </p>
      </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <Link
          key={index}
          href={action.href}
          className="group relative flex flex-col justify-end p-4 bg-card rounded-lg border border-stone-200 dark:border-border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-28"
        >
          <div className="absolute -top-3 right-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <action.icon className="h-6 w-6" />
          </div>
          <span className="font-bold text-card-foreground text-base">
            {action.label}
          </span>
          <span className="text-xs text-muted-foreground">
            Clique para iniciar
          </span>
        </Link>
      ))}
    </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <CardContent className="p-6 text-center flex-1">
              <div className="flex flex-col items-center gap-3">
                {stat.icon}
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="text-4xl font-bold text-card-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground min-h-[2.5rem]">{stat.description}</p>
              </div>
            </CardContent>
            {stat.title === "Taxa de Sucesso" && (
                <div className="px-6 pb-6">
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
              )}
          </Card>
        ))}
      </div>

      {/* Recent Activity and Alerts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivityFeed.length > 0 ? recentActivityFeed.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.entity === "client" ? "bg-green-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{activity.type}: <span className="font-normal">{activity.name}</span></p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.time, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-center text-muted-foreground py-4">Nenhuma movimentação recente.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.type === "success" ? "bg-green-500" :
                    alert.type === "warning" ? "bg-amber-500" :
                    "bg-blue-500"
                  }`} />
                  <p className="text-sm text-card-foreground flex-1">{alert.message}</p>
                  {alert.link && (
                    <Link href={alert.link}>
                      <Button variant="link" size="sm" className="text-orange-600 hover:text-orange-700 font-semibold p-0 h-auto dark:text-orange-400 dark:hover:text-orange-500">
                        Ver
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
); }