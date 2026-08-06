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

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sair } from "../services/auth";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";


function LayoutAdmin() {

  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);

  const [empresa, setEmpresa] = useState(null);


  useEffect(() => {

    carregarEmpresa();

  }, []);



  async function carregarEmpresa(){

    const {data:{user}} = await supabase.auth.getUser();


    if(!user){
      navigate("/login");
      return;
    }


    const {data, error} = await supabase
    .from("empresas")
    .select("*")
    .eq("user_id", user.id)
    .single();



    if(error){

      console.log(error);
      return;

    }



    if(data){

      setEmpresa(data);


      // BLOQUEIA QUEM NÃO PAGOU
      if(
        data.status !== "ativo" &&
        window.location.pathname !== "/admin/pagamento"
      ){

        navigate("/admin/pagamento");

      }


    }


  }




  function encerrarSessao(){

    sair();

    navigate("/login");

  }



  function fecharMenu(){

    setMenuAberto(false);

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





      <aside className={`sidebar ${menuAberto ? "ativo" : ""}`}>



        <div className="sidebarBrand">


          {
            empresa?.logo

            ?

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


          <NavLink onClick={fecharMenu} to="/admin" end>

            <LayoutDashboard size={20}/>

            Dashboard

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/nova-garantia">

            <PlusCircle size={20}/>

            Nova Garantia

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/clientes">

            <Users size={20}/>

            Clientes

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/estoque">

            <Package size={20}/>

            Estoque

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/financeiro">

            <Wallet size={20}/>

            Financeiro

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/ordem-servico">

            <ClipboardList size={20}/>

            Ordem de Serviço

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/ordens">

            <ClipboardList size={20}/>

            Ordens Criadas

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/empresa">

            <Building2 size={20}/>

            Minha Assistência

          </NavLink>




          <NavLink onClick={fecharMenu} to="/admin/pagamento">

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