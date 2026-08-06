import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarOrdem } from "../services/ordens";
import { supabase } from "../services/supabase";
import { Printer, MessageCircle, ArrowLeft } from "lucide-react";


export default function DetalheOrdem(){

const { id } = useParams();
const navigate = useNavigate();

const [os,setOs] = useState(null);
const [empresa,setEmpresa] = useState(null);



async function carregar(){

const dados = await buscarOrdem(id);

setOs(dados);

}



async function carregarEmpresa(){

const {
data:{user}
}= await supabase.auth.getUser();


if(!user) return;



const {data,error}= await supabase

.from("empresas")

.select("*")

.eq("user_id",user.id)

.single();



if(!error){

setEmpresa(data);

}

}



useEffect(()=>{

carregar();
carregarEmpresa();

},[]);





if(!os){

return (

<div className="empresaPage">

<h2>Carregando ordem...</h2>

</div>

)

}





function enviarWhatsApp(){


const mensagem = `

Olá ${os.cliente}, aqui é da ${empresa?.nome || "Assistência Técnica"}.

Sua Ordem de Serviço:

Número:
${os.numero_os}

Aparelho:
${os.aparelho}

Serviço:
${os.servico}

Valor:
R$ ${os.valor}

Obrigado pela preferência!

`;


const numero = os.telefone.replace(/\D/g,'');


window.open(

`https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`,

"_blank"

);


}





return (

<div className="empresaPage">



<div className="ordemTopo">

<div>

<h1>
📋 Ordem de Serviço
</h1>

<p>
Número: <strong>{os.numero_os}</strong>
</p>

</div>


<span className="statusOS">

{os.status}

</span>


</div>






<div className="acoesOS">


<button
className="btnVoltar"
onClick={()=>navigate("/admin/ordens")}
>

<ArrowLeft size={20}/>

</button>



<button
className="btnImprimir"
onClick={()=>window.print()}
>

<Printer size={22}/>

</button>



<button
className="btnWhatsapp"
onClick={enviarWhatsApp}
>

<MessageCircle size={22}/>

</button>


</div>







<div 
className="empresaCard ordemCard"
id="impressaoOS"
>






{/* CABEÇALHO */}

<div className="cabecalhoOS">



<div className="cabEsquerda">


<img

src={empresa?.logo}

className="logoOS"

alt="Logo"

/>


</div>






<div className="cabCentro">


<h1>

{empresa?.nome || "Assistência Técnica"}

</h1>


<p>
Assistência Técnica
</p>


<p>
📞 {empresa?.telefone || "-"}
</p>


<p>
📍 {empresa?.endereco || "-"}
</p>


</div>







<div className="cabDireita">


<h2>

ORDEM DE SERVIÇO

</h2>


<p>
Nº OS:
</p>


<strong>

{os.numero_os}

</strong>


</div>



</div>





<hr/>









<div className="blocoOS">

<h2>👤 Cliente</h2>

<p><b>Nome:</b> {os.cliente}</p>

<p><b>Telefone:</b> {os.telefone}</p>

<p><b>CPF:</b> {os.cpf || "-"}</p>

<p><b>Endereço:</b> {os.endereco || "-"}</p>

</div>







<div className="blocoOS">

<h2>📱 Aparelho</h2>

<p><b>Modelo:</b> {os.aparelho}</p>

<p><b>IMEI:</b> {os.imei || "-"}</p>

<p><b>Senha:</b> {os.senha || "-"}</p>

<p><b>Cor:</b> {os.cor || "-"}</p>

</div>







<div className="blocoOS">

<h2>🔧 Serviço</h2>

<p><b>Defeito:</b> {os.defeito || "-"}</p>

<p><b>Diagnóstico:</b> {os.diagnostico || "-"}</p>

<p><b>Serviço realizado:</b> {os.servico || "-"}</p>

</div>







<div className="blocoOS">

<h2>💰 Valores</h2>

<p><b>Peças:</b> {os.pecas || "-"}</p>


<h2 className="valorFinal">

TOTAL: R$ {os.valor || "0,00"}

</h2>


</div>







<div className="blocoOS">

<h2>📅 Controle</h2>


<p>
<b>Entrada:</b> {os.data_entrada || "-"}
</p>


<p>
<b>Entrega:</b> {os.previsao_entrega || "-"}
</p>


<p>
<b>Status:</b> {os.status}
</p>


</div>








<div className="blocoOS termo">

<h2>📜 Termo de Garantia</h2>


<p>
A garantia cobre somente o serviço realizado pela {empresa?.nome || "assistência"}.
</p>


<p>
Não cobre mau uso, quedas, líquidos ou danos externos.
</p>


<p>
O cliente declara estar ciente das condições do serviço.
</p>


<br/>


<p>
Assinatura do cliente:
</p>


<br/>


_____________________________


</div>






</div>


</div>


)


}