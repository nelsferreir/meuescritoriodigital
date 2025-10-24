import { getDashboardMetrics } from "@/lib/actions/dashboard.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { clientCount, activeCasesCount } = await getDashboardMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clientCount}</div>
          <p className="text-xs text-muted-foreground">
            {clientCount === 0
              ? "Nenhum cliente cadastrado ainda"
              : `Total de ${clientCount} clientes no sistema`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Casos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCasesCount}</div>
          <p className="text-xs text-muted-foreground">
             {activeCasesCount === 0
              ? "Nenhum caso em andamento"
              : `${activeCasesCount} casos em andamento`}
          </p>
        </CardContent>
      </Card>
    </div>
); }