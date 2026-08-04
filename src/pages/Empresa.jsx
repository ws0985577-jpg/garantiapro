import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Save } from "lucide-react";

export default function Empresa() {

  const [empresa, setEmpresa] = useState({
    nome:"",
    telefone:"",
    email:"",
    responsavel:"",
    endereco:"",
    cidade:"",
    estado:"",
    instagram:"",
    logo:"",
    garantia_padrao:90,
    mensagem:""
  });


  const [arquivoLogo, setArquivoLogo] = useState(null);


  useEffect(()=>{
    carregarEmpresa();
  },[]);



  async function carregarEmpresa(){

    const {data:{user}} = await supabase.auth.getUser();

    if(!user) return;


    const {data,error} = await supabase
      .from("empresas")
      .select("*")
      .eq("user_id",user.id)
      .single();


    if(data){
      setEmpresa(data);
    }

  }



  function alterar(e){

    setEmpresa({
      ...empresa,
      [e.target.name]: e.target.value
    });

  }



  async function enviarLogo(){

    if(!arquivoLogo) return empresa.logo;


    const extensao =
      arquivoLogo.name.split(".").pop();


    const nomeArquivo =
      `${Date.now()}.${extensao}`;



    const {error} = await supabase.storage
      .from("logos")
      .upload(nomeArquivo,arquivoLogo,{
        cacheControl:"3600",
        upsert:false,
        contentType:arquivoLogo.type
      });



    if(error){
      throw error;
    }



    const {data} =
      supabase.storage
      .from("logos")
      .getPublicUrl(nomeArquivo);



    return data.publicUrl;

  }




  async function salvar(){

    try{


      const {data:{user}} =
      await supabase.auth.getUser();



      let logo = empresa.logo;



      if(arquivoLogo){

        logo = await enviarLogo();

      }



      const {error} =
      await supabase
      .from("empresas")
      .update({

        ...empresa,

        logo:logo,

        user_id:user.id

      })
      .eq("user_id",user.id);



      if(error){
        throw error;
      }



      alert("Assistência salva com sucesso!");

      carregarEmpresa();



    }catch(error){

      alert(error.message);

    }

  }



return (

<div className="empresaPage">

<h1>Minha Assistência</h1>


<div className="empresaCard">


<div className="grid">


<div>
<label>Nome da Assistência</label>
<input name="nome"
value={empresa.nome || ""}
onChange={alterar}/>
</div>


<div>
<label>Telefone</label>
<input name="telefone"
value={empresa.telefone || ""}
onChange={alterar}/>
</div>


<div>
<label>Email</label>
<input name="email"
value={empresa.email || ""}
onChange={alterar}/>
</div>


<div>
<label>Responsável</label>
<input name="responsavel"
value={empresa.responsavel || ""}
onChange={alterar}/>
</div>


<div>
<label>Endereço</label>
<input name="endereco"
value={empresa.endereco || ""}
onChange={alterar}/>
</div>


<div>
<label>Cidade</label>
<input name="cidade"
value={empresa.cidade || ""}
onChange={alterar}/>
</div>


<div>
<label>Estado</label>
<input name="estado"
value={empresa.estado || ""}
onChange={alterar}/>
</div>


<div>
<label>Instagram</label>
<input name="instagram"
value={empresa.instagram || ""}
onChange={alterar}/>
</div>



<div>

<label>Logo da Assistência</label>

<input
type="file"
accept="image/*"
onChange={(e)=>
setArquivoLogo(e.target.files[0])
}
/>


{empresa.logo && (

<img
src={empresa.logo}
width="120"
style={{
marginTop:"15px",
borderRadius:"10px"
}}
/>

)}


</div>



<div>
<label>Dias de garantia</label>

<input
name="garantia_padrao"
value={empresa.garantia_padrao || ""}
onChange={alterar}
/>

</div>


</div>



<label>Mensagem do comprovante</label>

<textarea
className="mensagem"
name="mensagem"
value={empresa.mensagem || ""}
onChange={alterar}
/>



<button onClick={salvar}>

<Save size={18}/>

Salvar Alterações

</button>


</div>


</div>


)

}