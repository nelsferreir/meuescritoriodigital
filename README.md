# Meu Escritório Digital

**Meu Escritório Digital** é um sistema de gestão completo e simplificado para advogados e pequenos escritórios de advocacia. A plataforma centraliza o gerenciamento de clientes, casos, documentos e prazos, oferecendo uma interface intuitiva e segura para otimizar a rotina jurídica.

O sistema foi construído com foco na performance e na segurança, utilizando tecnologias modernas para garantir uma experiência de usuário fluida e a proteção dos dados sensíveis dos clientes.

## ✨ Principais Funcionalidades

O projeto conta com um robusto sistema de autenticação e gerenciamento de dados, dividido nas seguintes funcionalidades:

  * **Painel de Controle (Dashboard):** Visão geral e inteligente do escritório, com métricas importantes como total de clientes, casos ativos, prazos próximos e um feed de atividades recentes.
  * **Gestão de Clientes:**
      * Cadastro, edição e exclusão de clientes.
      * Busca dinâmica por nome, email ou telefone.
      * Página de detalhes do cliente, exibindo todos os casos vinculados/page.tsx].
      * Exportação da lista de clientes para um relatório em PDF.
  * **Gestão de Casos:**
      * Criação de casos vinculados a um cliente específico.
      * Atualização de informações como título, descrição, número do processo e status (Aberto, Pendente, Fechado).
      * Definição de prazos finais para os casos.
  * **Gestão de Documentos:**
      * Upload de múltiplos documentos por caso, com armazenamento seguro em nuvem.
      * Página central para visualização e busca de todos os documentos do escritório.
      * Download e exclusão segura de arquivos.
  * **Calendário de Prazos:** Uma página dedicada para visualizar todos os prazos dos casos em ordem cronológica, facilitando o acompanhamento.
  * **Autenticação e Segurança:**
      * Sistema de cadastro e login de usuários.
      * Funcionalidade de recuperação de senha por e-mail.
      * Rotas protegidas que garantem que apenas usuários autenticados acessem o painel de controle.

## 💻 Tecnologias Utilizadas

Este projeto foi construído com um conjunto de tecnologias modernas para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento:

  * **Framework:** [Next.js](https://nextjs.org/) (com App Router)
  * **Backend e Banco de Dados:** [Supabase](https://supabase.io/) (PostgreSQL, Autenticação, Storage)
  * **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
  * **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
  * **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) (construído sobre Radix UI)
  * **Ícones:** [Lucide React](https://lucide.dev/)
  * **State Management:** React Server Components com Server Actions para mutações de dados.

## 🚀 Rodando Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

### Pré-requisitos

  * Node.js (versão 20.9.0 ou superior)
  * npm (ou um gerenciador de pacotes de sua preferência)
  * Uma conta no [Supabase](https://supabase.com/)

### Configuração do Ambiente

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/nelsferreir/meuescritoriodigital.git
    cd meuescritoriodigital
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

      * Renomeie o arquivo `.env.example` (se existir) para `.env.local`.
      * Acesse o painel do seu projeto no Supabase.
      * Vá para **Project Settings \> API**.
      * Copie a **Project URL** e a **anon public key**.
      * Cole esses valores no seu arquivo `.env.local` e adicione a URL base para o ambiente de desenvolvimento:

    <!-- end list -->

    ```env
    NEXT_PUBLIC_SUPABASE_URL=SUA_URL_DO_PROJETO
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

    *A variável `NEXT_PUBLIC_BASE_URL` é essencial para que os links de e-mail (como o de redefinição de senha) funcionem corretamente no ambiente de desenvolvimento local.*
    ```

### Configuração do Banco de Dados Supabase

Para que o projeto funcione, você precisa criar as tabelas necessárias no seu banco de dados Supabase. Execute os seguintes scripts SQL no **SQL Editor** do seu projeto:

*Insira aqui os scripts SQL para criar as tabelas `workspaces`, `profiles`, `clients`, `cases` e `documents`.*

### Configuração de Segurança (RLS)

É **essencial** ativar as Políticas de Segurança (Row Level Security) para proteger os dados. Execute os scripts SQL para criar as políticas de acesso às tabelas e ao Storage.

*Insira aqui os scripts SQL para as políticas RLS.*

### Executando o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.


## 🗺️ Roadmap de Futuras Funcionalidades

Para transformar o "Meu Escritório Digital" em uma solução SaaS (Software as a Service) completa e robusta para o mercado jurídico, os próximos passos planejados incluem:

* **Implementação de Planos e Assinaturas:**
    * Criação de um sistema de controle de acesso, onde novos cadastros serão gerenciados por um administrador ou através de códigos de convite (`invitation codes`).
    * Integração com um gateway de pagamento (como Stripe) para gerenciar mensalidades e diferentes níveis de planos (ex: Básico, Profissional).

* **Funcionalidades para Times (Workspaces):**
    * Permitir que o "dono" de um escritório (workspace) possa convidar outros membros (advogados, estagiários, secretários) para sua equipe.
    * Criação de diferentes níveis de permissão (Admin, Membro), controlando quem pode ver, criar ou deletar clientes e casos.

* **Relatórios e Análises Avançadas:**
    * Desenvolvimento de um painel de relatórios para que o administrador possa extrair métricas de produtividade, faturamento por caso, e outras análises importantes para a gestão do escritório.

* **Integrações Externas:**
    * Integração com calendários externos, como Google Calendar e Outlook, para sincronizar os prazos dos casos.
    * Possibilidade de integrações com outras ferramentas jurídicas via API.

* **Sistema de Notificações Aprimorado:**
    * Envio de notificações por e-mail ou dentro do sistema sobre prazos que estão se aproximando, atualizações em casos importantes e outras atividades relevantes.

Este roadmap visa evoluir o projeto de uma ferramenta pessoal para uma plataforma multiusuário, segura e monetizável, atendendo às necessidades de advogados e escritórios modernos.