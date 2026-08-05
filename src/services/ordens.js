import { supabase } from "./supabase";


// PEGAR USUÁRIO LOGADO
async function pegarUsuario(){

  const {
    data:{user},
  } = await supabase.auth.getUser();


  if(!user){
    throw new Error("Usuário não está logado.");
  }


  return user;

}




// criar ordem
export async function criarOrdem(ordem){


const user = await pegarUsuario();


const {data,error} = await supabase

.from("ordens_servico")

.insert([

{
 ...ordem,
 user_id:user.id
}

])

.select()

.single();



if(error){

throw error;

}


return data;


}





// buscar ordens da empresa logada
export async function buscarOrdens(){


const user = await pegarUsuario();



const {data,error} = await supabase

.from("ordens_servico")

.select("*")

.eq("user_id",user.id)

.order("created_at",{ascending:false});



if(error){

throw error;

}


return data || [];


}







// buscar uma ordem
export async function buscarOrdem(id){


const user = await pegarUsuario();



const {data,error} = await supabase

.from("ordens_servico")

.select("*")

.eq("id",id)

.eq("user_id",user.id)

.single();



if(error){

throw error;

}


return data;


}







// atualizar status
export async function atualizarStatusOrdem(id,status){


const user = await pegarUsuario();



const {data,error} = await supabase

.from("ordens_servico")

.update({

status:status

})

.eq("id",id)

.eq("user_id",user.id)

.select()

.single();



if(error){

throw error;

}


return data;


}







// excluir ordem
export async function excluirOrdem(id){


const user = await pegarUsuario();



const {error} = await supabase

.from("ordens_servico")

.delete()

.eq("id",id)

.eq("user_id",user.id);



if(error){

throw error;

}


return true;


}