import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarOrdens, atualizarStatusOrdem, excluirOrdem } from "../services/ordens";
import { Eye, Trash2 } from "lucide-react";


export default function OrdemLista(){


const [ordens,setOrdens] = useState([]);

const [busca,setBusca] = useState("");

const navigate = useNavigate();



async function carregar(){

try{

const dados = await buscarOrdens();

setOrdens(dados || []);

}catch(error){

console.log(error);

}

}





async function marcarPronto(id){

await atualizarStatusOrdem(id,"Pronto");

carregar();

}






async function deletarOrdem(id){


const confirmar = window.confirm(
"Deseja realmente excluir esta ordem?"
);


if(!confirmar){
return;
}


await excluirOrdem(id);


carregar();


}





useEffect(()=>{

carregar();

},[]);






const ordensFiltradas = ordens.filter((os)=>{


return (

os.cliente?.toLowerCase().includes(busca.toLowerCase()) ||

os.telefone?.includes(busca) ||

os.numero_os?.toLowerCase().includes(busca.toLowerCase()) ||

os.aparelho?.toLowerCase().includes(busca.toLowerCase())

);


});






return (

<div className="empresaPage">


<div className="ordemTopo">

<h1>
📋 Ordens de Serviço
</h1>

</div>





<div className="buscaOS">

<input

placeholder="🔎 Buscar cliente, telefone, aparelho ou Nº OS"

value={busca}

onChange={(e)=>setBusca(e.target.value)}

/>

</div>







<div className="resumoOS">


<div>

<strong>Total de OS</strong>

<span>{ordens.length}</span>

</div>




<div>

<strong>Aguardando</strong>

<span>

{
ordens.filter(
(os)=>os.status === "Aguardando análise"
).length
}

</span>

</div>




<div>

<strong>Prontas</strong>

<span>

{
ordens.filter(
(os)=>os.status === "Pronto"
).length
}

</span>

</div>


</div>







<div className="empresaCard">


<table>


<thead>

<tr>

<th>Nº OS</th>
<th>Cliente</th>
<th>Telefone</th>
<th>Aparelho</th>
<th>Data</th>
<th>Valor</th>
<th>Status</th>
<th>Ações</th>

</tr>

</thead>





<tbody>


{

ordensFiltradas.map((os)=>(


<tr key={os.id}>


<td>{os.numero_os}</td>


<td>
<strong>{os.cliente}</strong>
</td>


<td>{os.telefone}</td>


<td>{os.aparelho}</td>


<td>{os.data_entrada || "-"}</td>


<td>
R$ {os.valor || "0,00"}
</td>


<td>

<span className="statusOS">

{os.status}

</span>

</td>





<td className="acoes">



<button

className="btnVer"

title="Ver Ordem"

onClick={()=>navigate(`/admin/ordem/${os.id}`)}

>

<Eye size={20} color="white"/>

</button>






<button

className="btnImprimir"

title="Imprimir"

onClick={()=>{

navigate(`/admin/ordem/${os.id}`);

}}

>

🖨️

</button>






<button

className="btnPronto"

title="Pronto para retirar"

onClick={()=>marcarPronto(os.id)}

>

✅

</button>






<button

className="btnExcluir"

title="Excluir Ordem"

onClick={()=>deletarOrdem(os.id)}

>

<Trash2 size={20} color="white"/>

</button>



</td>


</tr>


))

}


</tbody>


</table>


</div>


</div>


)

}