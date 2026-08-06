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
  useNavigate,
  useLocation,
} from "react-router-dom";

import { sair } from "../services/auth";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";


function LayoutAdmin(){

const navigate = useNavigate();
const location = useLocation();

const [menuAberto,setMenuAberto] = useState(false);
const [empresa,setEmpresa] = useState(null);
const [verificando,setVerificando] = useState(true);



useEffect(()=>{

carregarEmpresa();

},[location.pathname]);





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



// PAGAMENTO ATIVO

if(data.status==="ativo"){

liberar=true;

}



// TESTE GRATIS 7 DIAS

if(
data.status==="inativo" &&
data.data_inicio
){

const inicio = new Date(data.data_inicio);

const hoje = new Date();


const diferenca =
hoje - inicio;


const dias =
diferenca /
(1000*60*60*24);



if(dias <= 7){

liberar=true;

}

}





setEmpresa({

...data,

liberar

});




// BLOQUEIO

if(
!liberar &&
location.pathname !== "/admin/pagamento"
){

navigate("/admin/pagamento");

}



setVerificando(false);



}





function encerrarSessao(){

sair();

navigate("/login");

}





function fecharMenu(){

setMenuAberto(false);

}





if(verificando){

return <h3>Verificando plano...</h3>;

}





return (

<div className="adminLayout">



<button
className="menuMobile"
onClick={()=>setMenuAberto(!menuAberto)}
>

{
menuAberto
?
<X size={28}/>
:
<Menu size={28}/>
}

</button>





<aside className={`sidebar ${menuAberto ? "ativo":""}`}>




<div className="sidebarBrand">


{
empresa?.logo ?

<img
src={empresa.logo}
className="logoEmpresaMenu"
/>

:

<span className="brandIcon">

<ShieldCheck size={25}/>

</span>

}



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



<NavLink to="/admin" end>

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