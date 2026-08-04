import { useState } from "react";
import { Save, ClipboardList } from "lucide-react";

export default function OrdemServico() {

  const [os, setOs] = useState({
    cliente: "",
    telefone: "",
    aparelho: "",
    imei: "",
    senha: "",
    defeito: "",
    diagnostico: "",
    servico: "",
    pecas: "",
    valor: "",
    status: "Aguardando análise"
  });


  function alterar(e){

    setOs({
      ...os,
      [e.target.name]: e.target.value
    });

  }



  function salvar(){

    console.log(os);

    alert("Ordem de serviço criada!");

  }



return (

<div className="empresaPage">


<h1>
<ClipboardList size={32}/>
 Ordem de Serviço
</h1>


<div className="empresaCard">


<div className="grid">


<div>
<label>Cliente</label>

<input
name="cliente"
value={os.cliente}
onChange={alterar}
/>

</div>



<div>
<label>Telefone</label>

<input
name="telefone"
value={os.telefone}
onChange={alterar}
/>

</div>



<div>
<label>Aparelho</label>

<input
name="aparelho"
value={os.aparelho}
onChange={alterar}
/>

</div>



<div>
<label>IMEI</label>

<input
name="imei"
value={os.imei}
onChange={alterar}
/>

</div>



<div>
<label>Senha do aparelho</label>

<input
name="senha"
value={os.senha}
onChange={alterar}
/>

</div>



<div>

<label>Status</label>

<select
name="status"
value={os.status}
onChange={alterar}
>

<option>
Aguardando análise
</option>

<option>
Em reparo
</option>

<option>
Pronto
</option>

<option>
Entregue
</option>


</select>

</div>


</div>



<label>Defeito informado</label>

<textarea
className="mensagem"
name="defeito"
value={os.defeito}
onChange={alterar}
/>



<label>Diagnóstico técnico</label>

<textarea
className="mensagem"
name="diagnostico"
value={os.diagnostico}
onChange={alterar}
/>



<label>Serviço realizado</label>

<textarea
className="mensagem"
name="servico"
value={os.servico}
onChange={alterar}
/>



<label>Peças utilizadas</label>

<textarea
className="mensagem"
name="pecas"
value={os.pecas}
onChange={alterar}
/>



<label>Valor total</label>

<input
name="valor"
value={os.valor}
onChange={alterar}
/>



<button onClick={salvar}>

<Save size={18}/>

Criar Ordem de Serviço

</button>



</div>


</div>

)

}