const API_URL = "http://localhost:3000";


export async function criarPagamento(plano){


try{


const resposta = await fetch(
`${API_URL}/criar-pagamento`,
{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

plano:plano

})


}

);



const dados = await resposta.json();



if(!resposta.ok){


throw new Error(

dados.erro || "Erro ao criar pagamento"

);


}



return dados.url;



}catch(error){


console.error(
"Erro Mercado Pago:",
error
);



throw error;



}


}