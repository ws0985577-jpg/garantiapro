import {
LayoutDashboard,
LogOut,
Package,
PlusCircle,
ShieldCheck,
Users,
Wallet,
Building2,
ClipboardList,
Menu,
X,
CreditCard,
} from "lucide-react";

import {
NavLink,
Outlet,
useNavigate
} from "react-router-dom";

import { sair } from "../services/auth";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";


function LayoutAdmin(){

const navigate = useNavigate();

const [menuAberto,setMenuAberto] = useState(false);
const [empresa,setEmpresa] = useState(null);
const [verificando,setVerificando] = useState(true);



useEffect(()=>{

carregarEmpresa();

},[]);



async function carregarEmpresa(){

const {
data:{
user
}
}= await supabase.auth.getUser();



if(!user){

navigate("/login");
return;

}



const {data,error}=await supabase
.from("empresas")
.select("*")
.eq("user_id",user.id)
.single();



if(error){

console.log(error);
setVerificando(false);
return;

}



let liberar=false;



// PAGO
if(data.status==="ativo"){

liberar=true;

}



// TESTE GRATIS
if(
data.status==="teste" &&
data.data_fim
){

const hoje=new Date();

const fim=new Date(data.data_fim);


if(hoje <= fim){

liberar=true;

}

}



setEmpresa({
...data,
liberar
});



if(
!liberar
){

navigate("/admin/pagamento");

}



setVerificando(false);


}



function encerrarSessao(){

sair();

navigate("/login");

}



if(verificando){

return <h3>Verificando plano...</h3>;

}



return (

<div className="adminLayout">


<aside className="sidebar">


<div className="sidebarBrand">


<span className="brandIcon">

<ShieldCheck size={25}/>

</span>


<div>

<strong>
{empresa?.nome || "GarantiaPro"}
</strong>


<small>
Sistema de Gestão
</small>


</div>


</div>



<nav>



{
empresa?.liberar &&

<>


<NavLink to="/admin">

<LayoutDashboard size={20}/>

Dashboard

</NavLink>



<NavLink to="/admin/nova-garantia">

<PlusCircle size={20}/>

Nova Garantia

</NavLink>



<NavLink to="/admin/clientes">

<Users size={20}/>

Clientes

</NavLink>



<NavLink to="/admin/estoque">

<Package size={20}/>

Estoque

</NavLink>



<NavLink to="/admin/financeiro">

<Wallet size={20}/>

Financeiro

</NavLink>



<NavLink to="/admin/ordem-servico">

<ClipboardList size={20}/>

Ordem de Serviço

</NavLink>



<NavLink to="/admin/ordens">

<ClipboardList size={20}/>

Ordens Criadas

</NavLink>



<NavLink to="/admin/empresa">

<Building2 size={20}/>

Minha Assistência

</NavLink>


</>

}



<NavLink to="/admin/pagamento">

<CreditCard size={20}/>

Planos

</NavLink>



</nav>



<button
className="logoutButton"
onClick={encerrarSessao}
>

<LogOut size={19}/>

Sair

</button>



</aside>



<section className="adminContent">

<Outlet/>

</section>



</div>

);


}


export default LayoutAdmin;