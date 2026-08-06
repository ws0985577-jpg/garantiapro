import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function Cadastro(){

const navigate = useNavigate();


const [dados,setDados] = useState({
empresa:"",
email:"",
senha:"",
confirmarSenha:"",
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

setErro("As senhas não conferem.");
return;

}




// CRIA USUÁRIO

const {data:userData,error:userError} = await supabase.auth.signUp({

email:dados.email,

password:dados.senha,

options:{

data:{
empresa:dados.empresa
}

}

});




if(userError){

setErro(userError.message);
return;

}




const user = userData.user;




if(user){


// DATA FINAL DO TESTE 7 DIAS

const dataFim = new Date();

dataFim.setDate(
dataFim.getDate()+7
);




// CRIA EMPRESA

const {error:empresaError} = await supabase

.from("empresas")

.insert({

nome:dados.empresa,

email:dados.email,

user_id:user.id,

plano:"Teste Grátis",

plano_ativo:"Teste",

status:"ativo",

data_inicio:new Date(),

data_fim:dataFim

});




if(empresaError){

console.log(empresaError);

setErro(
"Erro ao criar empresa"
);

return;

}



}





alert(
"Conta criada! Você tem 7 dias grátis."
);



navigate("/login");

}





return (

<div className="loginCard">


<h1>
Criar conta
</h1>


<p>
Cadastre sua assistência no GarantiaPro
</p>



<input

name="empresa"

placeholder="Nome da empresa"

value={dados.empresa}

onChange={alterar}

required

/>




<input

type="email"

name="email"

placeholder="Digite seu Gmail"

value={dados.email}

onChange={alterar}

required

/>




<input

type="password"

name="senha"

placeholder="Crie uma senha"

value={dados.senha}

onChange={alterar}

required

/>





<input

type="password"

name="confirmarSenha"

placeholder="Digite a senha novamente"

value={dados.confirmarSenha}

onChange={alterar}

required

/>




{
erro &&

<p>
{erro}
</p>

}




<button

className="btn btnPrimary loginButton"

type="submit"

onClick={criarConta}

>

Criar conta

</button>




<Link

to="/login"

className="backLink"

>

Já tenho conta

</Link>



</div>

);


}


export default Cadastro;