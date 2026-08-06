import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";


dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());



const client = new MercadoPagoConfig({

    accessToken: process.env.MP_ACCESS_TOKEN

});





// CRIAR PAGAMENTO

app.post("/criar-pagamento", async(req,res)=>{


try{


const { plano, user_id } = req.body;



let valor = 0;



if(plano === "Mensal"){

valor = 25.90;

}



if(plano === "Anual"){

valor = 99.90;

}



if(valor === 0){

return res.status(400).json({

erro:"Plano inválido"

});

}




const preference = new Preference(client);



const pagamento = await preference.create({

body:{


metadata:{

user_id:user_id,

plano:plano

},



items:[

{

title:`GarantiaPro - Plano ${plano}`,

quantity:1,

currency_id:"BRL",

unit_price:valor

}

],



payment_methods:{

installments:12

},



back_urls:{

success:"https://garantiapro.com.br/admin",

failure:"https://garantiapro.com.br/admin",

pending:"https://garantiapro.com.br/admin"

},


auto_return:"approved"



}


});




res.json({

url:pagamento.init_point

});



}catch(error){


console.log(error);


res.status(500).json({

erro:"Erro criar pagamento"

});


}


});








// WEBHOOK MERCADO PAGO


app.post("/webhook", async(req,res)=>{


try{


console.log("Webhook recebido:");

console.log(req.body);



if(req.body.type === "payment"){



const idPagamento = req.body.data.id;



const payment = new Payment(client);



const resultado = await payment.get({

id:idPagamento

});



console.log(
"Status:",
resultado.status
);




if(resultado.status === "approved"){



const user_id = resultado.metadata.user_id;

const plano = resultado.metadata.plano;



console.log(
"Ativando:",
user_id,
plano
);





const resposta = await fetch(

`${process.env.SUPABASE_URL}/rest/v1/empresas?user_id=eq.${user_id}`,

{


method:"PATCH",


headers:{


"Content-Type":"application/json",


apikey:process.env.SUPABASE_KEY,


Authorization:
`Bearer ${process.env.SUPABASE_KEY}`


},


body:JSON.stringify({


plano:plano,


plano_ativo:plano,


status:"ativo",


pagamento_id:idPagamento,


data_inicio:new Date(),



data_fim:

plano === "Mensal"

?

new Date(
Date.now()+30*24*60*60*1000
)

:

new Date(
Date.now()+365*24*60*60*1000
)


})


}


);



console.log(
"Supabase:",
await resposta.text()
);



}



}



res.sendStatus(200);



}catch(error){


console.log(
"Erro webhook:",
error
);


res.sendStatus(500);


}


});








app.get("/",(req,res)=>{


res.send(
"GarantiaPro API Online"
);


});






const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{


console.log(
"Servidor rodando na porta:",
PORT
);


});