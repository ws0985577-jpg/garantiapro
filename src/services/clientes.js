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
  };
}

export async function listarClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");

  if (error) throw new Error(error.message);

  return (data || []).map(converterCliente);
}

export async function buscarClientePorTelefone(telefone) {
  if (!telefone) return null;

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("telefone", telefone)
    .limit(1);

  if (error) throw new Error(error.message);

  return data?.length ? converterCliente(data[0]) : null;
}

export async function buscarClientePorNome(nome) {
  if (!nome) return null;

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("nome", nome)
    .limit(1);

  if (error) throw new Error(error.message);

  return data?.length ? converterCliente(data[0]) : null;
}

export async function criarOuAtualizarCliente(dados) {
  let cliente = null;

  if (dados.telefone) {
    cliente = await buscarClientePorTelefone(dados.telefone);
  }

  if (!cliente) {
    cliente = await buscarClientePorNome(dados.nome);
  }

  if (cliente) {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome: dados.nome,
        telefone: dados.telefone,
      })
      .eq("id", cliente.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return converterCliente(data);
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert({
      nome: dados.nome,
      telefone: dados.telefone,
      email: "",
      cpf: "",
      endereco: "",
      cidade: "",
      estado: "",
      observacoes: "",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return converterCliente(data);
}

export async function cadastrarCliente(dados) {
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
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return converterCliente(data);
}

export async function excluirCliente(id) {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}