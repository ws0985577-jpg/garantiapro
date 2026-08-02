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
    userId: item.user_id,
  };
}


// Pega usuário logado
async function pegarUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não está logado.");
  }

  return user;
}



export async function listarGastos() {

  const user = await pegarUsuario();


  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("user_id", user.id)
    .order("data_gasto", { ascending: false })
    .order("created_at", { ascending: false });


  if (error) {
    throw new Error(error.message);
  }


  return (data || []).map(converterGasto);
}




export async function cadastrarGasto(dados) {

  const user = await pegarUsuario();


  const novoGasto = {

    descricao: dados.descricao.trim(),

    categoria:
      dados.categoria.trim() || null,

    valor:
      Number(dados.valor),

    data_gasto:
      dados.dataGasto,

    observacoes:
      dados.observacoes.trim() || null,


    user_id: user.id,

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