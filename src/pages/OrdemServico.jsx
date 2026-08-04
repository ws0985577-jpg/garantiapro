import { useState } from "react";
import { Save, ClipboardList } from "lucide-react";
import { criarOrdem } from "../services/ordens";


export default function OrdemServico() {


  const [os, setOs] = useState({

    cliente:"",
    telefone:"",
    aparelho:"",
    imei:"",
    senha:"",
    defeito:"",
    diagnostico:"",
    servico:"",
    pecas:"",
    valor:"",
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


      console.log("ANTES DO SUPABASE:", novaOs);



      const resposta = await criarOrdem(novaOs);



      console.log("DEPOIS DO SUPABASE:", resposta);



      alert("Ordem de serviço criada com sucesso!");



      setOs({

        cliente:"",
        telefone:"",
        aparelho:"",
        imei:"",
        senha:"",
        defeito:"",
        diagnostico:"",
        servico:"",
        pecas:"",
        valor:"",
        status:"Aguardando análise"

      });



    }catch(error){


      console.error("ERRO:", error);

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


<div className="grid">


<input 
placeholder="Cliente"
name="cliente"
value={os.cliente}
onChange={alterar}
/>


<input 
placeholder="Telefone"
name="telefone"
value={os.telefone}
onChange={alterar}
/>


<input 
placeholder="Aparelho"
name="aparelho"
value={os.aparelho}
onChange={alterar}
/>


<input 
placeholder="IMEI"
name="imei"
value={os.imei}
onChange={alterar}
/>


<input 
placeholder="Senha do aparelho"
name="senha"
value={os.senha}
onChange={alterar}
/>



<select
name="status"
value={os.status}
onChange={alterar}
>

<option>Aguardando análise</option>
<option>Em reparo</option>
<option>Pronto</option>
<option>Entregue</option>

</select>


</div>



<textarea
placeholder="Defeito informado"
name="defeito"
value={os.defeito}
onChange={alterar}
/>



<textarea
placeholder="Diagnóstico técnico"
name="diagnostico"
value={os.diagnostico}
onChange={alterar}
/>



<textarea
placeholder="Serviço realizado"
name="servico"
value={os.servico}
onChange={alterar}
/>



<textarea
placeholder="Peças utilizadas"
name="pecas"
value={os.pecas}
onChange={alterar}
/>



<input
placeholder="Valor total"
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