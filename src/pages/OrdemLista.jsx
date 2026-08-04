import { useEffect, useState } from "react";
import { buscarOrdens } from "../services/ordens";
import { Eye, Trash2 } from "lucide-react";


export default function OrdemLista(){


const [ordens,setOrdens] = useState([]);



async function carregar(){


 const dados = await buscarOrdens();

 setOrdens(dados);


}



useEffect(()=>{

 carregar();

},[]);



return (

<div className="empresaPage">


<h1>
📋 Ordens de Serviço
</h1>



<div className="empresaCard">


<table>


<thead>

<tr>

<th>Nº OS</th>

<th>Cliente</th>

<th>Aparelho</th>

<th>Status</th>

<th>Ações</th>

</tr>

</thead>



<tbody>


{
ordens.map((os)=>(


<tr key={os.id}>


<td>

{os.numero_os}

</td>


<td>

{os.cliente}

</td>


<td>

{os.aparelho}

</td>


<td>

{os.status}

</td>


<td>


<button>

<Eye size={18}/>

</button>


<button>

<Trash2 size={18}/>

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