import { supabase } from "./supabase";

function converterCliente(item) {
  return {
    id: item.id,
    nome: item.nome,
    telefone: item.telefone || "",
    email: item.email || "",
    cpf: item.cpf || "",
    endereco: item.endereco || "",
    cidade: item.cidade || "",
    estado: item.estado || "",
    observacoes: item.observacoes || "",
    criadoEm: item.created_at,
    userId: item.user_id,
  };
}


// PEGA USUÁRIO LOGADO
async function pegarUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não está logado.");
  }

  return user;
}


export async function listarClientes() {

  const user = await pegarUsuario();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", user.id)
    .order("nome");


  if (error) {
    throw new Error(error.message);
  }


  return (data || []).map(converterCliente);
}



export async function buscarClientePorTelefone(telefone) {

  const user = await pegarUsuario();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("telefone", telefone)
    .eq("user_id", user.id)
    .limit(1);


  if (error) {
    throw new Error(error.message);
  }


  return data?.length
    ? converterCliente(data[0])
    : null;
}



export async function criarOuAtualizarCliente(dados) {

  const user = await pegarUsuario();

  const { data, error } = await supabase
    .from("clientes")
    .insert({

      nome: dados.nome,
      telefone: dados.telefone,

      email: dados.email || "",
      cpf: dados.cpf || "",
      endereco: dados.endereco || "",
      cidade: dados.cidade || "",
      estado: dados.estado || "",
      observacoes: dados.observacoes || "",

      user_id: user.id,

    })
    .select()
    .single();


  if (error) {
    throw new Error(error.message);
  }


  return converterCliente(data);
}



export async function cadastrarCliente(dados) {

  const user = await pegarUsuario();


  const { data, error } = await supabase
    .from("clientes")
    .insert({

      nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      email: dados.email.trim(),

      cpf: dados.cpf.trim(),
      endereco: dados.endereco.trim(),
      cidade: dados.cidade.trim(),
      estado: dados.estado.trim(),
      observacoes: dados.observacoes.trim(),

      user_id: user.id,

    })
    .select()
    .single();



  if (error) {
    throw new Error(error.message);
  }


  return converterCliente(data);
}



export async function excluirCliente(id) {

  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);


  if (error) {
    throw new Error(error.message);
  }

}