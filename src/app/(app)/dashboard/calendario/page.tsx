import { getAllCases } from "@/lib/actions/case.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CalendarioPage() {
  const cases = await getAllCases();
  const deadlines = cases
    .filter(c => c.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Calendário de Prazos</h1>
        <p className="text-stone-600 dark:text-stone-400 text-base">
          Confira os prazos de todos os seus casos datados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Próximos Prazos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deadlines.length > 0 ? (
            <div className="space-y-4">
              {deadlines.map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-semibold text-lg text-primary">{new Date(d.deadline!).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    <p className="font-medium">{d.title}</p>
                    <Link href={`/dashboard/clientes/${d.client_id}`} className="text-sm text-muted-foreground hover:underline">
                      {d.clients?.name}
                    </Link>
                  </div>
                  <Link href={`/dashboard/casos/${d.id}/editar`}>
                     <Button variant="outline" size="sm" className="gap-2">
                        <Briefcase className="h-4 w-4" />
                        Ver Caso
                     </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              Nenhum prazo cadastrado nos casos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
); }