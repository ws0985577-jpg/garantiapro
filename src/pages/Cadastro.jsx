import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Cadastro(){

const navigate = useNavigate();

const [dados,setDados] = useState({
empresa:"",
email:"",
senha:"",
confirmarSenha:""
});

const [erro,setErro] = useState("");


function alterar(e){

setDados({
...dados,
[e.target.name]: e.target.value
});

}



async function criarConta(e){

e.preventDefault();

setErro("");



if(dados.senha !== dados.confirmarSenha){

setErro("As senhas não conferem");
return;

}



// cria usuário

const {data,error} = await supabase.auth.signUp({

email:dados.email,

password:dados.senha,

options:{

data:{
empresa:dados.empresa
}

}

});



if(error){

setErro(error.message);
return;

}



const user = data.user;



// cria empresa com 7 dias grátis

await supabase
.from("empresas")
.insert({

user_id:user.id,

nome:dados.empresa,

status:"teste",

plano:"Teste Grátis",

data_inicio:new Date(),

data_fim:new Date(
Date.now() + 7 * 24 * 60 * 60 * 1000
)

});



alert("Conta criada! Você tem 7 dias grátis.");

navigate("/login");


}



return (

<div className="loginCard">


<h1>Criar conta</h1>

<p>
Cadastre sua assistência no GarantiaPro
</p>


<input
name="empresa"
placeholder="Nome da empresa"
value={dados.empresa}
onChange={alterar}
/>



<input
type="email"
name="email"
placeholder="Digite seu Gmail"
value={dados.email}
onChange={alterar}
/>



<input
type="password"
name="senha"
placeholder="Crie uma senha"
value={dados.senha}
onChange={alterar}
/>



<input
type="password"
name="confirmarSenha"
placeholder="Digite a senha novamente"
value={dados.confirmarSenha}
onChange={alterar}
/>



{
erro &&
<p>{erro}</p>
}



<button
className="btn btnPrimary loginButton"
onClick={criarConta}
>

Criar conta

</button>


<Link to="/login">
Já tenho conta
</Link>


</div>

);

}


export default Cadastro;