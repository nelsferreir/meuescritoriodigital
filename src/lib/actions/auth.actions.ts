"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function signIn(
  previousState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: "Credenciais inválidas. Verifique seu e-mail e senha." };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signUp(previousState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "Por favor, preencha todos os campos." };
  }
  if (password.length < 6) {
    return { success: false, message: "A senha deve ter no mínimo 6 caracteres." };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "As senhas não coincidem." };
  }
    
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
    data: { full_name: name },
  }, });

  if (error) {
    return { success: false, message: "Falha ao cadastrar: Este e-mail pode já estar em uso." };
  }
  if (!data.user) {
    return { success: false, message: 'Não foi possível criar o usuário.' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, full_name: name });

  if (profileError) {
    return { success: false, message: 'Erro ao finalizar a criação do perfil.' };
  }
      
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({ owner_id: data.user.id, name: `Escritório de ${name}` })
    .select('id')
    .single();

  if (workspaceError || !workspace) {
    return { success: false, message: 'Erro ao criar o ambiente de trabalho inicial.' };
  }

  await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, profile_id: data.user.id, role: 'owner' });

  if (data.user && !data.session) {
    return {
      success: true,
      message: "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.",
  }; }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function requestPasswordReset(
  previousState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;
    
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("Password Reset Error:", error.message);
    return { success: false, message: "Não foi possível enviar o e-mail de recuperação." };
  }

  return { success: true, message: "Se uma conta com este e-mail existir, um link de recuperação foi enviado." };
}

export async function updatePassword(
  previousState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = await createClient();

  if (password.length < 6) {
    return { success: false, message: "A senha deve ter no mínimo 6 caracteres." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "As senhas não coincidem." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Update Password Error:", error.message);
    return { success: false, message: "Não foi possível atualizar a senha. O link pode ter expirado." };
  }

  return { success: true, message: "Senha atualizada com sucesso!" };
}