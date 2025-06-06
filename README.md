# Betilha - Gerenciador de Apostas Esportivas

## Sobre o Projeto

Betilha é uma plataforma para gerenciar e acompanhar apostas esportivas de forma inteligente, oferecendo análises e insights para melhorar seus resultados.

**URL do Projeto Original**: https://lovable.dev/projects/db0437c1-b218-4955-9f90-7268f84b761a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/db0437c1-b218-4955-9f90-7268f84b761a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Implantação na Vercel

Este projeto está configurado para ser facilmente implantado na Vercel. Siga estas etapas:

1. Crie uma conta na [Vercel](https://vercel.com) se ainda não tiver uma
2. Conecte sua conta GitHub à Vercel
3. Importe este repositório como um novo projeto
4. Configure as seguintes variáveis de ambiente na Vercel:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
5. Clique em "Deploy"

O arquivo `vercel.json` já está configurado para garantir que o roteamento do React funcione corretamente na Vercel.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/db0437c1-b218-4955-9f90-7268f84b761a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
