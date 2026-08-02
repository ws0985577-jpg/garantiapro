import { supabase } from "./supabase";

function converterGasto(item) {
  return {
    id: item.id,
    descricao: item.descricao,
    categoria: item.categoria || "",
    valor: Number(item.valor || 0),
    dataGasto: item.data_gasto,
    observacoes: item.observacoes || "",
    criadoEm: item.created_at,
  };
}

export async function listarGastos() {
  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .order("data_gasto", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(converterGasto);
}

export async function cadastrarGasto(dados) {
  const novoGasto = {
    descricao: dados.descricao.trim(),
    categoria: dados.categoria.trim() || null,
    valor: Number(dados.valor),
    data_gasto: dados.dataGasto,
    observacoes: dados.observacoes.trim() || null,
  };

  const { data, error } = await supabase
    .from("gastos")
    .insert(novoGasto)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return converterGasto(data);
}

export async function excluirGasto(id) {
  const { error } = await supabase
    .from("gastos")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}