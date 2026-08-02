const CHAVE_LOGIN = "garantiapro_admin_logado";

export function entrar(email, senha) {
  const emailAdmin = import.meta.env.VITE_ADMIN_EMAIL || "admin@garantiapro.com"
  const senhaAdmin = import.meta.env.VITE_ADMIN_SENHA || "123456";

  if (email === emailAdmin && senha === senhaAdmin) {
    localStorage.setItem(CHAVE_LOGIN, "true");
    return { sucesso: true };
  }

  return { sucesso: false, mensagem: "E-mail ou senha incorretos." };
}

export function sair() {
  localStorage.removeItem(CHAVE_LOGIN);
}

export function estaLogado() {
  return localStorage.getItem(CHAVE_LOGIN) === "true";
}
