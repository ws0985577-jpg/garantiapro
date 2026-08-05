import { useState } from "react";
import { Save, ClipboardList } from "lucide-react";
import { criarOrdem } from "../services/ordens";


export default function OrdemServico() {


const [os,setOs] = useState({

cliente:"",
telefone:"",
cpf:"",
endereco:"",

aparelho:"",
imei:"",
senha:"",
cor:"",
estado_aparelho:"",

defeito:"",
diagnostico:"",
servico:"",

pecas:"",
valor_peca:"",
mao_obra:"",
valor:"",

data_entrada:"",
previsao_entrega:"",
observacao:"",

status:"Aguardando análise"

});



function alterar(e){

setOs({

...os,
[e.target.name]: e.target.value

});

}



async function salvar(){


try{


const novaOs = {

...os,

numero_os:
"OS-" + Date.now()

};



await criarOrdem(novaOs);



alert("Ordem de serviço criada com sucesso!");



setOs({

cliente:"",
telefone:"",
cpf:"",
endereco:"",

aparelho:"",
imei:"",
senha:"",
cor:"",
estado_aparelho:"",

defeito:"",
diagnostico:"",
servico:"",

pecas:"",
valor_peca:"",
mao_obra:"",
valor:"",

data_entrada:"",
previsao_entrega:"",
observacao:"",

status:"Aguardando análise"

});



}catch(error){

alert(error.message);

}


}




return (

<div className="empresaPage">


<h1>
<ClipboardList size={32}/>
 Ordem de Serviço
</h1>



<div className="empresaCard">



<h2>👤 Dados do Cliente</h2>


<div className="grid">


<input name="cliente" placeholder="Nome do cliente"
value={os.cliente} onChange={alterar}/>


<input name="telefone" placeholder="Telefone"
value={os.telefone} onChange={alterar}/>


<input name="cpf" placeholder="CPF"
value={os.cpf} onChange={alterar}/>


<input name="endereco" placeholder="Endereço"
value={os.endereco} onChange={alterar}/>


</div>




<h2>📱 Dados do Aparelho</h2>


<div className="grid">


<input name="aparelho" placeholder="Aparelho"
value={os.aparelho} onChange={alterar}/>


<input name="imei" placeholder="IMEI"
value={os.imei} onChange={alterar}/>


<input name="senha" placeholder="Senha/Padrão"
value={os.senha} onChange={alterar}/>


<input name="cor" placeholder="Cor"
value={os.cor} onChange={alterar}/>


</div>



<input
name="estado_aparelho"
placeholder="Estado do aparelho"
value={os.estado_aparelho}
onChange={alterar}
/>





<h2>🔧 Diagnóstico</h2>



<textarea
name="defeito"
placeholder="Defeito informado"
value={os.defeito}
onChange={alterar}
/>



<textarea
name="diagnostico"
placeholder="Diagnóstico técnico"
value={os.diagnostico}
onChange={alterar}
/>



<textarea
name="servico"
placeholder="Serviço realizado"
value={os.servico}
onChange={alterar}
/>





<h2>🧩 Peças e Valores</h2>



<textarea
name="pecas"
placeholder="Peças utilizadas"
value={os.pecas}
onChange={alterar}
/>



<div className="grid">


<input
name="valor_peca"
placeholder="Valor da peça"
value={os.valor_peca}
onChange={alterar}
/>



<input
name="mao_obra"
placeholder="Mão de obra"
value={os.mao_obra}
onChange={alterar}
/>



<input
name="valor"
placeholder="Valor total"
value={os.valor}
onChange={alterar}
/>


</div>





<h2>📅 Controle da OS</h2>


<div className="grid">


<input
type="date"
name="data_entrada"
value={os.data_entrada}
onChange={alterar}
/>



<input
type="date"
name="previsao_entrega"
value={os.previsao_entrega}
onChange={alterar}
/>



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



<textarea
name="observacao"
placeholder="Observações"
value={os.observacao}
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