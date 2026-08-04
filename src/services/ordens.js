import { supabase } from "./supabase";


export async function criarOrdem(ordem) {

  console.log("ENVIANDO PARA SUPABASE:", ordem);


  const { data, error } = await supabase
    .from("ordens_servico")
    .insert([ordem])
    .select();


  console.log("RESPOSTA SUPABASE:", data);
  console.log("ERRO SUPABASE:", error);


  if(error){

    throw error;

  }


  return data[0];

}