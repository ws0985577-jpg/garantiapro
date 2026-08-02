import { supabase } from "./supabase";

const CHAVE_LOGIN = "garantiapro_admin_logado";


export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });


  if (error) {
    return {
      sucesso: false,
      mensagem: "E-mail ou senha incorretos.",
    };
  }


  localStorage.setItem(
    CHAVE_LOGIN,
    data.user.id
  );


  return {
    sucesso: true,
  };
}


export async function sair() {
  await supabase.auth.signOut();

  localStorage.removeItem(CHAVE_LOGIN);
}


export function estaLogado() {
  return Boolean(
    localStorage.getItem(CHAVE_LOGIN)
  );
}