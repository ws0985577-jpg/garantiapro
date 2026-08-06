import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ShieldCheck } from "lucide-react";


function Cadastro() {


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

[e.target.name]: e.target.value,

});

}




async function criarConta(e){

e.preventDefault();

setErro("");



// confirmar senha

if(dados.senha !== dados.confirmarSenha){

setErro("As senhas não conferem.");

return;

}



const {error} = await supabase.auth.signUp({

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



alert(
"Conta criada com sucesso!"
);



navigate("/login");


}




return (


<main className="loginPage">


<form

className="loginCard"

onSubmit={criarConta}

autoComplete="off"

>



<div className="loginLogo">

<ShieldCheck size={38}/>

</div>




<h1>

Criar conta

</h1>




<p>

Cadastre sua assistência no GarantiaPro

</p>






<div className="campo">


<label>

Empresa

</label>



<input

name="empresa"

placeholder="Nome da empresa"

value={dados.empresa}

onChange={alterar}

required

/>

</div>







<div className="campo">


<label>

Gmail

</label>



<input

type="email"

name="email"

placeholder="Digite seu Gmail"

value={dados.email}

onChange={alterar}

required

/>

</div>







<div className="campo">


<label>

Senha

</label>



<input

type="password"

name="senha"

placeholder="Crie uma senha"

value={dados.senha}

onChange={alterar}

required

/>

</div>








<div className="campo">


<label>

Confirmar senha

</label>



<input

type="password"

name="confirmarSenha"

placeholder="Digite a senha novamente"

value={dados.confirmarSenha}

onChange={alterar}

required

/>

</div>







{erro && (

<div className="errorMessage">

{erro}

</div>

)}







<button

className="btn btnPrimary loginButton"

type="submit"

>

Criar conta

</button>








<Link

to="/login"

className="backLink"

>

Já tenho conta

</Link>




</form>



</main>


);


}



export default Cadastro;