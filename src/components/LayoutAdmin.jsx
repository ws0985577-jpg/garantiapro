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
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sair } from "../services/auth";
import { useState } from "react";


function LayoutAdmin() {


  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);



  function encerrarSessao() {

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


          <span className="brandIcon">

            <ShieldCheck size={25}/>

          </span>


          <div>

            <strong>GarantiaPro</strong>

            <small>Sistema de Gestão</small>

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