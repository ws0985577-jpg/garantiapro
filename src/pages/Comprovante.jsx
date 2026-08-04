import { useEffect, useState } from "react";
import { MessageCircle, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import { supabase } from "../services/supabase";

import {
  buscarGarantia,
  formatarData,
  formatarValor,
  statusGarantia,
} from "../services/garantias";


function Comprovante() {


const { codigo } = useParams();


const [garantia,setGarantia] = useState(null);
const [empresa,setEmpresa] = useState(null);
const [carregando,setCarregando] = useState(true);
const [erro,setErro] = useState("");



useEffect(()=>{


async function carregar(){


try{


const dados = await buscarGarantia(codigo);


setGarantia(dados);



if(dados?.user_id){


const {data} = await supabase
.from("empresas")
.select("*")
.eq("user_id",dados.user_id)
.single();


setEmpresa(data);


}


}catch(error){

setErro(error.message);

}

finally{

setCarregando(false);

}


}


carregar();


},[codigo]);





if(carregando){

return <h2>Carregando comprovante...</h2>;

}



if(erro){

return (

<div>

<h2>Erro</h2>

<p>{erro}</p>

<Link to="/">Voltar</Link>

</div>

);

}



const status = statusGarantia(garantia.validade);



const urlConsulta =
`${window.location.origin}/consulta?codigo=${garantia.codigo}`;



const fotos = garantia.fotosUrl || [];





function enviarWhatsApp(){


const telefone =
garantia.telefone.replace(/\D/g,"");


const mensagem =
encodeURIComponent(
`Olá ${garantia.cliente}!

Segue seu comprovante de garantia.

Código: ${garantia.codigo}

Consulta:
${urlConsulta}`
);


window.open(
`https://wa.me/55${telefone}?text=${mensagem}`,
"_blank"
);


}





return (


<main className="receiptPage">



<div className="receiptActions noPrint">


<button
className="btn btnPrimary"
onClick={()=>window.print()}
>

<Printer size={20}/>

Imprimir / PDF

</button>



<button
className="btn whatsappButton"
onClick={enviarWhatsApp}
>

<MessageCircle size={20}/>

WhatsApp

</button>



<Link to="/admin">

Voltar

</Link>


</div>





<article className="receipt">



<header>



<div className="receiptBrand">



{empresa?.logo && (

<img
src={empresa.logo}
className="receiptLogo"
/>

)}



<div>

<h1>

{empresa?.nome || "Assistência Técnica"}

</h1>


<p>

{empresa?.telefone || ""}

</p>


</div>


</div>




<div className={`status ${status.tipo}`}>

{status.texto}

</div>



</header>





<section className="receiptTitle">

<h2>
Comprovante de Garantia
</h2>

</section>





<section className="receiptGrid">


<div>

<span>Cliente</span>

<strong>{garantia.cliente}</strong>

</div>



<div>

<span>Aparelho</span>

<strong>{garantia.aparelho}</strong>

</div>



<div>

<span>IMEI</span>

<strong>{garantia.imei || "-"}</strong>

</div>



<div>

<span>Serviço</span>

<strong>{garantia.servico}</strong>

</div>



<div>

<span>Valor</span>

<strong>{formatarValor(garantia.valor)}</strong>

</div>



<div>

<span>Validade</span>

<strong>{formatarData(garantia.validade)}</strong>

</div>



</section>





{fotos.length > 0 && (

<section className="receiptPhotosSection">


<h3>

Fotos do aparelho

</h3>



<div className="receiptPhotosGrid">


{fotos.map((foto)=>(

<img
key={foto}
src={foto}
/>

))}


</div>



</section>

)}





<section className="warrantyTerms">


<h3>

Termos da garantia

</h3>


<p>

{empresa?.mensagem ||

"Esta garantia cobre somente o serviço realizado."}

</p>


</section>






<footer className="receiptFooter">


<QRCodeSVG
value={urlConsulta}
size={110}
/>


<p>

Consulte sua garantia pelo QR Code.

</p>


</footer>



</article>



</main>


);


}



export default Comprovante;