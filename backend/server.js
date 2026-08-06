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





app.post("/criar-pagamento", async (req,res)=>{


try{


const { plano } = req.body;


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


items:[

{

title:`GarantiaPro - Plano ${plano}`,

quantity:1,

currency_id:"BRL",

unit_price:valor

}

],




payment_methods:{


excluded_payment_types:[],


installments:12


},




back_urls:{


success:"https://garantiapro.com.br/admin",

failure:"https://garantiapro.com.br/admin/pagamento",

pending:"https://garantiapro.com.br/admin/pagamento"


}




}


});





res.json({

url:pagamento.init_point

});





}catch(error){


console.log("Erro Mercado Pago:",error);



res.status(500).json({

erro:"Erro ao criar pagamento"

});


}



});








// WEBHOOK MERCADO PAGO

app.post("/webhook", async (req,res)=>{


try{


console.log("Webhook recebido:",req.body);



if(req.body.type === "payment"){


const idPagamento = req.body.data.id;



const payment = new Payment(client);



const resultado = await payment.get({

id:idPagamento

});



console.log("Status pagamento:", resultado.status);




if(resultado.status === "approved"){


console.log("Pagamento aprovado!");



}



}



res.sendStatus(200);



}catch(error){


console.log("Erro webhook:",error);


res.sendStatus(500);


}



});








app.get("/",(req,res)=>{


res.send("GarantiaPro API Online");


});








app.listen(3000,()=>{


console.log("Mercado Pago rodando na porta 3000");


});