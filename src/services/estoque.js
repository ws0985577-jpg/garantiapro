import { supabase } from "./supabase";

function converter(item) {
  return {
    id: item.id,
    nome: item.nome,
    categoria: item.categoria || "",
    codigo: item.codigo || "",
    quantidade: item.quantidade || 0,
    estoqueMinimo: item.estoque_minimo || 1,
    precoCompra: item.preco_compra || 0,
    precoVenda: item.preco_venda || 0,
    fornecedor: item.fornecedor || "",
    criadoEm: item.created_at,
  };
}

export async function listarPecas() {
  const { data, error } = await supabase
    .from("estoque")
    .select("*")
    .order("nome");

  if (error) throw new Error(error.message);

  return (data || []).map(converter);
}

export async function cadastrarPeca(dados) {
  const { data, error } = await supabase
    .from("estoque")
    .insert({
      nome: dados.nome,
      categoria: dados.categoria,
      codigo: dados.codigo,
      quantidade: Number(dados.quantidade),
      estoque_minimo: Number(dados.estoqueMinimo),
      preco_compra: Number(dados.precoCompra),
      preco_venda: Number(dados.precoVenda),
      fornecedor: dados.fornecedor,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return converter(data);
}

export async function excluirPeca(id) {
  const { error } = await supabase
    .from("estoque")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}