import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

setErro("As senhas não conferem");
return;

}




// CRIA USUARIO

const {
data,
error
}= await supabase.auth.signUp({

email:dados.email,

password:dados.senha

});



if(error){

setErro(error.message);
return;

}



const user = data.user;



if(!user){

setErro("Erro criando usuário");
return;

}




// CRIA EMPRESA COM TESTE GRATIS

const hoje = new Date();


const fimTeste = new Date();

fimTeste.setDate(
fimTeste.getDate()+7
);



const {error:erroEmpresa}= await supabase
.from("empresas")
.insert({

user_id:user.id,

nome:dados.empresa,

plano:"Teste Grátis",

status:"teste",

data_inicio:hoje,

data_fim:fimTeste

});



if(erroEmpresa){

console.log(erroEmpresa);

setErro(
"Erro criando empresa"
);

return;

}



alert(
"Conta criada! Você tem 7 dias grátis."
);



navigate("/login");


}



return(

<div className="loginCard">


<h1>
Criar conta
</h1>


<p>
Cadastre sua assistência no GarantiaPro
</p>



<form onSubmit={criarConta}>


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
>

Criar conta

</button>


</form>



<Link to="/login">

Já tenho conta

</Link>


</div>

);


}


export default Cadastro;