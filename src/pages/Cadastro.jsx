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



// CONFERE SENHA

if(dados.senha !== dados.confirmarSenha){

setErro("As senhas não conferem");
return;

}




// CRIA LOGIN

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





// VERIFICA SE JÁ EXISTE EMPRESA

const {
data:empresaExiste

}= await supabase

.from("empresas")

.select("id")

.eq("user_id",user.id)

.maybeSingle();






// SE NÃO EXISTIR CRIA

if(!empresaExiste){


const hoje = new Date();


const fimTeste = new Date();

fimTeste.setDate(
fimTeste.getDate()+7
);





const {
error:erroEmpresa

}= await supabase

.from("empresas")

.insert({

user_id:user.id,

nome:dados.empresa,

email:dados.email,

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



}





alert(
"Conta criada! Você tem 7 dias grátis."
);



navigate("/login");

}





return(

<div>


<h1>
Criar conta
</h1>



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

placeholder="Confirme a senha"

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




<br/>


<Link to="/login">

Já tenho conta

</Link>



</div>

);


}



export default Cadastro;