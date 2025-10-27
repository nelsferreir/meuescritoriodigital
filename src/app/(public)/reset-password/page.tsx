// src/app/(public)/reset-password/page.tsx
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
      <ResetPasswordForm />
    </main>
); }